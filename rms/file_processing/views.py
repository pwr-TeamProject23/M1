from fastapi import UploadFile, HTTPException, APIRouter
from datetime import datetime
from rms.file_processing.services import upload_to_storage
from rms.file_processing.services import FileUploadResult

router = APIRouter()


@router.post("/upload")
async def upload_file(file: UploadFile) -> FileUploadResult:
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    name_with_timestamp = f"{timestamp}_{file.filename}"

    return await upload_to_storage(file, name_with_timestamp)
