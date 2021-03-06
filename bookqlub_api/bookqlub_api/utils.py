import os

import sqlalchemy as SA
import toml
from sqlalchemy import orm


config = toml.load(
    [os.path.join(os.path.dirname(__file__), "config.cfg"), "/etc/bookqlub/config.cfg"]
)


def get_db_session():
    engine = SA.create_engine(config["app"]["db_url"])
    return orm.sessionmaker(bind=engine)()
