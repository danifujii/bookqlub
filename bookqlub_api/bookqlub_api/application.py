from flask import Flask
from flask_graphql import GraphQLView

from bookqlub_api import utils
from bookqlub_api.schema import schema


def create_app(session) -> Flask:
    graphql_context = {
        "session": session,
        "secret": utils.config["app"]["secret"],
        "demo_user_ids": frozenset(utils.config["app"]["demo_user_ids"]),
    }

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


def get_app(*args, **kwargs):
    return create_app(utils.get_db_session())


if __name__ == "__main__":
    app = get_app()
    app.run(port=utils.config["app"]["port"])
