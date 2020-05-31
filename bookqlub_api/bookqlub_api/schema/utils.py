from typing import Optional

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
