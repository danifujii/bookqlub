from flask import Flask
from flask_graphql import GraphQLView

from bookqlub_api import schema, utils


app = Flask(__name__)
session = utils.get_db_session()


app.add_url_rule(
    "/graphql",
    view_func=GraphQLView.as_view(
        "graphql", schema=schema.schema, graphiql=True, get_context=lambda: {"session": session}
    ),
)


@app.teardown_appcontext
def shutdown_app(exception=None):
    session.close()


if __name__ == "__main":
    app.run(port=utils.config["app"]["port"])
