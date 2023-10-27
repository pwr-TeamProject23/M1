from fastapi import UploadFile, HTTPException, APIRouter, Depends
from datetime import datetime

from sqlalchemy.orm import Session

from rms.file_processing.services import upload_to_storage
from rms.file_processing.services import FileUploadResult
from rms.utils.postgres import get_db

router = APIRouter()


@router.post("/upload")
async def upload_file(file: UploadFile, db: Session = Depends(get_db)) -> FileUploadResult:
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    name_with_timestamp = f"{timestamp}_{file.filename}"

    return await upload_to_storage(db, file, name_with_timestamp)
