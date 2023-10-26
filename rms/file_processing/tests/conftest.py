from io import BytesIO
from pathlib import Path
from typing import BinaryIO

import pytest
from cryptography.fernet import Fernet

from rms.settings import Settings

settings = Settings()


@pytest.fixture
def test_file_one() -> BinaryIO:
    path = Path(__file__).parent / "test_data/pdf_1.pdf.enc"

    with open(path, "rb") as f:
        encrypted_content = f.read()
        fernet = Fernet(settings.static_fernet_key)

        return BytesIO(fernet.decrypt(encrypted_content))
