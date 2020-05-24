from sqlalchemy.ext import declarative
import sqlalchemy as SA


Base = declarative.declarative_base()


class User(Base):
    id = SA.Column(SA.Integer, primary_key=True)
    username = SA.Column(SA.String)
    full_name = SA.Column(SA.String)


class Book(Base):
    id = SA.Column(SA.Integer, primary_key=True)
    title = SA.Column(SA.String)
    author = SA.Column(SA.String)
    release_date = SA.Column(SA.DateTime)


class Review(Base):
    user_id = SA.Column(SA.Integer, SA.ForeignKey("users.id"), primary_key=True)
    book_id = SA.Column(SA.Integer, SA.ForeignKey("books.id"), primary_key=True)
    value = SA.Enum("EXCELLENT", "GREAT", "GOOD", "OK")
    comment = SA.String()
