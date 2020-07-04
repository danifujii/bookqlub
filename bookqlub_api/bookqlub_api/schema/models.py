import enum

from sqlalchemy.ext import declarative
import sqlalchemy as SA


Base = declarative.declarative_base()


class User(Base):
    __tablename__ = "users"

    id = SA.Column(SA.Integer, primary_key=True)
    username = SA.Column(SA.String)
    full_name = SA.Column(SA.String)
    password = SA.Column(SA.String)


class Book(Base):
    __tablename__ = "books"

    id = SA.Column(SA.Integer, primary_key=True)
    title = SA.Column(SA.String)
    author = SA.Column(SA.String)
    release_date = SA.Column(SA.DateTime)
    cover_url = SA.Column(SA.String)
    suggestion = SA.Column(SA.Boolean, default=True)


class ReviewValue(enum.Enum):
    EXCELLENT = "EXCELLENT"
    GREAT = "GREAT"
    GOOD = "GOOD"
    OK = "OK"


class Review(Base):
    __tablename__ = "reviews"

    user_id = SA.Column(SA.Integer, SA.ForeignKey("users.id"), primary_key=True)
    book_id = SA.Column(SA.Integer, SA.ForeignKey("books.id"), primary_key=True)
    value = SA.Column(SA.Enum(ReviewValue))
    comment = SA.Column(SA.String)
    created = SA.Column(SA.DateTime)

    book = SA.orm.relationship("Book")
