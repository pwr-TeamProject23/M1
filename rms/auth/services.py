import uuid
from datetime import datetime, timedelta
import bcrypt

from pydantic import BaseModel
from sqlalchemy.orm import Session

from rms.auth.managers import UserManager, UserCookieManager
from rms.auth.models import UserCookieOrm, UserOrm


class LoginRequest(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str


def validate_credentials(db: Session, email: str, password: str) -> tuple[UserOrm, UserCookieOrm] | None:
    user = UserManager.find_by_email(db, email)

    if not user:
        return None

    if not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
        return None

    value = str(uuid.uuid4())
    valid_until = datetime.now() + timedelta(days=30)
    auth_cookie = UserCookieOrm(user_id=user.id, value=value, valid_until=valid_until)
    UserCookieManager.create(db, auth_cookie)

    return user, auth_cookie


def invalidate_cookie(db: Session, auth_cookie_value: str) -> bool:
    auth_cookie = UserCookieManager.find_by_value(db, auth_cookie_value)
    if not auth_cookie:
        return False

    UserCookieManager.delete(db, auth_cookie)
    return True
