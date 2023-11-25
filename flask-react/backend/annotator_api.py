from flask import Flask, Blueprint, request
from natsort import natsorted
import os
import json

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

    annotations_filepath = os.path.join(os.environ["annotations_path"], video_name + "_annotations.json")

    content = {
      "annotations" : {}
    }

    if (os.path.exists(annotations_filepath)):
      with open(annotations_filepath, "r") as existing_annotations_file:
        file_content = existing_annotations_file.read()
        if file_content:
          content = json.loads(existing_annotations_file)

      output_logs["existing_annotations"] = True
    else :
      output_logs["existing_annotations"] = False
    
    content["annotations"][image_filename] = request_json["annotated_labels"]

    with open(annotations_filepath, "w") as existing_annotations_file:
      existing_annotations_file.write(json.dumps(content, indent=2))

  return output_logs
