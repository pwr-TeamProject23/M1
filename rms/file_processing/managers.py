from rms.file_processing.models import FileOrm
from rms.utils.managers import BaseModelManager


class FileManager(BaseModelManager[FileOrm]):
    __model__ = FileOrm
