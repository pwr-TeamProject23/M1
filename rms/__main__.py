from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from rms.settings import Settings
from rms.file_processing.views import router as file_processing_router
from rms.auth.views import router as auth_router
from rms.articles.views import router as articles_router


app = FastAPI()
settings = Settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(file_processing_router, prefix="/files")
app.include_router(auth_router)
app.include_router(articles_router, prefix="/article")


@app.get("/health")
def health_endpoint():
    return {"healthy": "true"}
