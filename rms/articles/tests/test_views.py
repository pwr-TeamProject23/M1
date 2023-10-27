from datetime import datetime

import pytest

from rms.articles.managers import ArticleManager
from rms.articles.models import ArticleOrm
from rms.file_processing.managers import FileManager
from rms.file_processing.models import File


@pytest.fixture
def single_article(db) -> tuple[ArticleOrm, File]:
    f = File(name="x", path="x", uploaded_at=datetime.now())
    f = FileManager.create(db, f)

    a = ArticleOrm(name="john", notes="", file_id=f.id, created_at=datetime.now())
    a = ArticleManager.create(db, a)

    return a, f


def test_article_list_view(client, db):
    f = File(name="x", path="x", uploaded_at=datetime.now())
    f = FileManager.create(db, f)

    for _ in range(3):
        a = ArticleOrm(name="john", notes="", file_id=f.id, created_at=datetime.now())
        ArticleManager.create(db, a)

    articles = ArticleManager.all(db)
    response = client.get("/article")

    data = response.json()

    assert response.status_code == 200
    assert isinstance(data, list)
    assert len(data) == len(articles)


def test_get_articles_detail_view__found_object(client, db, single_article):
    article, file = single_article

    response = client.get(f"/article/{article.id}")
    data = response.json()

    assert response.status_code == 200
    assert isinstance(data, dict)

    assert data["id"] == article.id
    assert data["name"] == article.name
    assert data["notes"] == article.notes
    assert data["file"]["name"] == file.name
    assert data["file"]["path"] == file.path


def test_get_articles_detail_view__not_found_object(client):
    response = client.get("/article/1")
    data = response.json()

    assert response.status_code == 404
    assert data["detail"] == "Not Found"


def test_post_article(client, db):
    f = File(name="x", path="x", uploaded_at=datetime.now())
    f = FileManager.create(db, f)

    payload = {"name": "Johny", "notes": "some notes", "file_id": f.id}

    response = client.post("/article", json=payload)
    data = response.json()

    assert response.status_code == 200
    assert isinstance(data, dict)
    assert data["name"] == payload["name"]
    assert data["notes"] == payload["notes"]
    assert data["file_id"] == payload["file_id"]
    assert data["created_at"]


@pytest.mark.parametrize("property_,value", (("name", "Name"), ("notes", "Notes")))
def test_patch_article(property_, value, client, db, single_article):
    article, _ = single_article

    response = client.patch(f"/article/{article.id}", json={property_: value})
    data = response.json()

    assert response.status_code == 200
    assert isinstance(data, dict)
    assert data["id"] == article.id
    assert data[property_] == value
