from fastapi import APIRouter, Response, HTTPException, status

from rms.auth.services import LoginRequest, validate_credentials

router = APIRouter()


@router.post("/login")
def login(login_data: LoginRequest):
    result = validate_credentials(login_data.email, login_data.password)

    if not result:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid email or password.")

    user, auth_cookie = result
    response = Response(content="Login successful")
    response.set_cookie(key="auth_cookie", value=auth_cookie.value, httponly=True, samesite="strict")

    return response
