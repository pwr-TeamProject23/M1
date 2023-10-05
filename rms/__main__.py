from fastapi import FastAPI


app = FastAPI()



@app.get("/health")
def health_endpoint():
    return {"healthy": "true"}
