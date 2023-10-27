from datetime import datetime
from typing import ClassVar, Optional

from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from rms.articles.managers import ArticleManager
from rms.articles.models import ArticleOrm
from rms.file_processing.managers import FileManager


class CreateArticleData(BaseModel):
    name: str
    notes: str

    file_id: int


class Article(BaseModel):
    id: int

    name: str
    notes: str
    file_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ArticleFile(BaseModel):
    id: int
    name: str
    path: str

    model_config = ConfigDict(from_attributes=True)


class ArticleWithDetails(Article):
    file_id: ClassVar[None] = None
    file: ArticleFile

    name: str
    notes: str


class ArticlePartialUpdate(BaseModel):
    name: Optional[str] = None
    notes: Optional[str] = None


def create_article(db: Session, data: CreateArticleData) -> ArticleOrm:
    article = ArticleOrm(
        name=data.name,
        notes=data.notes,
        file_id=data.file_id,
        created_at=datetime.now(),
    )
    article = ArticleManager.create(db, article)

    return article


def partial_update_article(db: Session, article_id: int, data: ArticlePartialUpdate) -> ArticleOrm | None:
    article = ArticleManager.find_by_id(db, article_id)

    if not article:
        return article

    for key, value in iter(data):
        if value is None:
            continue

        setattr(article, key, value)

    return ArticleManager.create(db, article)


def list_articles(db: Session) -> list[ArticleOrm]:
    return ArticleManager.all(db)


def get_article_details(db: Session, article_id: int) -> ArticleWithDetails | None:
    article = ArticleManager.find_by_id(db, article_id)

    if not article:
        return None

    file = FileManager.find_by_id(db, article.file_id)

    if not file:
        return None

    return ArticleWithDetails(
        id=article.id,
        name=article.name,
        notes=article.notes,
        created_at=article.created_at,
        file=file,
    )
