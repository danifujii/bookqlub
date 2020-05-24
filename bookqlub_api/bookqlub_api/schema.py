import graphene
import graphene_sqlalchemy

from bookqlub_api import models


class User(graphene_sqlalchemy.SQLAlchemyObjectType):
    class Meta:
        model = models.User


class Book(graphene_sqlalchemy.SQLAlchemyObjectType):
    class Meta:
        model = models.Book


class Review(graphene_sqlalchemy.SQLAlchemyObjectType):
    class Meta:
        model = models.Review


class Query(graphene.ObjectType):
    users = graphene.List(User)
    books = graphene.List(Book)
    user = graphene.Field(User, id=graphene.ID(required=True))
    reviews = graphene.List(Review, user_id=graphene.ID(required=True))

    def resolve_users(self, info):
        return User.get_query(info).all()

    def resolve_books(self, info):
        return Book.get_query(info).all()

    def resolve_user(self, info, id):
        return User.get_query(info).filter(models.User.id == id).first()

    def resolve_reviews(self, info, user_id):
        return Review.get_query(info).filter(models.Review.user_id == user_id).all()


schema = graphene.Schema(query=Query)
