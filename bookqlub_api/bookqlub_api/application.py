from flask import Flask

from bookqlub_api import utils


app = Flask(__name__)


@app.route("/")
def hello_world():
    return "Hello, World"


if __name__ == "__main":
    app.run(port=utils.config["app"]["port"])
