import graphene

from bookqlub_api.schema import models, types


class Query(graphene.ObjectType):
    users = graphene.List(types.User)
    books = graphene.List(types.Book)
    user = graphene.Field(types.User, id=graphene.ID(required=True))
    reviews = graphene.List(types.Review, user_id=graphene.ID(required=True))

    def resolve_users(self, info):
        return types.User.get_query(info).all()

    def resolve_books(self, info):
        return types.Book.get_query(info).all()

    def resolve_user(self, info, id):
        return types.User.get_query(info).filter(models.User.id == id).first()

    def resolve_reviews(self, info, user_id):
        return types.Review.get_query(info).filter(models.Review.user_id == user_id).all()
