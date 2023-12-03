
import requests
import os
import torch
import yaml
import logging
logger = logging.getLogger()

from llava.constants import IMAGE_TOKEN_INDEX, DEFAULT_IMAGE_TOKEN, DEFAULT_IM_START_TOKEN, DEFAULT_IM_END_TOKEN
from llava.conversation import conv_templates, SeparatorStyle
from llava.model.builder import load_pretrained_model
from llava.utils import disable_torch_init
from llava.mm_utils import process_images, tokenizer_image_token, get_model_name_from_path, KeywordsStoppingCriteria

from PIL import Image
from io import BytesIO
from transformers import TextStreamer
from pathlib import Path

class TrafficLLaVA:
  def __init__(self, model_args, system_prompt = None):
    self.model_name = get_model_name_from_path(model_args["model_path"])
    self.tokenizer, self.model, self.image_processor, self.context_len = load_pretrained_model(model_args["model_path"], model_args["model_base"], self.model_name, model_args["load_8bit"], model_args["load_4bit"], device=model_args["device"])

    if 'llama-2' in self.model_name.lower():
      conv_mode = "llava_llama_2"
    elif "v1" in self.model_name.lower():
      conv_mode = "llava_v1"
    elif "mpt" in self.model_name.lower():
      conv_mode = "mpt"
    else:
      conv_mode = "llava_v0"

    if model_args["conv_mode"] is not None and conv_mode != model_args["conv_mode"]:
      logger.debug('[WARNING] the auto inferred conversation mode is {}, while `--conv-mode` is {}, using {}'.format(conv_mode, model_args.conv_mode, model_args.conv_mode))
    else:
      model_args["conv_mode"] = conv_mode

    self.conv_mode = model_args["conv_mode"]
    
    self.system_prompt = system_prompt
    self.max_new_tokens = model_args["max_new_tokens"]
    self.temperature = model_args["temperature"]
    self.debug = model_args["debug"]

  def process_image_text_pair(self, image_filepath, text_inputs="", conv=None, roles=None):
    if conv is None or roles is None:
      default_conv, default_roles = self.create_convo()

      if conv is None:
        conv = default_conv

      if roles is None:
        roles = default_roles
        
    image, image_tensor = self.load_image_as_tensor(image_filepath)

    if not isinstance(text_inputs, list):
      text_inputs = [ text_inputs ]
    
    results = []
    for text_input in text_inputs:
      if len(conv.messages) == 0 and image is not None:
        # first message
        if self.model.config.mm_use_im_start_end:
          text_input = DEFAULT_IM_START_TOKEN + DEFAULT_IMAGE_TOKEN + DEFAULT_IM_END_TOKEN + '\n' + text_input
        else:
          text_input = DEFAULT_IMAGE_TOKEN + '\n' + text_input
        conv.append_message(roles[0], text_input)
        image = None
      else:
        # later messages
        conv.append_message(roles[0], text_input)
      conv.append_message(roles[1], None)
      prompt = conv.get_prompt()

      input_ids = tokenizer_image_token(prompt, self.tokenizer, IMAGE_TOKEN_INDEX, return_tensors='pt').unsqueeze(0).to(self.model.device)
      stop_str = conv.sep if conv.sep_style != SeparatorStyle.TWO else conv.sep2
      keywords = [stop_str]
      stopping_criteria = KeywordsStoppingCriteria(keywords, self.tokenizer, input_ids)
      streamer = TextStreamer(self.tokenizer, skip_prompt=True, skip_special_tokens=True)

      with torch.inference_mode():
        output_ids = self.model.generate(
          input_ids,
          images=image_tensor,
          do_sample=True if self.temperature > 0 else False,
          temperature=self.temperature,
          max_new_tokens=self.max_new_tokens,
          streamer=streamer,
          use_cache=True,
          stopping_criteria=[stopping_criteria])

      outputs = self.tokenizer.decode(output_ids[0, input_ids.shape[1]:]).strip()
      conv.messages[-1][-1] = outputs
      results.append(outputs)

      if self.debug:
        logger.debug({"prompt": prompt, "outputs": outputs})
    
    return results
  
  def create_convo(self):
    conv = conv_templates[self.conv_mode].copy()

    if self.system_prompt:
      logger.debug("Overwritting original system prompt: " + str(conv.system))
      conv.system = self.system_prompt

    roles = None
    if "mpt" in self.model_name.lower():
      roles = ('user', 'assistant')
    else:
      roles = conv.roles

    return conv, roles

  def load_image_as_tensor(self, image_filepath):
    # loading the image
    image = None
    if image_filepath.startswith('http://') or image_filepath.startswith('https://'):
      response = requests.get(image_filepath)
      image = Image.open(BytesIO(response.content)).convert('RGB')
    else:
      image = Image.open(image_filepath).convert('RGB')

    # Similar operation in model_worker.py
    # Transforming the image to a tensor
    image_tensor = process_images([image], self.image_processor, self.model.config)
    if type(image_tensor) is list:
      image_tensor = [image.to(self.model.device, dtype=torch.float16) for image in image_tensor]
    else:
      image_tensor = image_tensor.to(self.model.device, dtype=torch.float16)

    return image, image_tensor

class PromptFramework:
  def __init__(self, system_prompt, prompt_sequence, temperature):
    self.system_prompt = system_prompt
    self.prompt_sequence = prompt_sequence
    self.temperature = temperature

  def apply_on_image(self, model: TrafficLLaVA, image_input, save_path=None):
    original_prompt = model.system_prompt
    original_temperature = model.temperature

    model.system_prompt = self.system_prompt
    model.temperature = self.temperature

    results = []

    if isinstance(image_input, list):
      for image_path in image_input:
        image_caption_outputs = self.apply_on_image(model, image_path)
        results.append(image_caption_outputs)

      if save_path:
        if os.path.exists(Path(save_path).parent.absolute()):
          with open(save_path, "w") as output_file:
            data = yaml.safe_load(str({
              "system_prompt": self.system_prompt,
              "prompt_sequence" : self.prompt_sequence,
              "temperature": self.temperature,
              "image_input": image_input,
              "results": results,
            }))
            yaml.dump(data, output_file, default_flow_style=False)
        else:
          logger.debug("Directory to save prompt results does not exist!")

    else:
      conv, roles = model.create_convo()
      
      image_caption_output = model.process_image_text_pair(image_input, self.prompt_sequence, conv, roles)
      results.append(image_caption_output)
      
      if save_path:
        if os.path.exists(Path(save_path).parent.absolute()):
          with open(save_path, "w") as output_file:
            data = yaml.safe_load(str({
              "system_prompt": self.system_prompt,
              "prompt_sequence" : self.prompt_sequence,
              "temperature": self.temperature,
              "image_input": image_input,
              "results": results,
            }))
            yaml.dump(data, output_file, default_flow_style=False)
        else:
          logger.debug("Directory to save prompt results does not exist!")
          
    model.system_prompt = original_prompt
    model.temperature = original_temperature
    return results

def setup_model():
  logger.debug("Setting up the model (Setup_Model)")
  args = {
      "model_path": 'liuhaotian/llava-v1.5-13b',
      "model_base": None,
      "device": "cuda",
      "conv_mode": None,
      "max_new_tokens": 512,
      "temperature": 0.2,
      "load_8bit": False,
      "load_4bit": True,
      "debug": True,
  }

  traffic_llava = TrafficLLaVA(args)
  return traffic_llava

def test_model():
  args = {
      "model_path": 'liuhaotian/llava-v1.5-13b',
      "model_base": None,
      "device": "cuda",
      "conv_mode": None,
      "max_new_tokens": 512,
      "load_8bit": False,
      "load_4bit": True,
      "debug": True,
      "temperature": 0.2,
  }

  prompt = "What do you see"
  traffic_llava = TrafficLLaVA(args, prompt)
  traffic_llava.process_image_text_pair('/content/drive/MyDrive/Projects/Fyp_Data/000000/0.jpg', prompt)
  traffic_llava.process_image_text_pair('/content/drive/MyDrive/Projects/Fyp_Data/000001/0.jpg', prompt)
  traffic_llava.process_image_text_pair('/content/drive/MyDrive/Projects/Fyp_Data/000002/0.jpg', prompt)
  traffic_llava.process_image_text_pair('/content/drive/MyDrive/Projects/Fyp_Data/000003/0.jpg', prompt)
