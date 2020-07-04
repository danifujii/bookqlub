from datetime import datetime
from functools import lru_cache

from flask import request
import bcrypt
import graphene

from bookqlub_api.schema import models, types, utils


# TODO remove hack done due to problems with Enum(s) in `graphene_sqlalchemy <= 2.2`
graphene.Enum.from_enum = lru_cache(maxsize=None)(graphene.Enum.from_enum)


class CreateUser(graphene.Mutation):
    class Arguments:
        full_name = graphene.String()
        username = graphene.String()
        password = graphene.String()

    user = graphene.Field(lambda: types.User)
    token = graphene.String()

    @utils.rollback_on_exception
    def mutate(root, info, full_name, username, password):
        session = info.context["session"]

        prev_user = types.User.get_query(info).filter(models.User.username == username).first()
        if prev_user:
            raise ValueError("Username already exists")

        hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode("utf8")

        new_user = models.User(full_name=full_name, username=username, password=hashed_password)
        session.add(new_user)
        session.flush()  # To make new_user have ID attribute set
        session.commit()

        token = utils.create_token(new_user.id, info.context["secret"])
        return CreateUser(user=new_user, token=token)


class Login(graphene.Mutation):
    class Arguments:
        username = graphene.String()
        password = graphene.String()

    user = graphene.Field(lambda: types.User)
    token = graphene.String()

    def mutate(root, info, username, password):
        user = types.User.get_query(info).filter(models.User.username == username).first()
        if not user or not bcrypt.checkpw(password.encode(), user.password.encode()):
            raise ValueError("Invalid username or password")

        token = utils.create_token(user.id, info.context["secret"])
        return Login(user=user, token=token)


class CreateReview(graphene.Mutation):
    class Arguments:
        book_id = graphene.ID()
        comment = graphene.String()
        value = graphene.Enum.from_enum(models.ReviewValue)()
        date = graphene.Date(required=False)

    review = graphene.Field(lambda: types.Review)

    @utils.rollback_on_exception
    def mutate(root, info, book_id, comment, value, date=None):
        user_id = utils.validate_user_id(request, info.context["secret"])

        if user_id in info.context.get("demo_user_ids", frozenset()):
            raise Exception("Invalid action for demo user")

        if not date:
            date = datetime.now()

        session = info.context["session"]
        new_review = models.Review(
            user_id=user_id, book_id=book_id, value=value, comment=comment, created=date
        )
        session.add(new_review)
        session.commit()
        return CreateReview(review=new_review)


class DeleteReview(graphene.Mutation):
    class Arguments:
        book_id = graphene.ID()

    ok = graphene.Boolean()

    @utils.rollback_on_exception
    def mutate(root, info, book_id):
        user_id = utils.validate_user_id(request, info.context["secret"])

        if user_id in info.context.get("demo_user_ids", frozenset()):
            raise Exception("Invalid action for demo user")

        session = info.context["session"]
        types.Review.get_query(info).filter(models.Review.book_id == book_id).filter(
            models.Review.user_id == user_id
        ).delete()
        session.commit()

        return DeleteReview(ok=True)


class AddBacklogEntry(graphene.Mutation):
    class Arguments:
        book_id = graphene.ID()

    ok = graphene.Boolean()

    @utils.rollback_on_exception
    def mutate(root, info, book_id):
        user_id = utils.validate_user_id(request, info.context["secret"])

        if user_id in info.context.get("demo_user_ids", frozenset()):
            raise Exception("Invalid action for demo user")

        prev_backlog_entry = (
            types.Backlog.get_query(info)
            .filter(models.Backlog.user_id == user_id)
            .filter(models.Backlog.book_id == book_id)
            .first()
        )
        if prev_backlog_entry:
            raise ValueError("Book already in backlog")

        backlog_entry = models.Backlog(user_id=user_id, book_id=book_id)

        session = info.context["session"]
        session.add(backlog_entry)
        session.commit()

        return AddBacklogEntry(ok=True)


class CreateBookSuggestion(graphene.Mutation):
    class Arguments:
        title = graphene.String()
        author = graphene.String()
        cover_url = graphene.String(required=False)
        release_date = graphene.Date(required=False)

    book = graphene.Field(lambda: types.Book)

    @utils.rollback_on_exception
    def mutate(root, info, title, author, cover_url=None, release_date=None):
        _ = utils.validate_user_id(request, info.context["secret"])

        new_book = models.Book(
            title=title,
            author=author,
            release_date=release_date,
            cover_url=cover_url,
            suggestion=True,
        )
        session = info.context["session"]
        session.add(new_book)
        session.commit()

        return CreateBookSuggestion(book=new_book)


class DeleteBacklogEntry(graphene.Mutation):
    class Arguments:
        book_id = graphene.ID()

    ok = graphene.Boolean()

    @utils.rollback_on_exception
    def mutate(root, info, book_id):
        user_id = utils.validate_user_id(request, info.context["secret"])

        if user_id in info.context.get("demo_user_ids", frozenset()):
            raise Exception("Invalid action for demo user")

        session = info.context["session"]
        types.Backlog.get_query(info).filter(models.Backlog.book_id == book_id).filter(
            models.Backlog.user_id == user_id
        ).delete()
        session.commit()

        return DeleteBacklogEntry(ok=True)


class Mutation(graphene.ObjectType):
    create_book_suggestion = CreateBookSuggestion.Field()
    create_user = CreateUser.Field()
    create_review = CreateReview.Field()
    delete_review = DeleteReview.Field()
    add_backlog_entry = AddBacklogEntry.Field()
    delete_backlog_entry = DeleteBacklogEntry.Field()
    login = Login.Field()
