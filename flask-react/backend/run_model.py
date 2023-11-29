import torch

from llava.constants import IMAGE_TOKEN_INDEX, DEFAULT_IMAGE_TOKEN, DEFAULT_IM_START_TOKEN, DEFAULT_IM_END_TOKEN
from llava.conversation import conv_templates, SeparatorStyle
from llava.model.builder import load_pretrained_model
from llava.utils import disable_torch_init
from llava.mm_utils import process_images, tokenizer_image_token, get_model_name_from_path, KeywordsStoppingCriteria

from PIL import Image

import requests
from PIL import Image
from io import BytesIO
from transformers import TextStreamer

class TrafficLLaVA:
  def __init__(self, model_args, injected_prompt):
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
      print('[WARNING] the auto inferred conversation mode is {}, while `--conv-mode` is {}, using {}'.format(conv_mode, args.conv_mode, args.conv_mode))
    else:
      model_args["conv_mode"] = conv_mode

    self.conv_mode = model_args["conv_mode"]
    
    self.injected_prompt = injected_prompt
    self.max_new_tokens = model_args["max_new_tokens"]
    self.temperature = model_args["temperature"]
    self.debug = model_args["debug"]
  
  def process_image_text_pair(self, image_filepath, injected_prompt):
    print(f"{self.roles[1]}: ", end="")

    inp = injected_prompt

    conv, roles = self.create_convo()
    image, image_tensor = self.load_image_as_tensor(image_filepath)
    if image is not None:
      # first message
      if self.model.config.mm_use_im_start_end:
        inp = DEFAULT_IM_START_TOKEN + DEFAULT_IMAGE_TOKEN + DEFAULT_IM_END_TOKEN + '\n' + inp
      else:
        inp = DEFAULT_IMAGE_TOKEN + '\n' + inp
      conv.append_message(roles[0], inp)
      image = None
    else:
      # later messages
      conv.append_message(roles[0], inp)
    conv.append_message(roles[1], None)
    prompt = conv.get_prompt()

    input_ids = tokenizer_image_token(prompt, self.tokenizer, IMAGE_TOKEN_INDEX, return_tensors='pt').unsqueeze(0).to(self.model.device)
    stop_str = conv.sep if self.conv.sep_style != SeparatorStyle.TWO else conv.sep2
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

    if self.debug:
      print("\n", {"prompt": prompt, "outputs": outputs}, "\n")

  def create_convo(self):
    conv = conv_templates[self.conv_mode].copy()
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


# def load_image(image_file):
#   if image_file.startswith('http://') or image_file.startswith('https://'):
#     response = requests.get(image_file)
#     image = Image.open(BytesIO(response.content)).convert('RGB')
#   else:
#     image = Image.open(image_file).convert('RGB')
#   return image

# def setup_model(args):
#   # Model
#   disable_torch_init()

#   model_name = get_model_name_from_path(args["model_path"])
#   tokenizer, model, image_processor, context_len = load_pretrained_model(args["model_path"], args["model_base"], model_name, args["load_8bit"], args["load_4bit"], device=args["device"])

#   if 'llama-2' in model_name.lower():
#     conv_mode = "llava_llama_2"
#   elif "v1" in model_name.lower():
#     conv_mode = "llava_v1"
#   elif "mpt" in model_name.lower():
#     conv_mode = "mpt"
#   else:
#     conv_mode = "llava_v0"

#   if args["conv_mode"] is not None and conv_mode != args["conv_mode"]:
#     print('[WARNING] the auto inferred conversation mode is {}, while `--conv-mode` is {}, using {}'.format(conv_mode, args.conv_mode, args.conv_mode))
#   else:
#     args["conv_mode"] = conv_mode

#   conv = conv_templates[args["conv_mode"]].copy()
#   if "mpt" in model_name.lower():
#     roles = ('user', 'assistant')
#   else:
#     roles = conv.roles

#   return

# def main(args, input_prompt):
#     # Model
#   disable_torch_init()

#   model_name = get_model_name_from_path(args["model_path"])
#   tokenizer, model, image_processor, context_len = load_pretrained_model(args["model_path"], args["model_base"], model_name, args["load_8bit"], args["load_4bit"], device=args["device"])

#   if 'llama-2' in model_name.lower():
#       conv_mode = "llava_llama_2"
#   elif "v1" in model_name.lower():
#       conv_mode = "llava_v1"
#   elif "mpt" in model_name.lower():
#       conv_mode = "mpt"
#   else:
#       conv_mode = "llava_v0"

#   if args["conv_mode"] is not None and conv_mode != args["conv_mode"]:
#       print('[WARNING] the auto inferred conversation mode is {}, while `--conv-mode` is {}, using {}'.format(conv_mode, args.conv_mode, args.conv_mode))
#   else:
#       args["conv_mode"] = conv_mode

#   conv = conv_templates[args["conv_mode"]].copy()
#   if "mpt" in model_name.lower():
#       roles = ('user', 'assistant')
#   else:
#       roles = conv.roles
#   print(args["conv_mode"])

#   image = load_image(args["image_file"])
#   # Similar operation in model_worker.py
#   image_tensor = process_images([image], image_processor, model.config)
#   if type(image_tensor) is list:
#     image_tensor = [image.to(model.device, dtype=torch.float16) for image in image_tensor]
#   else:
#     image_tensor = image_tensor.to(model.device, dtype=torch.float16)

#   # while True:
#   #   try:
#   #     inp = input(f"{roles[0]}: ")
#   #   except EOFError:
#   #     inp = ""
#   #   if not inp:
#   #     print("exit...")
#   #     break

#   inp = input_prompt

#   print(f"{roles[1]}: ", end="")

#   if image is not None:
#     # first message
#     if model.config.mm_use_im_start_end:
#       inp = DEFAULT_IM_START_TOKEN + DEFAULT_IMAGE_TOKEN + DEFAULT_IM_END_TOKEN + '\n' + inp
#     else:
#       inp = DEFAULT_IMAGE_TOKEN + '\n' + inp
#     conv.append_message(conv.roles[0], inp)
#     image = None
#   else:
#     # later messages
#     conv.append_message(conv.roles[0], inp)
#   conv.append_message(conv.roles[1], None)
#   prompt = conv.get_prompt()

#   input_ids = tokenizer_image_token(prompt, tokenizer, IMAGE_TOKEN_INDEX, return_tensors='pt').unsqueeze(0).to(model.device)
#   stop_str = conv.sep if conv.sep_style != SeparatorStyle.TWO else conv.sep2
#   keywords = [stop_str]
#   stopping_criteria = KeywordsStoppingCriteria(keywords, tokenizer, input_ids)
#   streamer = TextStreamer(tokenizer, skip_prompt=True, skip_special_tokens=True)

#   with torch.inference_mode():
#     output_ids = model.generate(
#       input_ids,
#       images=image_tensor,
#       do_sample=True if args["temperature"] > 0 else False,
#       temperature=args["temperature"],
#       max_new_tokens=args["max_new_tokens"],
#       streamer=streamer,
#       use_cache=True,
#       stopping_criteria=[stopping_criteria])

#   outputs = tokenizer.decode(output_ids[0, input_ids.shape[1]:]).strip()
#   conv.messages[-1][-1] = outputs

#   if args["debug"]:
#     print("\n", {"prompt": prompt, "outputs": outputs}, "\n")


def test():
  args = {
      "model_path": 'liuhaotian/llava-v1.5-13b',
      "model_base": None,
      # "image_file": '/content/drive/MyDrive/Projects/Fyp_Data/000000/0.jpg',
      "device": "cuda",
      "conv_mode": None,
      "max_new_tokens": 512,
      "load_8bit": False,
      "load_4bit": True,
      "debug": True,
      "temperature": 0.2,
      "max_new_tokens": 512,
  }

  prompt = "What do you see"
  traffic_llava = TrafficLLaVA(args, prompt)
  traffic_llava.process_image_text_pair('/content/drive/MyDrive/Projects/Fyp_Data/000000/0.jpg', prompt)
  traffic_llava.process_image_text_pair('/content/drive/MyDrive/Projects/Fyp_Data/000001/0.jpg', prompt)
  traffic_llava.process_image_text_pair('/content/drive/MyDrive/Projects/Fyp_Data/000002/0.jpg', prompt)
  traffic_llava.process_image_text_pair('/content/drive/MyDrive/Projects/Fyp_Data/000003/0.jpg', prompt)
