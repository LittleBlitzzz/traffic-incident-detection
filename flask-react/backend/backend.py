from flask import Flask
from natsort import natsorted
import os

app = Flask(__name__)
backend_port = 5000
print("Hello")

# Route for seeing a data
@app.route('/videos-in-dataset/<dataset_name>', methods=['GET'])
def videos_in_dataset(dataset_name):
  dataset_path = os.path.join(os.environ["project_path"], "Datasets", dataset_name)
  if os.path.exists(dataset_path):
    videos_in_dataset = natsorted(os.listdir(dataset_path))

  return {
    "video_titles": videos_in_dataset
  }

# if __name__ == '__main__':
#   print("running")
#   app.run(host='0.0.0.0', port=backend_port, debug=True)
# app.run(host='0.0.0.0', port=backend_port, debug=True)