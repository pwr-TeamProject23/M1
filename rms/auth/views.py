from fastapi import APIRouter, Request, Response, Depends

import json

from sqlalchemy.orm import Session
from starlette.responses import JSONResponse

from rms.auth.dependencies import get_current_user
from rms.auth.models import User
from rms.auth.services import LoginRequest, UserResponse, validate_credentials, invalidate_cookie
from rms.utils.exceptions import Unauthorized
from rms.utils.postgres import get_db

router = APIRouter()


@router.post("/login")
def login(login_data: LoginRequest, db: Session = Depends(get_db)) -> Response:
    result = validate_credentials(db, login_data.email, login_data.password)

    if not result:
        raise Unauthorized

    user, auth_cookie = result
    response = Response(content=json.dumps({"status": "Logged in successfully"}), media_type="application/json")
    response.set_cookie(key="auth_cookie", value=auth_cookie.value, httponly=True, samesite="strict")

    return response


@router.post("/logout")
def logout(request: Request, db: Session = Depends(get_db)) -> Response:
    auth_cookie_value = request.cookies.get("auth_cookie")

    if not auth_cookie_value or not invalidate_cookie(db, auth_cookie_value):
        raise Unauthorized

    response = JSONResponse(content={"status": "Logged out successfully"})
    response.delete_cookie(key="auth_cookie")

    return response


@router.get("/me")
def me(user: User = Depends(get_current_user)) -> UserResponse:
    response = UserResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
    )
    return response
