from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from rms.file_processing.clients import MinioClient
from rms.settings import Settings
from rms.file_processing.views import router as file_processing_router
from rms.auth.views import router as auth_router
from rms.articles.views import router as articles_router
from rms.admin.views import router as admin_router
from rms.search_engine import views as search_engine_views


MinioClient().try_create_bucket("articles")


settings = Settings()

if settings.use_keyword_extraction_model:
    print("Downloading the keyword extractor model, this will take some time, brace yourself")
    # Download the keyword extraction model
    import rms.file_processing.services.keyword_extractor  # noqa
else:
    print("Skipping keyword extractor model initialization")

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.allowed_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(file_processing_router, prefix="/files")
app.include_router(auth_router)
app.include_router(articles_router, prefix="/article")
app.include_router(admin_router, prefix="/admin")
app.include_router(search_engine_views.router, prefix="/search_engine")


@app.get("/health")
def health_endpoint():
    return {"healthy": "true"}
