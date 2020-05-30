from datetime import datetime
import unittest

import jwt
from alchemy_mock.mocking import UnifiedAlchemyMagicMock

from bookqlub_api import application, models, utils


class BaseTestSchema(unittest.TestCase):
    def setUp(self):
        self.session = UnifiedAlchemyMagicMock()
        self.client = application.create_app(self.session).test_client()

        self.addCleanup(self.cleanUp)

    def cleanUp(self):
        self.session.rollback()
        self.session.close()

    def graphql_request(self, query: str, variables: dict = None) -> dict:
        request_body = {"query": query}
        if variables:
            request_body["variables"] = variables

        resp = self.client.post("/graphql", json=request_body)
        self.assertEqual(resp.status_code, 200, resp.json)
        return resp.json


class TestUserSchema(BaseTestSchema):
    def test_user_creation(self):
        # Create new user
        mutation = """
            mutation CreateUser($full_name: String!, $username: String!, $pass: String!) {
                createUser(fullName: $full_name, username: $username, password: $pass) {
                    ok
                    token
                }
            }
        """
        variables = {"full_name": "Daniel", "username": "dan", "pass": "hello"}
        resp = self.graphql_request(mutation, variables)
        token = resp.get("data", {}).get("createUser").get("token")
        self.assertIn("userId", jwt.decode(token, utils.config["app"]["secret"]))

        # Check user was saved correctly
        resp_data = self.graphql_request("{ users { username } }").get("data", {})
        users = resp_data.get("users")
        self.assertEqual(len(users), 1)
        self.assertEqual(users[0].get("username"), variables.get("username"))


class TestReviewSchema(BaseTestSchema):
    def setUp(self):
        super().setUp()
        self.session.add(models.User(username="p", full_name="Peter"))
        self.session.add(models.Book(title="A book", author="Me", release_date=datetime.now()))

    def test_review_creation(self):
        # Create new review
        mutation = """
            mutation CreateReview (
                $user_id: ID!, $book_id: ID!, $comment: String!, $value: ReviewValue!
            ) {
                createReview (
                    userId: $user_id, bookId: $book_id, comment: $comment, value: $value
                ) {
                    ok
                }
            }
        """
        variables = {
            "user_id": 1,
            "book_id": 1,
            "comment": "Pretty good book",
            "value": "GOOD",
        }
        self.graphql_request(mutation, variables)

        # Check review was saved correctly
        query = "{ reviews(userId: %d) { comment } }" % variables["user_id"]
        resp_data = self.graphql_request(query).get("data", {})
        reviews = resp_data.get("reviews")
        self.assertEqual(len(reviews), 1)
        self.assertEqual(reviews[0].get("comment"), variables["comment"])
