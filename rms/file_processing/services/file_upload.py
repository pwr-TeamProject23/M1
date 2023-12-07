from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session

from rms.file_processing.clients import MinioClient
from rms.file_processing.managers import FileManager
from datetime import datetime
from rms.file_processing.models import FileOrm
from rms.file_processing.services import FileUploadResult


async def upload_to_storage(db: Session, file: UploadFile, file_name: str) -> FileUploadResult:
    blob_client = MinioClient()

    try:
        file_path = await blob_client.upload(file, file_name)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"An error occurred while uploading the file: {str(e)}")

    try:
        file_instance = FileOrm(name=file_name, path=file_path, uploaded_at=datetime.now())
        FileManager.create(db, file_instance)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"An error occurred while saving to the database: {str(e)}")

    return FileUploadResult(
        id=file_instance.id,
        status="success",
        message=f"File '{file_name}' was successfully uploaded.",
        file_path=file_path,
    )


async def download_file_from_storage(file_id: str) -> bytes:
    blob_client = MinioClient()

    return await blob_client.download(file_id)
