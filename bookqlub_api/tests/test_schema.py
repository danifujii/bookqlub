from datetime import datetime
from typing import Dict
from unittest import mock
import unittest

from alchemy_mock.mocking import UnifiedAlchemyMagicMock
import bcrypt
import jwt

from bookqlub_api import application, utils
from bookqlub_api.schema import models, utils as schema_utils


class BaseTestSchema(unittest.TestCase):
    def setUp(self):
        if not hasattr(self, "session"):  # If children test hasn't already defined a session
            self.session = UnifiedAlchemyMagicMock()
        self.client = application.create_app(self.session).test_client()

        self.addCleanup(self.cleanUp)

    def cleanUp(self):
        self.session.rollback()
        self.session.close()

    def graphql_request(self, query: str, variables: dict = None, headers: dict = None) -> dict:
        request_body = {"query": query}
        if variables:
            request_body["variables"] = variables

        if not headers:
            headers = {}

        resp = self.client.post("/graphql", json=request_body, headers=headers)
        self.assertEqual(resp.status_code, 200, resp.json)
        return resp.json

    def get_headers_with_auth(self, token=None, user_id: int = 1) -> Dict[str, str]:
        if not token:
            token = schema_utils.create_token(user_id, utils.config["app"]["secret"])
        return {"Authorization": f"Bearer {token}"}


class TestUserSchema(BaseTestSchema):

    mutation = """
        mutation CreateUser($full_name: String!, $username: String!, $pass: String!) {
            createUser(fullName: $full_name, username: $username, password: $pass) {
                token
            }
        }
    """

    def setUp(self):
        self.session = UnifiedAlchemyMagicMock(
            data=[
                (
                    [mock.call.filter(models.User.username == "dan")],
                    [models.User(full_name="Daniel", username="dan", password="hi")],
                ),
            ]
        )
        super().setUp()

    def test_user_creation(self):
        # Create new user
        variables = {"full_name": "Daniel", "username": "daniel", "pass": "hello"}
        resp = self.graphql_request(self.mutation, variables)
        token = resp.get("data", {}).get("createUser").get("token")
        self.assertTrue(token)
        self.assertIn(
            "userId", jwt.decode(token, utils.config["app"]["secret"], algorithms=["HS256"])
        )

        # Check user was saved correctly
        resp_data = self.graphql_request(
            "{ user { username } }",
            # Cannot use response token because SQLAlchemy mock doesn't set the new user ID
            headers=self.get_headers_with_auth(),
        )
        resp_data = resp_data.get("data", {})
        user = resp_data.get("user")
        self.assertTrue(user)
        self.assertEqual(user.get("username"), variables.get("username"))

    def test_user_already_exists(self):
        variables = {"full_name": "Daniel", "username": "dan", "pass": "hello"}
        errors = self.graphql_request(self.mutation, variables).get("errors")
        self.assertTrue(errors)
        self.assertEqual(errors[0].get("message"), "Username already exists")


class TestLoginSchema(BaseTestSchema):

    login_mutation = """
        mutation Login($username: String!, $pass: String!) {
            login(username: $username, password: $pass) {
                token
            }
        }
    """
    password = "hello"

    def setUp(self):
        password = bcrypt.hashpw(self.password.encode(), bcrypt.gensalt()).decode("utf8")
        self.session = UnifiedAlchemyMagicMock(
            data=[
                (
                    [mock.call.filter(models.User.username == "dan")],
                    [models.User(username="dan", full_name="Daniel", password=password)],
                ),
            ]
        )
        super().setUp()

    def test_user_login(self):
        variables = {"username": "dan", "pass": self.password}
        resp = self.graphql_request(self.login_mutation, variables)
        token = resp.get("data", {}).get("login").get("token")
        self.assertIn(
            "userId", jwt.decode(token, utils.config["app"]["secret"], algorithms=["HS256"])
        )

    def test_invalid_user(self):
        variables = {"username": "daniel", "pass": self.password}
        resp = self.graphql_request(self.login_mutation, variables)

        errors = resp.get("errors")
        self.assertTrue(errors)
        self.assertEqual(errors[0].get("message"), "Invalid username or password")

    def test_invalid_password(self):
        variables = {"username": "dan", "pass": "someInvalidPassword"}
        resp = self.graphql_request(self.login_mutation, variables)

        errors = resp.get("errors")
        self.assertTrue(errors)
        self.assertEqual(errors[0].get("message"), "Invalid username or password")


class TestReviewSchema(BaseTestSchema):
    def setUp(self):
        super().setUp()
        self.session.add(models.User(username="p", full_name="Peter"))
        self.session.add(models.Book(title="A book", author="Me", release_date=datetime.now()))

    def test_review_creation(self):
        # Create new review
        mutation = """
            mutation CreateReview (
                $book_id: ID!, $comment: String!, $value: ReviewValue!
            ) {
                createReview (
                    bookId: $book_id, comment: $comment, value: $value
                ) {
                    review {
                        bookId
                    }
                }
            }
        """
        variables = {
            "book_id": 1,
            "comment": "Pretty good book",
            "value": "GOOD",
        }
        self.graphql_request(mutation, variables, self.get_headers_with_auth())

        # Check review was saved correctly
        query = "{ reviews { comment } }"
        resp_data = self.graphql_request(query, headers=self.get_headers_with_auth()).get(
            "data", {}
        )
        reviews = resp_data.get("reviews")
        self.assertTrue(reviews)
        self.assertEqual(reviews[0].get("comment"), variables["comment"])

    def test_reviews_unauthorized(self):
        query = "{ reviews { comment } }"
        errors = self.graphql_request(query).get("errors")
        self.assertTrue(errors)
        self.assertEqual(errors[0].get("message"), "Invalid authentication token")
