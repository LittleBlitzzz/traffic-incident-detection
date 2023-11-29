from flask import Flask, Blueprint

test_backend = Blueprint('test_backend', __name__)

@test_backend.route('/', methods=['GET'])
def welcome():
  return """
  <h1>Welcome to the annotator backend!<h1>
  <div style='width: 10px'></div>
  <p>This page is intended for testing the API.<p>
  <div style='width: 10px'></div>
  """