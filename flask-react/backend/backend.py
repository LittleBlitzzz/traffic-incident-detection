from flask import Flask
import logging

from natsort import natsorted
import os
import sys
from pathlib import Path

from annotator_api import annotator_api
from test_backend import test_backend

llava_path = os.path.join(Path(__file__).parent.absolute(), "LLaVA")
if llava_path not in sys.path:
  sys.path.append(llava_path)

# Todo : Explore the factory pattern
def create_app():
  print(__name__)
  app = Flask(__name__)
  app.register_blueprint(annotator_api, url_prefix='/api')
  app.register_blueprint(test_backend, url_prefix='/')

  logging.basicConfig(filename='backend.log', level=logging.DEBUG)

    # var obj = JSON.parse(string);
  
  return app

from run_model import test
test()