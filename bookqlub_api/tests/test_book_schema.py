from bookqlub_api.schema import models, queries

from tests import base_test


class TestBooksSchema(base_test.BaseTestSchema):

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


class TestBacklogSchema(base_test.BaseTestSchema):

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


class TestBookSuggestion(base_test.BaseTestSchema):

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
