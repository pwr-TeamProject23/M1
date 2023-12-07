from fastapi import UploadFile, HTTPException, APIRouter, Depends
from datetime import datetime

from sqlalchemy.orm import Session
from starlette.responses import Response

from rms.auth.dependencies import get_current_user
from rms.auth.models import UserOrm
from rms.file_processing.services import upload_to_storage, download_file_from_storage
from rms.file_processing.services import FileUploadResult
from rms.utils.postgres import get_db

router = APIRouter()


@router.post("/upload")
async def upload_file(file: UploadFile, db: Session = Depends(get_db),
                      user: UserOrm = Depends(get_current_user)) -> FileUploadResult:
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    name_with_timestamp = f"{timestamp}_{file.filename}"

    return await upload_to_storage(db, file, name_with_timestamp)


@router.get("/get/{file_id}")
async def download_file(file_id: str, user=Depends(get_current_user)):
    file_bytes = await download_file_from_storage(file_id)

    return Response(file_bytes, media_type="application/pdf")
