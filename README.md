# M1

TeamProject23/M1

# Project prerequisites

* Task - [https://taskfile.dev/]()
* Docker - [https://docs.docker.com/engine/install/]()
* Node - [https://nodejs.org/en/download]()

# Launch instructions

## Backend

Copy the `.env.sample` file as `.env` and fill the empty fields with the required secret information, afterwards run the
following commands

```bash
task backend:build
task backend:up
```

Backend is exposed to port `8069`  
Postgres is exposed to port `5432`

## Using models for keyword extraction
Because the model we selected for this task is enormous (approx 1.5 gb), you can run the application without it, by setting the env variable to `USE_KEYWORD_EXTRACTION_MODEL=f`