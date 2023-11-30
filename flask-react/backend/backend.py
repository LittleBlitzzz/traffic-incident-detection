from flask import Flask
import logging

from natsort import natsorted
import os
import sys
from pathlib import Path

from api.debugger_api import debugger_api
from api.annotator_api import annotator_api
from api.model_api import model_api

llava_path = os.path.join(Path(__file__).parent.absolute(), "LLaVA")
if llava_path not in sys.path:
  sys.path.append(llava_path)

model = None

def get_active_model():
  from traffic_llava.setup_model import setup_model
  global model
  if model is None:
    model = setup_model()
  return model

# Todo : Explore the factory pattern
def create_app(load_model_on_start:bool):
  app = Flask(__name__)
  app.register_blueprint(debugger_api, url_prefix='/') 
  app.register_blueprint(annotator_api, url_prefix='/annotator-api')
  app.register_blueprint(model_api, url_prefix='/model-api')

  logging.basicConfig(filename='backend.log', level=logging.DEBUG)

    # var obj = JSON.parse(string);
  if load_model_on_start:
    model = get_active_model()
  
  return app