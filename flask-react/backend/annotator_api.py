from flask import Flask, Blueprint, request
from natsort import natsorted
import os
import yaml

from traffic_annotation import TrafficAnnotation

annotator_api = Blueprint('api', __name__, url_prefix='/api')

@annotator_api.route('/videos-in-dataset/<dataset_name>', methods=['GET'])
def videos_in_dataset(dataset_name):
  dataset_path = os.path.join(os.environ["datasets_path"], dataset_name)
  video_titles = [ "No videos found!" ]
  if os.path.exists(dataset_path):
    video_titles = natsorted(os.listdir(dataset_path))
  
  return {
    "video_titles": video_titles
  }

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
