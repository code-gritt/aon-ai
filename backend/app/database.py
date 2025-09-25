import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# ----------------------
# Load environment variables
# ----------------------
load_dotenv()

# ----------------------
# Database URL
# ----------------------
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://neondb_owner:npg_IL7gfrHAtQ9k@ep-dry-glade-adliqabi-pooler.c-2.us-east-1.aws.neon.tech/aon-ai-database?sslmode=require&channel_binding=require"
)

# ----------------------
# SQLAlchemy Engine & Session
# ----------------------
engine = create_engine(
    DATABASE_URL,
    echo=False,           # Set True for SQL debug logs
    future=True           # Use SQLAlchemy 2.0 style
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ----------------------
# Base class for models
# ----------------------
Base = declarative_base()

# ----------------------
# Dependency for FastAPI / Strawberry
# ----------------------


def get_db():
    """
    Provide a database session.
    This is a generator, so it can be used with `yield` for proper cleanup.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
