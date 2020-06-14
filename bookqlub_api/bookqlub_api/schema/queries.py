from flask import request
import graphene
import sqlalchemy as SA

from bookqlub_api.schema import models, types, utils


SEARCH_LIMIT = 50


class Query(graphene.ObjectType):
    books = graphene.List(types.Book)
    books_by_title = graphene.Field(
        graphene.List(types.Book),
        title=graphene.String(required=True),
        already_reviewed=graphene.Boolean(),
    )
    user = graphene.Field(types.User)
    reviews = graphene.Field(graphene.List(types.Review), year=graphene.Int())
    reviews_years = graphene.List(graphene.Int)

    def resolve_books(self, info):
        _ = utils.validate_user_id(request, info.context["secret"])
        return types.Book.get_query(info).all()

    def resolve_books_by_title(self, info, title, already_reviewed=False):
        user_id = utils.validate_user_id(request, info.context["secret"])
        session = info.context["session"]
        reviewed_books_ids = (
            session.query(models.Review.book_id).filter(models.Review.user_id == user_id).subquery()
        )
        books_query = types.Book.get_query(info).filter(models.Book.title.like(f"%{title}%"))
        if not already_reviewed:
            books_query = books_query.filter(models.Book.id.notin_(reviewed_books_ids))
        return books_query.limit(SEARCH_LIMIT).all()

    def resolve_user(self, info):
        user_id = utils.validate_user_id(request, info.context["secret"])
        return types.User.get_query(info).filter(models.User.id == user_id).first()

    def resolve_reviews(self, info, year=None):
        user_id = utils.validate_user_id(request, info.context["secret"])
        query = types.Review.get_query(info).filter(models.Review.user_id == user_id)
        if year:
            query = query.filter(SA.extract("year", models.Review.created) == year)
        return query.all()

    def resolve_reviews_years(self, info):
        user_id = utils.validate_user_id(request, info.context["secret"])
        session = info.context["session"]
        result = (
            session.query(SA.extract("year", models.Review.created))
            .filter(models.Review.user_id == user_id)
            .distinct()
            .all()
        )
        return [res_tuple[0] for res_tuple in result]
