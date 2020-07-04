import unittest
from typing import Dict

import sqlalchemy as SA

from bookqlub_api import application, utils
from bookqlub_api.schema import models, utils as schema_utils


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
