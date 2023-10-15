from rms.file_processing.models import StorageClient
from azure.storage.blob.aio import BlobClient
from rms.settings import Settings
from fastapi import UploadFile


class AzureBlobClient(StorageClient):

    def __init__(self):
        self.settings = Settings()

    async def upload(self, file: UploadFile, file_name: str) -> str:
        blob_sas_url = f"{self.settings.blob_url}/{file_name}?{self.settings.blob_sas}"
        blob_client = BlobClient.from_blob_url(blob_sas_url)

        async with blob_client:
            file_content = await file.read()
            await blob_client.upload_blob(file_content)

        return blob_client.url.split("?")[0]
