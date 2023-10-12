from pathlib import Path

from rms.migrations.models import LocalMigration
from rms.utils.postgres import engine
from sqlalchemy.sql import text


class MigrationRunner:
    @classmethod
    def run(cls):
        migration_files = FileSystemMigrationManager.list_all_files()
        migrations = FileSystemMigrationManager.load_all_files(migration_files)

        cls.print_detected_migrations(migrations)

        DatabaseMigrationsManager.run(migrations)

    @staticmethod
    def print_detected_migrations(migrations: list[LocalMigration]):
        print(f"Detected {len(migrations)} migration files")

        for migration in migrations:
            print(f"{migration.id:04}_{migration.description}.sql")

        print()


class FileSystemMigrationManager:
    @staticmethod
    def list_all_files() -> list[Path]:
        migrations_dir = Path(__file__).parent / "sqls"

        files = [path for path in migrations_dir.iterdir() if path.is_file()]

        return files

    @classmethod
    def load_all_files(cls, paths: list[Path]):
        loaded_files = []

        for path in paths:
            with open(path) as f:
                content = f.read()
                migration_id, description = cls._parse_file_name(path.name)

                item = LocalMigration(
                    id=migration_id,
                    description=description,
                    content=content,
                )
                loaded_files.append(item)

        return loaded_files

    @staticmethod
    def _parse_file_name(name: str) -> tuple[int, str]:
        f_name, _ = name.split(".")

        migration_number, migration_name = f_name.split("_")

        return int(migration_number), migration_name


class DatabaseMigrationsManager:
    INSERT_MIGRATION_META_QUERY = """
        insert into migrations(id, name) values (:id, :name)
    """

    GET_MIGRATION_BY_ID_QUERY = """
        select * from migrations where id=:id
    """

    @classmethod
    def run(cls, migrations: list[LocalMigration]):
        print("Running migration resolver")
        cls.execute_migration(migrations[0], print_update=False)

        for migration in migrations:
            should_run = not cls.check_if_migration_exists(migration.id)

            if should_run:
                cls.execute_migration(migration)

    @classmethod
    def check_if_migration_exists(cls, migration_id: int) -> bool:
        with engine.connect() as connection:
            output = connection.execute(text(cls.GET_MIGRATION_BY_ID_QUERY), {"id": migration_id}).fetchall()

            return bool(output)

    @classmethod
    def execute_migration(cls, migration: LocalMigration, print_update: bool = True):
        with engine.connect() as connection:
            connection.execute(text(migration.content))

            if not cls.check_if_migration_exists(migration.id):
                connection.execute(
                    text(cls.INSERT_MIGRATION_META_QUERY),
                    {"id": migration.id, "name": migration.description},
                )

            connection.commit()

        if print_update:
            print(f"Applied migration {migration.id}_{migration.description}")


if __name__ == "__main__":
    MigrationRunner.run()
