from flask import Flask
from flask_graphql import GraphQLView

from bookqlub_api import schema, utils


def create_app(session) -> Flask:
    app = Flask(__name__)
    app.add_url_rule(
        "/graphql",
        view_func=GraphQLView.as_view(
            "graphql", schema=schema.schema, graphiql=True, get_context=lambda: {"session": session}
        ),
    )
    return app


if __name__ == "__main":
    app = create_app(utils.get_db_session())
    app.run(port=utils.config["app"]["port"])
