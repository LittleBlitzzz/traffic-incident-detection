from flask import Flask
from natsort import natsorted
import os

from annotator_api import annotator_api

app = Flask(__name__)
app.register_blueprint(annotator_api)

@app.route('/', methods=['GET'])
def welcome():
  return "Welcome to the annotator backend!"