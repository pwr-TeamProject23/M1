from fastapi import FastAPI
from rms.settings import Settings
from rms.file_processing.views import router as file_processing_router


app = FastAPI()
settings = Settings()

app.include_router(file_processing_router)


@app.get("/health")
def health_endpoint():
    return {"healthy": "true"}
