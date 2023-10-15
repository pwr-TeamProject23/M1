from fastapi import UploadFile, HTTPException
from rms.file_processing.models import FileUploadResult
from rms.file_processing.clients import AzureBlobClient
from rms.file_processing.managers import FileManager
from datetime import datetime

async def upload_to_storage(file: UploadFile, file_name: str) -> FileUploadResult:
    blob_client = AzureBlobClient()

    try:
        file_path = await blob_client.upload(file, file_name)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"An error occurred while uploading the file: {str(e)}")

    # Save to DB
    try:
        FileManager.create(
            name=file_name,
            path=file_path,
            uploaded_at=datetime.now()
        )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"An error occurred while saving to the database: {str(e)}")

    return FileUploadResult(
        status="success",
        message=f"File '{file_name}' was successfully uploaded.",
        file_path=file_path
    )
