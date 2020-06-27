import graphene
import graphene_sqlalchemy

from bookqlub_api.schema import models


class User(graphene_sqlalchemy.SQLAlchemyObjectType):
    class Meta:
        model = models.User
        exclude_fields = ("password",)


class Book(graphene_sqlalchemy.SQLAlchemyObjectType):
    class Meta:
        model = models.Book


class Review(graphene_sqlalchemy.SQLAlchemyObjectType):
    class Meta:
        model = models.Review
        exclude_fields = ("user_id",)


class PageInfo(graphene.ObjectType):
    current_page = graphene.Int()
    total_pages = graphene.Int()


class ReviewList(graphene.ObjectType):
    items = graphene.List(Review)
    page_info = graphene.Field(PageInfo)
