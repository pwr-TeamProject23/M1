from fastapi import APIRouter, HTTPException
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
