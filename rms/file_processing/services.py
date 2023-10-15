from fastapi import UploadFile, HTTPException
from rms.file_processing.clients import AzureBlobClient
from rms.file_processing.managers import FileManager
from datetime import datetime
from pydantic import BaseModel
from rms.file_processing.models import File


class FileUploadResult(BaseModel):
    status: str
    message: str
    file_path: str


async def upload_to_storage(file: UploadFile, file_name: str) -> FileUploadResult:
    blob_client = AzureBlobClient()

    try:
        file_path = await blob_client.upload(file, file_name)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"An error occurred while uploading the file: {str(e)}")

    try:
        file_instance = File(name=file_name, path=file_path, uploaded_at=datetime.now())
        FileManager.create(file_instance)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"An error occurred while saving to the database: {str(e)}")

    return FileUploadResult(
        status="success",
        message=f"File '{file_name}' was successfully uploaded.",
        file_path=file_path
    )
