import math

from flask import request
import graphene
import sqlalchemy as SA

from bookqlub_api.schema import models, types, utils


SEARCH_LIMIT = 50
REVIEW_PAGE_SIZE = 15


class Query(graphene.ObjectType):
    books_by_title = graphene.Field(
        graphene.List(types.Book),
        title=graphene.String(required=True),
        already_reviewed=graphene.Boolean(),
    )
    user = graphene.Field(types.User)
    reviews = graphene.Field(types.ReviewList, year=graphene.Int(), page=graphene.Int())
    reviews_years = graphene.List(graphene.Int)
    backlog = graphene.List(types.Backlog)

    def resolve_books_by_title(self, info, title, already_reviewed=False):
        user_id = utils.validate_user_id(request, info.context["secret"])
        session = info.context["session"]

        reviewed_books_ids = (
            session.query(models.Review.book_id).filter(models.Review.user_id == user_id).subquery()
        )
        books_query = types.Book.get_query(info).filter(models.Book.title.ilike(f"%{title}%"))
        if not already_reviewed:
            books_query = books_query.filter(models.Book.id.notin_(reviewed_books_ids))
        return books_query.limit(SEARCH_LIMIT).all()

    def resolve_user(self, info):
        user_id = utils.validate_user_id(request, info.context["secret"])
        return types.User.get_query(info).filter(models.User.id == user_id).first()

    def resolve_reviews(self, info, year=None, page=1):
        user_id = utils.validate_user_id(request, info.context["secret"])

        review_query = types.Review.get_query(info).filter(models.Review.user_id == user_id)
        if year:
            review_query = review_query.filter(SA.extract("year", models.Review.created) == year)

        reviews_count = review_query.count()
        page_count = math.ceil(reviews_count / REVIEW_PAGE_SIZE)

        reviews = (
            review_query.order_by(models.Review.created.desc())
            .offset((page - 1) * REVIEW_PAGE_SIZE)
            .limit(REVIEW_PAGE_SIZE)
            .all()
        )
        return {"items": reviews, "page_info": {"total_pages": page_count, "current_page": page}}

    def resolve_reviews_years(self, info):
        user_id = utils.validate_user_id(request, info.context["secret"])
        reviews = (
            types.Review.get_query(info)
            .filter(models.Review.user_id == user_id)
            .distinct(SA.extract("year", models.Review.created))
            .all()
        )
        return [review.created.year for review in reviews]

    def resolve_backlog(self, info):
        user_id = utils.validate_user_id(request, info.context["secret"])
        session = info.context["session"]

        reviewed_books_ids = (
            session.query(models.Review.book_id).filter(models.Review.user_id == user_id).subquery()
        )
        return (
            types.Backlog.get_query(info)
            .filter(models.Backlog.user_id == user_id)
            .filter(models.Backlog.book_id.notin_(reviewed_books_ids))
            .all()
        )
