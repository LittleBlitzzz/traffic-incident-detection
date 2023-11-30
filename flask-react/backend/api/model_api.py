from flask import Flask, Blueprint, request

import logging
import os

from backend import get_active_model
from traffic_llava.setup_model import PromptFramework

model_api = Blueprint("model-api", __name__)

logger = logging.getLogger()

@model_api.route("/ask-llava", methods=["POST"])
def ask_llava():
  results = { "error_message": "" }

  if request.method == "POST":

    request_json = request.get_json()
    logger.debug("Ask LLaVA - request : " + str(request_json))
    
    full_img_path = request_json.get("full_img_path", None)
    if full_img_path is None:
      dataset_name = request_json.get("dataset_name", None)
      video_name = request_json.get("video_name", None)
      image_filename = request_json.get("image_filename", None)

      if dataset_name is not None and video_name is not None and image_filename is not None:
        full_img_path = os.path.join(os.environ["dataset_path"], dataset_name, video_name, image_filename)

    if full_img_path is not None and os.path.exists(full_img_path):
      prompt_framework_args = request_json.get("prompt_framework", None)
      single_text_prompt = request_json.get("single_text_prompt", None)

      if prompt_framework_args is not None:
        model = get_active_model()
        prompt_framework = PromptFramework(**prompt_framework_args)
        model_output = prompt_framework.apply_on_image(model, full_img_path)
      elif single_text_prompt is not None:
        model = get_active_model()
        model_output = model.process_image_text_pair(full_img_path, single_text_prompt)
      else:
        model_output = "No proper inputs recevied!"

      logger.debug("LLaVA replies : " + str(model_output))

      results["model_output"] = model_output
    else:
      results["error_message"] += f"Image file (${full_img_path}) not found!\n"

  return results

