from flask import Flask, Blueprint, request, send_file
from natsort import natsorted
import os
import yaml

from traffic_annotation import TrafficAnnotation

annotator_api = Blueprint('api', __name__, url_prefix='/api')

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

@annotator_api.route('/save_annotations/<dataset_name>/<video_name>/<image_filename>', methods=['POST'])
def save_annotations(dataset_name, video_name, image_filename):
  output_logs = {}
  
  if request.method == "POST":
    request_json = request.get_json()

    annotations_filepath = os.path.join(os.environ["annotations_path"], video_name + "_annotations.yaml")

    annotations = TrafficAnnotation()
    output_logs["existing_annotations"] = annotations.read_from_file(annotations_filepath)
    
    # check inputs
    request_annotations = request_json["annotations"]
    print(request_annotations)
    apply_dictionary_values(annotations.annotations, request_annotations)
 
    annotations.save_to_file(annotations_filepath)

  return output_logs

def apply_dictionary_values(attrDict, targetDict):
  for k, v in targetDict.items():
    if v is not None:
      if attrDict.get(k, None) is not None:
        if isinstance(k, dict):
          apply_dictionary_values(attrDict[k], v)
        else:
          attrDict[k] = v
