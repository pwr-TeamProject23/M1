from datetime import datetime

from fastapi import Request, HTTPException, status, Depends
from sqlalchemy.orm import Session

from rms.auth.managers import UserCookieManager, UserManager
from rms.auth.models import User
from rms.utils.postgres import get_db


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    auth_cookie_value = request.cookies.get("auth_cookie")

    if not auth_cookie_value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    user_cookie = UserCookieManager.find_by_value(db, auth_cookie_value)

    if not user_cookie or user_cookie.valid_until < datetime.now():
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    user = UserManager.find_by_id(db, user_cookie.user_id)

    return user
