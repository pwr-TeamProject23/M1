from datetime import datetime
from typing import ClassVar, Optional

from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from rms.articles.managers import ArticleManager
from rms.articles.models import ArticleOrm
from rms.auth.managers import UserManager
from rms.auth.models import UserOrm
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
    creator_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ArticleFile(BaseModel):
    id: int
    name: str
    path: str

    model_config = ConfigDict(from_attributes=True)


class ArticleCreator(BaseModel):
    first_name: str
    last_name: str
    email: str


class ArticleWithDetails(Article):
    file_id: ClassVar[None] = None
    file: ArticleFile
    creator_id: ClassVar[None] = None
    creator: ArticleCreator

    name: str
    notes: str


class ArticleWithCreator(Article):
    creator_id: ClassVar[None] = None
    creator: ArticleCreator


class ArticlePartialUpdate(BaseModel):
    name: Optional[str] = None
    notes: Optional[str] = None


def create_article(db: Session, user: UserOrm, data: CreateArticleData) -> ArticleOrm:
    article = ArticleOrm(
        name=data.name,
        notes=data.notes,
        file_id=data.file_id,
        creator_id=user.id,
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


def list_articles(db: Session) -> list[ArticleWithCreator]:
    articles = ArticleManager.all_with_creators(db)
    return articles


def get_article_details(db: Session, article_id: int) -> ArticleWithDetails | None:
    article = ArticleManager.find_by_id(db, article_id)

    if not article:
        return None

    file = FileManager.find_by_id(db, article.file_id)

    if not file:
        return None

    creator = get_article_creator(db, article.creator_id)

    return ArticleWithDetails(
        id=article.id,
        name=article.name,
        notes=article.notes,
        created_at=article.created_at,
        file=file,
        creator=creator,
    )


def get_article_creator(db: Session, creator_id: int) -> ArticleCreator:
    creator = UserManager.find_by_id(db, creator_id)
    if not creator:
        creator_info = ArticleCreator(
            first_name=None,
            last_name=None,
            email=None,
        )
    else:
        creator_info = ArticleCreator(
            first_name=creator.first_name,
            last_name=creator.last_name,
            email=creator.email,
        )

    return creator_info
