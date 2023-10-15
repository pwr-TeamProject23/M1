from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from rms.utils.postgres import BaseModel


class File(BaseModel):
    __tablename__ = "file"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    path: Mapped[str]
    uploaded_at: Mapped[datetime]

    def __repr__(self) -> str:
        return f"File({self.name})"

