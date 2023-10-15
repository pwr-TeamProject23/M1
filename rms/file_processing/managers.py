from rms.file_processing.models import File
from rms.utils.managers import BaseModelManager


class FileManager(BaseModelManager[File]):
    __model__ = File
