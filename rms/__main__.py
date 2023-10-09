from fastapi import FastAPI

from rms.settings import Settings


app = FastAPI()
settings = Settings()


@app.get("/health")
def health_endpoint():
    return {"healthy": "true"}
