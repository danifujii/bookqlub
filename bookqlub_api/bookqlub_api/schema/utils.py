from typing import Callable, Optional
from flask import request
from sqlalchemy import exc
import jwt


def create_token(user_id: int, secret: str) -> str:
    payload = {"userId": user_id}
    return jwt.encode(payload, secret, algorithm="HS256").decode("utf8")


def get_user_id(request, secret: str) -> Optional[int]:
    header = request.headers.get("Authorization")
    if not header:
        return None

    jwt_token = header.split(" ")[-1]
    payload = jwt.decode(jwt_token.encode(), secret, algorithms=["HS256"])
    return payload.get("userId")


def validate_user_id(request, secret: str) -> int:
    user_id = get_user_id(request, secret)
    if not user_id:
        raise LookupError("Invalid authentication token")
    return user_id


def rollback_on_exception(func: Callable):
    def rollback_wrapper(root, info, *args, **kwargs):
        try:
            return func(root, info, *args, **kwargs)
        except exc.SQLAlchemyError:
            session = info.context["session"]
            session.rollback()
            raise Exception("Error with database")

    return rollback_wrapper


def invalid_for_demo_users(func: Callable):
    def invalid_wrapper(root, info, *args, **kwargs):
        user_id = get_user_id(request, info.context["secret"])

        if user_id in info.context.get("demo_user_ids", frozenset()):
            raise Exception("Invalid action for demo user")

        func(root, info, *args, **kwargs)

    return invalid_wrapper
