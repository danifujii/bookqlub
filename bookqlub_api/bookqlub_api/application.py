from flask import Flask

from bookqlub_api import utils


app = Flask(__name__)
session = utils.get_db_session()


@app.route("/")
def hello_world():
    return "Hello, World"


@app.teardown_appcontext
def shutdown_app(exception=None):
    session.close()


if __name__ == "__main":
    app.run(port=utils.config["app"]["port"])
