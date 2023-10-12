from pydantic import BaseModel


class LocalMigration(BaseModel):
    id: int
    description: str
    content: str
