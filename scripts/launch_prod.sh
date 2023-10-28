python rms/migrations/runner.py

uvicorn rms.__main__:app --proxy-headers --port=8000 --host=0.0.0.0