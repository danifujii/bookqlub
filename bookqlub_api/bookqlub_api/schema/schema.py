import graphene

from bookqlub_api.schema import queries, mutations


schema = graphene.Schema(query=queries.Query, mutation=mutations.Mutation)
