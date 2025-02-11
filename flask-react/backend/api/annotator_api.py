from flask import Flask, Blueprint, request, send_file

from natsort import natsorted
import logging
import os

from traffic_llava.traffic_annotation import TrafficAnnotation, VideoAnnotation
from utils.ssim_tools import calculate_video_ssim

annotator_api = Blueprint("annotator-api", __name__)
logger = logging.getLogger()

@annotator_api.route("/videos-in-dataset/<dataset_name>", methods=["GET"])
def videos_in_dataset(dataset_name):
  results = { "error_message": "" }
  dataset_path = os.path.join(os.environ["datasets_path"], dataset_name)

  video_titles = []
  if os.path.exists(dataset_path):
    video_titles = natsorted(os.listdir(dataset_path))
    results["video_titles"] = video_titles
  else:
    results["error_message"] += "Dataset not found!\n"
  
  return results

@annotator_api.route("/images-in-video/<dataset_name>/<video_name>", methods=["GET"])
def images_in_video(dataset_name, video_name):
  results = { "error_message": "" }
  video_path = os.path.join(os.environ["datasets_path"], dataset_name, video_name)

  image_filenames = [ ]
  if os.path.exists(video_path):
    image_filenames = natsorted(os.listdir(video_path))
    results["image_filenames"] = image_filenames
  else:
    results["error_message"] += "Video not found!\n"
  
  return results

@annotator_api.route("/get-image/<dataset_name>/<video_name>/<image_filename>", methods=["GET"])
def get_image(dataset_name, video_name, image_filename):
  image_fullpath = os.path.join(os.environ["datasets_path"], dataset_name, video_name, image_filename)
  
  if os.path.exists(image_fullpath):
    return send_file(image_fullpath)
  else :
    return "Image not found!"

@annotator_api.route("/get-ssim-score/<dataset_name>/<video_name>/<float:ssim_threshold>", methods=["GET"])
def get_ssim_score(dataset_name, video_name, ssim_threshold):
  results = { "error_message": "" }
  video_path = os.path.join(os.path.join(os.environ["datasets_path"], dataset_name, video_name))

  if os.path.exists(video_path):
    frame_scores = calculate_video_ssim(video_path, ssim_threshold)
    results["frame_scores"] = frame_scores
  else:
    results["error_message"] += "Video not found!\n"
  
  return results

@annotator_api.route("/annotations/<dataset_name>/<video_name>/<image_filename>", methods=["GET", "POST"])
def annotations(dataset_name, video_name, image_filename):
  results = { "error_message": "" }

  annotations_filepath = os.path.join(os.environ["annotations_path"], video_name + "_annotations.yaml")

  video_annotations = VideoAnnotation()
  results["has_annotations_on_video"] = video_annotations.read_from_file(annotations_filepath)
  results["has_annotations_on_frame"] = False

  traffic_annotation = video_annotations.annotations.get(image_filename)
  if traffic_annotation is None:
    traffic_annotation = TrafficAnnotation()
    video_annotations.annotations[image_filename] = traffic_annotation
  else:
    results["has_annotations_on_frame"] = True

  if request.method == "GET":
    results[image_filename] = traffic_annotation.annotations
  elif request.method == "POST":

    # check inputs
    request_json = request.get_json()

    logger.debug("Save Annotations - request : " + str(request_json))

    request_annotations = request_json["annotations"]
    traffic_annotation.annotations.apply_dictionary_values(request_annotations)
 
    video_annotations.save_to_file(annotations_filepath)

  return results
