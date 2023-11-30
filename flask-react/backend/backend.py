from flask import Flask
import logging

from natsort import natsorted
import os
import sys
from pathlib import Path

llava_path = os.path.join(Path(__file__).parent.absolute(), "LLaVA")
if llava_path not in sys.path:
  sys.path.append(llava_path)

# Todo : Explore the factory pattern
def create_app(load_model_on_start:bool):
  app = Flask(__name__)

  from api.debugger_api import debugger_api
  app.register_blueprint(debugger_api, url_prefix='/')

  from api.annotator_api import annotator_api
  app.register_blueprint(annotator_api, url_prefix='/api/annotator')

  logging.basicConfig(filename='backend.log', level=logging.DEBUG)

    # var obj = JSON.parse(string);
  if load_model_on_start:
    from api.model_api import model_api
    app.register_blueprint(model_api, url_prefix='/api/model')
  
  return app