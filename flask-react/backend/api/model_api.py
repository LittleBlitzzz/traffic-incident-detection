from flask import Flask, Blueprint, request

import os
import logging
import yaml
import pandas as pd
logger = logging.getLogger()

from traffic_llava.traffic_llava import PromptFramework, setup_model

model_api = Blueprint("model-api", __name__)

print("Setting up the model")
model = setup_model()

@model_api.route("/ask-llava", methods=["POST"])
def ask_llava():
  results = { "error_message": "" }

  if request.method == "POST":
    request_json = request.get_json()
    logger.debug("Ask LLaVA - request : " + str(request_json))

    full_img_path = request_json.get("full_img_path", None)
    dataset_name = request_json.get("dataset_name", None)
    video_name = request_json.get("video_name", None)
    image_filename = request_json.get("image_filename", None)
    prompt_framework_args = request_json.get("prompt_framework", None)
    single_text_prompt = request_json.get("single_text_prompt", None)
    save_path_name = os.path.join(os.environ["results_path"], request_json.get("save_path_name", "test.txt"))
    
    if full_img_path is None:
      if dataset_name is not None and video_name is not None and image_filename is not None:
        full_img_path = os.path.join(os.environ["datasets_path"], dataset_name, video_name, image_filename)

    logger.debug("Ask LLaVA - image path : " + full_img_path)
    if full_img_path is not None and os.path.exists(full_img_path):
      if prompt_framework_args is not None:
        prompt_framework = PromptFramework(**prompt_framework_args)
        model_output = prompt_framework.apply_on_image(model, full_img_path, save_path_name)
      elif single_text_prompt is not None:
        model_output = model.process_image_text_pair(full_img_path, single_text_prompt)
      else:
        model_output = "No proper inputs recevied!"

      logger.debug("LLaVA replies : " + str(model_output))

      results["model_output"] = model_output
    else:
      results["error_message"] += f"Image file (${full_img_path}) not found!\n"

  return results

@model_api.route("/test-on-annotated-data", methods=["POST"])
def test_on_annotated_data():
  results = { "error_message": "" }

  if request.method == "POST":
    request_json = request.get_json()
    logger.debug("Test LLaVA - request : " + str(request_json))
    
    dataset_name = request_json.get("dataset_name", "extracted_frames")
    prompt_framework_args = request_json.get("prompt_framework", None)
    output_directory = os.path.join(os.environ["results_path"], request_json.get("save_directory", "llava_test"))
    annotation_path = request_json.get("annotation_path", os.path.join(os.environ["results_path"], "annotations_compiled_20231206122224.csv"))

    annotation_df = pd.read_csv(annotation_path)
    annotated_image_filepaths = annotation_df["imagepath"]

    if prompt_framework_args is None:
      results["error_message"] += "No prompt framework received!\n"
    else:
      test_results = []
      results["test_results"] = test_results

      for index, image_filepath in enumerate(annotated_image_filepaths):
        full_img_path = os.path.join(os.environ["datasets_path"], dataset_name, image_filepath)

        logger.debug("Ask LLaVA - image path : " + full_img_path)

        prompt_framework = PromptFramework(**prompt_framework_args)
        model_output = prompt_framework.apply_on_image(model, full_img_path, os.path.join(output_directory, "results_" + str(index) + ".txt"))
        test_results.append(model_output)

        logger.debug("LLaVA replies : " + str(model_output))

      with open(os.path.join(output_directory, "results_total.yaml"), "w") as results_total_file:
        yaml.dump(test_results, results_total_file)

  return results
