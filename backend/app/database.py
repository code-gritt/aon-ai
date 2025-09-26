import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://neondb_owner:npg_IL7gfrHAtQ9k@ep-dry-glade-adliqabi-pooler.c-2.us-east-1.aws.neon.tech/aon-ai-database",
)

# Sync engine
engine = create_engine(
    DATABASE_URL,
    echo=False,
    future=True,
)

# Sync session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Base class for models
Base = declarative_base()

# Dependency


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
