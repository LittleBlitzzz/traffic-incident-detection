from flask import Flask, jsonify
from natsort import natsorted
import os
from flask import Flask
from flask_cors import CORS

api = Flask("api")
CORS(api, resources={r"/*": {"origins": "http://localhost:3000"}})

# Route for seeing a data
@api.route('/videos-in-dataset/<dataset_name>', methods=['GET'])
def videos_in_dataset(dataset_name):
  dataset_path = os.path.join(os.environ["project_path"], "Datasets", dataset_name)
  if os.path.exists(dataset_path):
    video_titles = natsorted(os.listdir(dataset_path))
    
  return "hello"