from azure.storage.blob.aio import BlobClient
from fastapi import UploadFile
from abc import ABC, abstractmethod
from rms.settings import Settings


class StorageClient(ABC):
    def __init__(self):
        self.settings = Settings()

    @abstractmethod
    async def upload(self, file: UploadFile, file_name: str) -> str:
        """Upload a file and return its PATH."""
        pass


class AzureBlobClient(StorageClient):

    async def upload(self, file: UploadFile, file_name: str) -> str:
        blob_sas_url = f"{self.settings.blob_url}/{file_name}?{self.settings.blob_sas}"
        blob_client = BlobClient.from_blob_url(blob_sas_url)

        async with blob_client:
            file_content = await file.read()
            await blob_client.upload_blob(file_content)

        return blob_client.url.split("?")[0]