from rms.articles.models import ArticleOrm
from rms.utils.managers import BaseModelManager


class ArticleManager(BaseModelManager[ArticleOrm]):
    __model__ = ArticleOrm
