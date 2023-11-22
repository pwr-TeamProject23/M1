from datetime import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship

from rms.auth.models import UserOrm
from rms.utils.postgres import BaseModel


class ArticleOrm(BaseModel):
    __tablename__ = "article"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    notes: Mapped[str]
    created_at: Mapped[datetime]

    file_id: Mapped[int] = mapped_column(ForeignKey("file.id"))
    creator_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    creator = relationship(UserOrm, backref="articles")
