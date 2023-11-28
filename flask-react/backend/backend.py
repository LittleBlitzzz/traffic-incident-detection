from flask import Flask
import logging

from natsort import natsorted
import os

from annotator_api import annotator_api

# Todo : Explore the factory pattern
app = Flask(__name__)
app.register_blueprint(annotator_api)

logging.basicConfig(filename='backend.log', level=logging.DEBUG)

@app.route('/', methods=['GET'])
def welcome():
  return """
  <h1>Welcome to the annotator backend!<h1>
  <div style='width: 10px'></div>
  <p>This page is intended for testing the API.<p>
  <div style='width: 10px'></div>
  """
  # var obj = JSON.parse(string);