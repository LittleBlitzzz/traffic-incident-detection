from flask import Flask
from natsort import natsorted
import os

from annotator_api import annotator_api

app = Flask(__name__)
app.register_blueprint(annotator_api)

@app.route('/', methods=['GET'])
def welcome():
  return """
  <h1>Welcome to the annotator backend!<h1>
  <div style='width: 10px'></div>
  <p>This page is intended for testing the API.<p>
  <div style='width: 10px'></div>
  """
  # var obj = JSON.parse(string);