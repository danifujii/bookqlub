from flask import request
import graphene

from bookqlub_api.schema import models, types, utils


class Query(graphene.ObjectType):
    books = graphene.List(types.Book)
    user = graphene.Field(types.User)
    reviews = graphene.List(types.Review)

    def resolve_books(self, info):
        _ = utils.validate_user_id(request, info.context["secret"])
        return types.Book.get_query(info).all()

    def resolve_user(self, info):
        user_id = utils.validate_user_id(request, info.context["secret"])
        return types.User.get_query(info).filter(models.User.id == user_id).first()

    def resolve_reviews(self, info):
        user_id = utils.validate_user_id(request, info.context["secret"])
        return types.Review.get_query(info).filter(models.Review.user_id == user_id).all()
