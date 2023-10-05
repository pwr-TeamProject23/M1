FROM python:3.11.6-bullseye

ENV POETRY_VIRTUALENVS_CREATE=false \
    PATH="/root/.local/bin:$PATH"

RUN curl -sSL https://install.python-poetry.org | python3 -

COPY pyproject.toml poetry.lock ./
RUN poetry install

COPY . .

EXPOSE 8000

CMD ["uvicorn", "rms.__main__:app", "--port=8000", "--host=0.0.0.0"]