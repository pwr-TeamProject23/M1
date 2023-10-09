FROM python:3.11.6-bullseye as base

ENV POETRY_VIRTUALENVS_CREATE=false \
    PATH="/root/.local/bin:$PATH"

RUN curl -sSL https://install.python-poetry.org | python3 -

WORKDIR /home/app

COPY pyproject.toml poetry.lock ./
RUN poetry install

COPY . .

EXPOSE 8000

FROM base as prod
CMD ["uvicorn", "rms.__main__:app", "--port=8000", "--host=0.0.0.0"]


FROM base as dev
CMD ["uvicorn", "rms.__main__:app", "--port=8000", "--host=0.0.0.0", "--reload"]