from datetime import datetime
from typing import Dict
import unittest

from freezegun import freeze_time
import bcrypt
import jwt
import sqlalchemy as SA

from bookqlub_api import application, utils
from bookqlub_api.schema import models, queries, utils as schema_utils


class BaseTestSchema(unittest.TestCase):

    demo_user_id = -2

    def setUp(self):
        engine = SA.create_engine("sqlite:///:memory:")
        models.Base.metadata.create_all(engine)
        self.session = SA.orm.sessionmaker(bind=engine)()

        self.client = application.create_app(self.session).test_client()

        self.og_demo_user_ids = utils.config["app"]["demo_user_ids"]
        utils.config["app"]["demo_user_ids"].append(self.demo_user_id)

        self.addCleanup(self.cleanUp)

    def cleanUp(self):
        self.session.rollback()
        self.session.close()

        utils.config["app"]["demo_user_ids"] = self.og_demo_user_ids

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

    def assertDemoInvalidAction(self, query: str, variables: dict = None):
        errors = self.graphql_request(
            query, variables, self.get_headers_with_auth(user_id=self.demo_user_id)
        ).get("errors")
        self.assertTrue(errors)
        self.assertIn("Invalid action", errors[0].get("message"))


class TestUserSchema(BaseTestSchema):

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


class TestReviewSchema(BaseTestSchema):

    review_mutation = """
        mutation CreateReview (
            $book_id: ID!, $comment: String!, $value: ReviewValue!, $date: Date
        ) {
            createReview (
                bookId: $book_id, comment: $comment, value: $value, date: $date
            ) {
                review {
                    bookId
                }
            }
        }
    """

    delete_mutation = """
        mutation DeleteReview($book_id: ID!) {
            deleteReview(bookId: $book_id) {
                ok
            }
        }
    """

    def test_review_creation(self):
        # Create new review
        variables = {
            "book_id": 1,
            "comment": "Pretty good book",
            "value": "GOOD",
            "date": "2020-01-01",
        }
        self.graphql_request(self.review_mutation, variables, self.get_headers_with_auth())

        # Check review was saved correctly
        query = "{ reviews(year: 2020) { items { comment, created } } }"
        resp_data = self.graphql_request(query, headers=self.get_headers_with_auth()).get(
            "data", {}
        )
        reviews = resp_data.get("reviews", {}).get("items", [])
        self.assertTrue(reviews)
        self.assertEqual(reviews[0].get("comment"), variables["comment"])
        self.assertIn(variables["date"], reviews[0].get("created"))

    def test_review_creation_demo_user(self):
        variables = {
            "book_id": 1,
            "comment": "Pretty good book",
            "value": "GOOD",
        }
        self.assertDemoInvalidAction(self.review_mutation, variables)

    def test_review_years(self):
        years = [2020, 2019, 2018]
        for year in years:
            with freeze_time(f"{year}-01-01"):
                variables = {
                    "book_id": year,  # Just random book ID is fine
                    "comment": "Pretty good book",
                    "value": "GOOD",
                }
                self.graphql_request(self.review_mutation, variables, self.get_headers_with_auth())

        query = "{ reviewsYears }"
        data = self.graphql_request(query, headers=self.get_headers_with_auth()).get("data")
        self.assertListEqual(data.get("reviewsYears", []), sorted(years))

    def test_delete_review(self):
        # Setup review to delete
        user_id = 128
        book_id = 512
        self.session.add(models.Book(id=book_id, title="Book title", author="Another author"))
        self.session.add(
            models.Review(
                user_id=user_id,
                book_id=book_id,
                value="GREAT",
                created=datetime.strptime("2020-01-01", "%Y-%m-%d"),
            )
        )
        self.session.commit()

        # Check review exists
        query = "{ reviews(year: 2020) { items { comment } } }"
        resp_data = self.graphql_request(
            query, headers=self.get_headers_with_auth(user_id=user_id)
        ).get("data", {})
        reviews = resp_data.get("reviews", {}).get("items", [])
        self.assertEqual(len(reviews), 1)

        # Delete review
        variables = {"book_id": book_id}
        self.graphql_request(
            self.delete_mutation, variables, headers=self.get_headers_with_auth(user_id=user_id)
        )

        # Check review no longer exists
        query = "{ reviews(year: 2020) { items { comment } } }"
        resp_data = self.graphql_request(
            query, headers=self.get_headers_with_auth(user_id=user_id)
        ).get("data", {})
        reviews = resp_data.get("reviews", {}).get("items", [])
        self.assertFalse(reviews)

    def test_delete_review_demo_user(self):
        variables = {"book_id": 1}
        self.assertDemoInvalidAction(self.delete_mutation, variables)


class TestReviewListSchema(BaseTestSchema):
    def setUp(self):
        super().setUp()

        self.total_pages = 2
        for n in range(queries.REVIEW_PAGE_SIZE * self.total_pages):
            self.session.add(
                models.Review(
                    user_id=1,
                    book_id=n,
                    value="GOOD",
                    comment="",
                    created=datetime.strptime("2020-01-01", "%Y-%m-%d"),
                )
            )
        self.session.commit()

    def test_reviews_unauthorized(self):
        query = "{ reviews(year: 2020) { items { comment } } }"
        errors = self.graphql_request(query).get("errors")
        self.assertTrue(errors)
        self.assertEqual(errors[0].get("message"), "Invalid authentication token")

    def test_reviews(self):
        book_ids = set()
        for page in range(self.total_pages):
            query = "{ reviews(year: 2020, page: %d) { items { bookId } }}" % (page + 1)
            reviews = (
                self.graphql_request(query, headers=self.get_headers_with_auth())
                .get("data", {})
                .get("reviews", {})
                .get("items", [])
            )
            self.assertTrue(reviews)
            self.assertEqual(len(reviews), queries.REVIEW_PAGE_SIZE)
            for review in reviews:
                book_id = review["bookId"]
                self.assertNotIn(book_id, book_ids)
                book_ids.add(book_id)


class TestBooksSchema(BaseTestSchema):

    BOOKS_QUERY = '{ booksByTitle(title: "%s") { title } }'

    def setUp(self):
        super().setUp()
        self.session.add(models.Book(title="This", author="Author", suggestion=False))
        self.session.add(models.Book(title="Thi", author="Author", suggestion=False))
        self.session.add(models.Book(title="The", author="Author", suggestion=False))
        self.session.commit()

    def test_books_title_search(self):
        books = (
            self.graphql_request(self.BOOKS_QUERY % "thi", headers=self.get_headers_with_auth())
            .get("data", {})
            .get("booksByTitle", [])
        )
        for book_info in books:
            self.assertIn("thi", book_info["title"].lower())

    def test_books_filter_reviewed(self):
        user_id = 256
        book_id = 512
        self.session.add(
            models.Book(id=book_id, title="This is", author="Another author", suggestion=False)
        )
        self.session.add(models.Review(user_id=user_id, book_id=book_id, value="GOOD"))
        self.session.commit()

        books = (
            self.graphql_request(
                self.BOOKS_QUERY % "thi", headers=self.get_headers_with_auth(user_id=user_id)
            )
            .get("data", {})
            .get("booksByTitle", [])
        )
        self.assertEqual(len(books), 2)

    def test_books_below_limit(self):
        for n in range(queries.SEARCH_LIMIT * 2):
            self.session.add(models.Book(title=f"The {n} book", suggestion=False))

        books = (
            self.graphql_request(self.BOOKS_QUERY % "The", headers=self.get_headers_with_auth())
            .get("data", {})
            .get("booksByTitle", [])
        )
        self.assertEqual(len(books), queries.SEARCH_LIMIT)

    def testBooksReturnNoSuggestion(self):
        self.session.add(models.Book(id=101, title="thi", author="", suggestion=True))
        self.session.commit()

        books = (
            self.graphql_request(self.BOOKS_QUERY % "thi", headers=self.get_headers_with_auth())
            .get("data", {})
            .get("booksByTitle", [])
        )
        # It would be 3 if the previous added Book was not a suggestion
        self.assertEqual(len(books), 2)


class TestBacklogSchema(BaseTestSchema):

    backlog_mutation = """
        mutation AddBacklogEntry($book_id: ID!) {
            addBacklogEntry(bookId: $book_id) {
                ok
            }
        }
    """

    delete_mutation = """
        mutation DeleteEntry($book_id: ID!) {
            deleteBacklogEntry(bookId: $book_id) {
                ok
            }
        }
    """

    def test_create_backlog_entry(self):
        book_id = 512
        user_id = 1024
        variables = {"book_id": book_id}
        self.graphql_request(
            self.backlog_mutation, variables, headers=self.get_headers_with_auth(user_id=user_id)
        )

        backlog_entry = (
            self.session.query(models.Backlog)
            .filter(models.Backlog.user_id == user_id)
            .filter(models.Backlog.book_id == book_id)
            .first()
        )
        self.assertTrue(backlog_entry)

    def test_create_backlog_entry_demo_user(self):
        variables = {"book_id": 1, "user_id": 2}
        self.assertDemoInvalidAction(self.backlog_mutation, variables)

    def test_create_backlog_already_existing(self):
        user_id = 8
        book_id = 16
        self.session.add(models.Backlog(user_id=user_id, book_id=book_id))
        self.session.commit()

        variables = {"book_id": book_id}
        errors = self.graphql_request(
            self.backlog_mutation, variables, headers=self.get_headers_with_auth(user_id=user_id)
        ).get("errors")
        self.assertTrue(errors)
        self.assertIn("Book already in", errors[0].get("message"))

    def test_query_backlog(self):
        user_id = 8
        backlog_books = 10
        reviewed_books = 5
        for book_id in range(backlog_books):
            self.session.add(models.Backlog(user_id=user_id, book_id=book_id))
        for book_id in range(reviewed_books):
            self.session.add(models.Review(user_id=user_id, book_id=book_id))
        self.session.commit()

        query = "{ backlog { bookId } }"
        backlog_items = (
            self.graphql_request(query, headers=self.get_headers_with_auth(user_id=user_id))
            .get("data", {})
            .get("backlog", [])
        )

        self.assertEqual(len(backlog_items), backlog_books - reviewed_books)

    def test_delete_backlog_entry(self):
        # Add Backlog item and check its existence
        user_id = 2
        book_id = 4
        self.session.add(models.Backlog(user_id=user_id, book_id=book_id))
        self.session.commit()
        self.assertTrue(self.session.query(models.Backlog).all())

        # Delete backlog entry
        variables = {"book_id": book_id}
        self.graphql_request(
            self.delete_mutation, variables, self.get_headers_with_auth(user_id=user_id)
        )

        # Check it was deleted
        self.assertFalse(self.session.query(models.Backlog).all())

    def test_delete_backlog_entry_demo_user(self):
        self.assertDemoInvalidAction(self.delete_mutation, {"book_id": 1})


class TestBookSuggestion(BaseTestSchema):

    book_sugg_mutation = """
        mutation create(
            $author: String!, $title: String!, $release_date: Date, $cover_url: String
        ) {
            createBookSuggestion(
                author: $author, title: $title, releaseDate: $release_date, coverUrl: $cover_url
            ) {
                book {
                    title
                    suggestion
                }
            }
        }
    """

    def testCreateBookSuggestion(self):
        variables = {
            "author": "A new author",
            "title": "The very new book",
            "cover_url": "https://googleimg.com",
        }
        res = self.graphql_request(self.book_sugg_mutation, variables, self.get_headers_with_auth())
        book = res.get("data", {}).get("createBookSuggestion", {}).get("book", {})
        self.assertEqual(book.get("title"), variables.get("title"))
        self.assertTrue(book.get("suggestion"))

        # Check it was actually saved on the DB
        book = self.session.query(models.Book).first()
        self.assertTrue(book)
        self.assertEqual(book.title, variables.get("title"))
        self.assertTrue(book.suggestion)

    def testCreateBookSuggestionAuth(self):
        variables = {
            "author": "A new author",
            "title": "The very new book",
            "cover_url": "https://googleimg.com",
        }
        errors = self.graphql_request(self.book_sugg_mutation, variables).get("errors")
        self.assertTrue(errors)
        self.assertEqual(errors[0].get("message"), "Invalid authentication token")
