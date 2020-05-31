import graphene_sqlalchemy

from bookqlub_api.schema import models


class User(graphene_sqlalchemy.SQLAlchemyObjectType):
    class Meta:
        model = models.User
        exclude_fields = ("password",)


class Book(graphene_sqlalchemy.SQLAlchemyObjectType):
    class Meta:
        model = models.Book


class Review(graphene_sqlalchemy.SQLAlchemyObjectType):
    class Meta:
        model = models.Review
