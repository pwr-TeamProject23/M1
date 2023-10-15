from fastapi import UploadFile, HTTPException
from rms.file_processing.models import FileUploadResult
from rms.file_processing.clients import AzureBlobClient


async def upload_to_storage(file: UploadFile, file_name: str) -> FileUploadResult:
    blob_client = AzureBlobClient()

    try:
        file_path = await blob_client.upload(file, file_name)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"An error occurred while uploading the file: {str(e)}")

    return FileUploadResult(
        status="success",
        message=f"File '{file_name}' was successfully uploaded.",
        file_path=file_path
    )
