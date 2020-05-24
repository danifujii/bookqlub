import graphene
import graphene_sqlalchemy

from bookqlub_api import models


class User(graphene_sqlalchemy.SQLAlchemyObjectType):
    class Meta:
        model = models.User


class Book(graphene_sqlalchemy.SQLAlchemyObjectType):
    class Meta:
        model = models.Book


class Query(graphene.ObjectType):
    users = graphene.List(User)
    books = graphene.List(Book)

    def resolve_users(self, info):
        return User.get_query(info).all()

    def resolve_books(self, info):
        return Book.get_query(info).all()


schema = graphene.Schema(query=Query)
