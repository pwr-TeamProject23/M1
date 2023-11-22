from sqlalchemy.orm import Session, joinedload

from rms.articles.models import ArticleOrm
from rms.utils.managers import BaseModelManager


class ArticleManager(BaseModelManager[ArticleOrm]):
    __model__ = ArticleOrm

    @classmethod
    def all_with_creators(cls, db: Session):
        return db.query(ArticleOrm).options(joinedload(ArticleOrm.creator)).all()
