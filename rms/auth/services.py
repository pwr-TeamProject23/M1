import uuid
from datetime import datetime, timedelta
import bcrypt

from pydantic import BaseModel

from rms.auth.managers import UserManager, UserCookieManager
from rms.auth.models import UserCookie, User


class LoginRequest(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str


def validate_credentials(email: str, password: str) -> tuple[User, UserCookie] | None:
    user = UserManager.find_by_email(email)

    if not user:
        return None

    if not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
        return None

    value = str(uuid.uuid4())
    valid_until = datetime.now() + timedelta(days=30)
    auth_cookie = UserCookie(user_id=user.id, value=value, valid_until=valid_until)
    UserCookieManager.create(auth_cookie)

    return user, auth_cookie


def invalidate_cookie(auth_cookie_value: str) -> bool:
    auth_cookie = UserCookieManager.find_by_value(auth_cookie_value)
    if not auth_cookie:
        return False

    UserCookieManager.delete(auth_cookie)
    return True
