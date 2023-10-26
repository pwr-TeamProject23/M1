from fastapi import APIRouter, HTTPException

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
)
from rms.file_processing.managers import FileManager
from rms.file_processing.services import PdfArticleData, download_and_process_file

router = APIRouter()


@router.get("/")
def list_articles_view() -> list[Article]:
    return list_articles()


@router.post("/")
def create_article_view(article: CreateArticleData) -> Article:
    return create_article(article)


@router.get("/{article_id}")
def get_article_details_view(article_id: int) -> ArticleWithDetails:
    article = get_article_details(article_id)

    return article


@router.patch("/{article_id}")
def partial_update_article_view(article_id: int, article: ArticlePartialUpdate) -> Article:
    article = partial_update_article(article_id, article)

    if article is None:
        raise HTTPException(status_code=404)

    return article


@router.post("/{article_id}/process-pdf")
async def process_article_pdf_view(article_id: int) -> PdfArticleData:
    article = ArticleManager.find_by_id(article_id)

    if article is None:
        raise HTTPException(status_code=404)

    article_file = FileManager.find_by_id(article.file_id)

    if article is None:
        raise HTTPException(status_code=404)

    return await download_and_process_file(article_file)
