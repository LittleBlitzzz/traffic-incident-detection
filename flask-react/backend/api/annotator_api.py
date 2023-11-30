from flask import Flask, Blueprint, request, send_file

from natsort import natsorted
import os

from api.traffic_annotation import TrafficAnnotation, VideoAnnotation
from utils.ssim_tools import calculate_video_ssim

annotator_api = Blueprint('api', __name__)

@annotator_api.route('/videos-in-dataset/<dataset_name>', methods=['GET'])
def videos_in_dataset(dataset_name):
  dataset_path = os.path.join(os.environ["datasets_path"], dataset_name)

  video_titles = []
  if os.path.exists(dataset_path):
    video_titles = natsorted(os.listdir(dataset_path))
  
  return {
    "video_titles": video_titles
  }

@annotator_api.route('/images-in-video/<dataset_name>/<video_name>', methods=['GET'])
def images_in_video(dataset_name, video_name):
  video_path = os.path.join(os.environ["datasets_path"], dataset_name, video_name)

  image_filenames = [ ]
  if os.path.exists(video_path):
    image_filenames = natsorted(os.listdir(video_path))
  
  return {
    "image_filenames": image_filenames
  }

@annotator_api.route('/get-image/<dataset_name>/<video_name>/<image_filename>', methods=['GET'])
def get_image(dataset_name, video_name, image_filename):
  image_fullpath = os.path.join(os.environ["datasets_path"], dataset_name, video_name, image_filename)
  
  if os.path.exists(image_fullpath):
    return send_file(image_fullpath)
  else :
    return "Image not found!"

@annotator_api.route('/get-ssim-score/<dataset_name>/<video_name>/<float:ssim_threshold>', methods=['GET'])
def get_ssim_score(dataset_name, video_name, ssim_threshold):
  video_path = os.path.join(os.path.join(os.environ["datasets_path"], dataset_name, video_name))

  results = {
    "error_message": "",
  }

  if os.path.exists(video_path):
    frame_scores = calculate_video_ssim(video_path, ssim_threshold)
    results["frame_scores"] = frame_scores
  else:
    results["error_message"] += "Video not found!"
  
  return results

@annotator_api.route('/save-annotations/<dataset_name>/<video_name>/<image_filename>', methods=['POST'])
def save_annotations(dataset_name, video_name, image_filename):
  output_logs = {}
  
  if request.method == "POST":
    request_json = request.get_json()
    
    logging.getLogger().debug(request_json)

    annotations_filepath = os.path.join(os.environ["annotations_path"], video_name + "_annotations.yaml")

    video_annotations = VideoAnnotation()
    output_logs["existing_annotations"] = video_annotations.read_from_file(annotations_filepath)

    traffic_annotation = video_annotations.annotations.get(image_filename)
    if traffic_annotation is None:
      traffic_annotation = TrafficAnnotation()
      video_annotations.annotations[image_filename] = traffic_annotation

    # check inputs
    request_annotations = request_json["annotations"]
    traffic_annotation.annotations.apply_dictionary_values(request_annotations)
 
    video_annotations.save_to_file(annotations_filepath)

  return output_logs

