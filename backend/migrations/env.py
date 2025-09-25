import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv

# Import models and Base
from app.database import Base
from app.models.user import User  # Add other models here

# Load environment variables
load_dotenv()

# Alembic Config
config = context.config

# ----------------------
# Use psycopg2
# ----------------------
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://neondb_owner:npg_IL7gfrHAtQ9k@ep-dry-glade-adliqabi-pooler.c-2.us-east-1.aws.neon.tech/aon-ai-database?sslmode=require",
)
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# Configure logging
if config.config_file_name:
    fileConfig(config.config_file_name)

# Metadata
target_metadata = Base.metadata

# Offline migrations


def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url, target_metadata=target_metadata, literal_binds=True
    )
    with context.begin_transaction():
        context.run_migrations()

# Online migrations


def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection,
                          target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


# Run appropriate mode
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
