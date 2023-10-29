from pathlib import Path

from cryptography.fernet import Fernet

from rms.settings import Settings


def encrypt_file(path: Path):
    settings = Settings()

    with open(path, "rb") as file:
        content = file.read()
        fernet = Fernet(settings.static_fernet_key)

        encrypted_content = fernet.encrypt(content)
        new_path = path.parent / (path.name + ".enc")

        with open(new_path, "wb") as out_file:
            out_file.write(encrypted_content)


if __name__ == "__main__":
    encrypt_file(Path("/home/app/rms/file_processing/tests/test_data/pdf_1.pdf"))
