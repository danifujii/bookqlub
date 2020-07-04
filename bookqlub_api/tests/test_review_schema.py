from datetime import datetime

from freezegun import freeze_time

from bookqlub_api.schema import models, queries

from tests import base_test


class TestReviewSchema(base_test.BaseTestSchema):

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


class TestReviewListSchema(base_test.BaseTestSchema):
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
