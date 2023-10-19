from fastapi import FastAPI, Depends

from rms.auth.dependencies import get_current_user
from rms.auth.models import User
from rms.settings import Settings
from rms.file_processing.views import router as file_processing_router
from rms.auth.views import router as auth_router

app = FastAPI()
settings = Settings()

app.include_router(file_processing_router)
app.include_router(auth_router)


@app.get("/health")
def health_endpoint(user: User = Depends(get_current_user)):
    return {
        "healthy": "true",
        "user": user
    }
