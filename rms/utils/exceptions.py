from typing import Any

from fastapi import HTTPException


class BaseHttpException(HTTPException):
    status_code: int
    detail: Any = None
    headers: dict[str, str] | None = None

    def __init__(
        self,
        *,
        status_code: int | None = None,
        detail: Any = None,
        headers: dict[str, str] | None = None,
    ):
        status_code = status_code or self.status_code
        detail = detail or self.detail
        headers = headers or self.headers

        super().__init__(status_code, detail, headers)


class NotFound(BaseHttpException):
    status_code = 404
    detail = "Not Found"
