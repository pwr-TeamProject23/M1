from fastapi import APIRouter, Request, Response, HTTPException, status

from rms.auth.services import LoginRequest, validate_credentials, invalidate_cookie

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


@router.post("/logout")
def logout(request: Request):
    auth_cookie_value = request.cookies.get("auth_cookie")
    if not auth_cookie_value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not Authorized")

    if not invalidate_cookie(auth_cookie_value):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not Authorized")

    response = Response(content="Logout successful")
    response.delete_cookie(key="auth_cookie")

    return response
