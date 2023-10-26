from fastapi import APIRouter, Request, Response, HTTPException, status, Depends

import json

from rms.auth.dependencies import get_current_user
from rms.auth.models import User
from rms.auth.services import LoginRequest, UserResponse, validate_credentials, invalidate_cookie

router = APIRouter()


@router.post("/login")
def login(login_data: LoginRequest) -> Response:
    result = validate_credentials(login_data.email, login_data.password)

    if not result:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid email or password.")

    user, auth_cookie = result
    response = Response(content=json.dumps({"status": "Logged in successfully"}), media_type="application/json")
    response.set_cookie(key="auth_cookie", value=auth_cookie.value, httponly=True, samesite="strict")

    return response


@router.post("/logout")
def logout(request: Request) -> Response:
    auth_cookie_value = request.cookies.get("auth_cookie")
    if not auth_cookie_value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not Authorized")

    if not invalidate_cookie(auth_cookie_value):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not Authorized")

    response = Response(content=json.dumps({"status": "Logged out successfully"}), media_type="application/json")
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
