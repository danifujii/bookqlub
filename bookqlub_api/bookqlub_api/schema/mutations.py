from functools import lru_cache

import bcrypt
import graphene
import jwt

from bookqlub_api.schema import models, types


# TODO remove hack done due to problems with Enum(s) in `graphene_sqlalchemy <= 2.2`
graphene.Enum.from_enum = lru_cache(maxsize=None)(graphene.Enum.from_enum)


# Mutations


class CreateUser(graphene.Mutation):
    class Arguments:
        full_name = graphene.String()
        username = graphene.String()
        password = graphene.String()

    user = graphene.Field(lambda: types.User)
    token = graphene.String()

    def mutate(root, info, full_name, username, password):
        session = info.context["session"]

        prev_user = types.User.get_query(info).filter(models.User.username == username).first()
        if prev_user:
            raise ValueError("Username already exists")

        hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

        new_user = models.User(full_name=full_name, username=username, password=hashed_password)
        session.add(new_user)
        session.flush()  # To make new_user have ID attribute set
        session.commit()

        token = create_token(new_user, info.context["secret"])
        return CreateUser(user=new_user, token=token)


class Login(graphene.Mutation):
    class Arguments:
        username = graphene.String()
        password = graphene.String()

    user = graphene.Field(lambda: types.User)
    token = graphene.String()

    def mutate(root, info, username, password):
        user = types.User.get_query(info).filter(models.User.username == username).first()
        if not user or not bcrypt.checkpw(password.encode(), user.password):
            raise ValueError("Invalid username or password")

        token = create_token(user, info.context["secret"])
        return Login(user=user, token=token)


class CreateReview(graphene.Mutation):
    class Arguments:
        book_id = graphene.ID()
        user_id = graphene.ID()
        comment = graphene.String()
        value = graphene.Enum.from_enum(models.ReviewValue)()

    review = graphene.Field(lambda: types.Review)

    def mutate(root, info, book_id, user_id, comment, value):
        session = info.context["session"]
        new_review = models.Review(user_id=user_id, book_id=book_id, value=value, comment=comment)
        session.add(new_review)
        session.commit()
        return CreateReview(review=new_review)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    create_review = CreateReview.Field()
    login = Login.Field()


def create_token(user: models.User, secret: str) -> str:
    payload = {"userId": user.id}
    return jwt.encode(payload, secret, algorithm="HS256").decode("utf8")
