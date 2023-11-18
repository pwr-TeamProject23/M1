from io import BytesIO

from azure.storage.blob.aio import BlobClient
from fastapi import UploadFile
from abc import ABC, abstractmethod
from rms.settings import Settings
from minio import Minio


class StorageClient(ABC):
    def __init__(self):
        self.settings = Settings()

    @abstractmethod
    async def upload(self, file: UploadFile, file_name: str) -> str:
        """Upload a file and return its PATH."""
        pass

    @abstractmethod
    async def download(self, path: str) -> bytes:
        pass


class AzureBlobClient(StorageClient):
    async def upload(self, file: UploadFile, file_name: str) -> str:
        blob_sas_url = f"{self.settings.blob_url}/{file_name}?{self.settings.blob_sas}"
        blob_client = BlobClient.from_blob_url(blob_sas_url)

        async with blob_client:
            file_content = await file.read()
            await blob_client.upload_blob(file_content)

        return blob_client.url.split("?")[0]

    async def download(self, path: str) -> bytes:
        blob_sas_url = f"{path}?{self.settings.blob_sas}"
        blob_client = BlobClient.from_blob_url(blob_sas_url)

        file_downloader = await blob_client.download_blob()

        output = await file_downloader.read()

        return output


class MinioClient(StorageClient):
    async def upload(self, file: UploadFile, file_name: str) -> str:
        client = self._get_client()
        file_content = await file.read()

        minio_object = client.put_object(
            bucket_name="articles",
            object_name=file_name,
            data=BytesIO(file_content),
            length=file.size,
        )

        return minio_object.object_name

    async def download(self, path: str) -> bytes:
        client = self._get_client()

        response = client.get_object(
            bucket_name="articles",
            object_name=path,
        )

        return response.read()

    def _get_client(self) -> Minio:
        return Minio(
            endpoint="minio:9000",
            access_key=self.settings.minio_access_id,
            secret_key=self.settings.minio_secret_key,
            secure=False,
        )

    def try_create_bucket(self, bucket_name: str):
        client = self._get_client()

        bucket_exists = client.bucket_exists(bucket_name)

        if not bucket_exists:
            client.make_bucket(bucket_name)
