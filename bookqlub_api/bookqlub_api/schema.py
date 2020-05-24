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


# Mutations


class CreateUser(graphene.Mutation):
    class Arguments:
        full_name = graphene.String()
        username = graphene.String()

    ok = graphene.Boolean()
    user = graphene.Field(lambda: User)

    def mutate(root, info, full_name, username):
        # TODO check unique username
        session = info.context.get("session")
        new_user = models.User(full_name=full_name, username=username)
        session.add(new_user)
        session.commit()
        return CreateUser(user=new_user, ok=True)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
