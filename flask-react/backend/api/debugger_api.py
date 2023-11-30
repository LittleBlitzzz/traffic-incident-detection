from flask import Flask, Blueprint

debugger_api = Blueprint("debugger-api", __name__)

@debugger_api.route("/", methods=["GET"])
def welcome():
  return """
  <h1>Welcome to the annotator backend!<h1>
  <div style='width: 10px'></div>
  <p>This page is intended for testing the API.<p>
  <div style='width: 10px'></div>
  """