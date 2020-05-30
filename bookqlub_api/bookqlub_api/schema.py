from functools import lru_cache

import graphene
import graphene_sqlalchemy

from bookqlub_api import models


# TODO remove hack done due to problems with Enum(s) in `graphene_sqlalchemy <= 2.2`
graphene.Enum.from_enum = lru_cache(maxsize=None)(graphene.Enum.from_enum)


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


# Mutations


class CreateUser(graphene.Mutation):
    class Arguments:
        full_name = graphene.String()
        username = graphene.String()

    ok = graphene.Boolean()
    user = graphene.Field(lambda: User)

    def mutate(root, info, full_name, username):
        session = info.context.get("session")

        prev_user = User.get_query(info).filter(models.User.username == username).first()
        if prev_user:
            raise ValueError("Username already exists")

        new_user = models.User(full_name=full_name, username=username)
        session.add(new_user)
        session.flush()  # To make new_user have ID set
        session.commit()
        return CreateUser(user=new_user, ok=True)


class CreateReview(graphene.Mutation):
    class Arguments:
        book_id = graphene.ID()
        user_id = graphene.ID()
        comment = graphene.String()
        value = graphene.Enum.from_enum(models.ReviewValue)()

    ok = graphene.Boolean()
    review = graphene.Field(lambda: Review)

    def mutate(root, info, book_id, user_id, comment, value):
        session = info.context["session"]
        new_review = models.Review(user_id=user_id, book_id=book_id, value=value, comment=comment)
        session.add(new_review)
        session.commit()
        return CreateReview(review=new_review, ok=True)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    create_review = CreateReview.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
