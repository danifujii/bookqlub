from flask import Flask
from flask_graphql import GraphQLView

from bookqlub_api import utils
from bookqlub_api.schema import schema


def create_app(session) -> Flask:
    graphql_context = {"session": session, "secret": utils.config["app"]["secret"]}

    app = Flask(__name__)
    app.add_url_rule(
        "/graphql",
        view_func=GraphQLView.as_view(
            "graphql",
            schema=schema.schema,
            graphiql=utils.config["app"]["graphiql"],
            get_context=lambda: graphql_context,
        ),
    )
    return app


if __name__ == "__main__":
    app = create_app(utils.get_db_session())
    app.run(port=utils.config["app"]["port"])
