import sqlalchemy as SA
import toml
from sqlalchemy import orm


config = toml.load("config.cfg")


def get_db_session() -> orm.Session:
    engine = SA.create_engine(config["app"]["db_url"])
    return orm.sessionmaker(bind=engine)()
