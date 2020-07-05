import bcrypt
import jwt

from bookqlub_api import utils
from bookqlub_api.schema import models

from tests import base_test


class TestUserSchema(base_test.BaseTestSchema):

    mutation = """
        mutation CreateUser($full_name: String!, $username: String!, $pass: String!) {
            createUser(fullName: $full_name, username: $username, password: $pass) {
                token
            }
        }
    """

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
        variables = {"full_name": "Daniel", "username": "daniel", "pass": "hello"}
        _ = self.graphql_request(self.mutation, variables)

        variables = {"full_name": "Gabe", "username": "daniel", "pass": "hello2"}
        errors = self.graphql_request(self.mutation, variables).get("errors")
        self.assertTrue(errors)
        self.assertEqual(errors[0].get("message"), "Username already exists")


class TestLoginSchema(base_test.BaseTestSchema):

    login_mutation = """
        mutation Login($username: String!, $pass: String!) {
            login(username: $username, password: $pass) {
                token
            }
        }
    """
    password = "hello"

    def setUp(self):
        super().setUp()
        password = bcrypt.hashpw(self.password.encode(), bcrypt.gensalt()).decode("utf8")
        self.session.add(models.User(username="dan", full_name="Daniel", password=password))
        self.session.commit()

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
