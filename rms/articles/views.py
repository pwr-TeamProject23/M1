from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from rms.articles.managers import ArticleManager
from rms.articles.services import (
    CreateArticleData,
    create_article,
    Article,
    list_articles,
    ArticleWithDetails,
    get_article_details,
    partial_update_article,
    ArticlePartialUpdate,
    ArticleWithCreator,
)
from rms.auth.dependencies import get_current_user
from rms.auth.models import UserOrm
from rms.file_processing.managers import FileManager
from rms.file_processing.services import PdfArticleData, download_and_process_file
from rms.utils.exceptions import NotFound
from rms.utils.postgres import get_db

router = APIRouter()


@router.get("/")
def list_articles_view(
    db: Session = Depends(get_db),
    user: UserOrm = Depends(get_current_user),
) -> list[ArticleWithCreator]:
    return list_articles(db)


@router.post("/")
def create_article_view(
    article: CreateArticleData, db: Session = Depends(get_db), user: UserOrm = Depends(get_current_user)
) -> Article:
    return create_article(db, user, article)


@router.get("/{article_id}")
def get_article_details_view(
    article_id: int, db: Session = Depends(get_db), user: UserOrm = Depends(get_current_user)
) -> ArticleWithDetails:
    article = get_article_details(db, article_id)

    if article is None:
        raise NotFound

    return article


@router.patch("/{article_id}")
def partial_update_article_view(
    article_id: int,
    article: ArticlePartialUpdate,
    db: Session = Depends(get_db),
    user: UserOrm = Depends(get_current_user),
) -> Article:
    article = partial_update_article(db, article_id, article)

    if article is None:
        raise HTTPException(status_code=404)

    return article


@router.post("/{article_id}/process-pdf")
async def process_article_pdf_view(
    article_id: int, db: Session = Depends(get_db), user: UserOrm = Depends(get_current_user)
) -> PdfArticleData:
    article = ArticleManager.find_by_id(db, article_id)

    if article is None:
        raise HTTPException(status_code=404)

    article_file = FileManager.find_by_id(db, article.file_id)

    if article is None:
        raise HTTPException(status_code=404)

    return await download_and_process_file(article_file)
