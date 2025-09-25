from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv
import os

# Import your models and Base
from app.models.user import User  # ensure all models are imported here
from app.database import Base

# ----------------------
# Alembic Config
# ----------------------
config = context.config
load_dotenv()

# Get DB URL (prefer env var, fallback to default)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://neondb_owner:npg_IL7gfrHAtQ9k@ep-dry-glade-adliqabi-pooler.c-2.us-east-1.aws.neon.tech/aon-ai-database?sslmode=require",
)

# Set the sqlalchemy.url for Alembic
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# Interpret the config file for logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Target metadata from your Base
target_metadata = Base.metadata

# ----------------------
# Migration Functions
# ----------------------


def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
