from fastapi import FastAPI
from rms.settings import Settings
from rms.file_processing.views import router as file_processing_router
from rms.auth.views import router as auth_router

app = FastAPI()
settings = Settings()

app.include_router(file_processing_router)
app.include_router(auth_router)


@app.get("/health")
def health_endpoint():
    return {"healthy": "true"}
