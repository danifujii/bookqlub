from flask import request
import graphene
import sqlalchemy as SA

from bookqlub_api.schema import models, types, utils


class Query(graphene.ObjectType):
    books = graphene.List(types.Book)
    user = graphene.Field(types.User)
    reviews = graphene.Field(graphene.List(types.Review), year=graphene.Int())
    reviews_years = graphene.List(graphene.Int)

    def resolve_books(self, info):
        _ = utils.validate_user_id(request, info.context["secret"])
        return types.Book.get_query(info).all()

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
        reviews = (
            types.Review.get_query(info)
            .filter(models.Review.user_id == user_id)
            .distinct(SA.extract("year", models.Review.created))
            .all()
        )
        return [review.created.year for review in reviews]
