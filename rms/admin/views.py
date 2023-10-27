from fastapi import APIRouter

from rms.admin.services import list_all_users

router = APIRouter()


@router.get("/users")
def list_users_view():
    return list_all_users()
