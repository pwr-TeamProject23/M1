FROM python:3.11.6-bullseye as base

ENV POETRY_VIRTUALENVS_CREATE=false \
    PATH="/root/.local/bin:$PATH" \
    PYTHONPATH="/home/app:$PYTHONPATH"

RUN curl -sSL https://install.python-poetry.org | python3 -

WORKDIR /home/app

COPY pyproject.toml poetry.lock ./
COPY scripts .
RUN poetry install

COPY . .

EXPOSE 8000

FROM base as prod

CMD ["bash", "scripts/launch_prod.sh"]


FROM base as dev
CMD ["bash", "scripts/launch_dev.sh"]