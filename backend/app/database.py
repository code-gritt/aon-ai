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
# Database URL (use psycopg2)
# ----------------------
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://neondb_owner:npg_IL7gfrHAtQ9k@ep-dry-glade-adliqabi-pooler.c-2.us-east-1.aws.neon.tech/aon-ai-database?sslmode=require",
)

# ----------------------
# SQLAlchemy Engine & Session
# ----------------------
engine = create_engine(
    DATABASE_URL,
    echo=False,   # Enable for SQL debug logs if needed
    future=True,  # Use SQLAlchemy 2.0 style
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# ----------------------
# Base class for models
# ----------------------
Base = declarative_base()

# ----------------------
# Dependency for FastAPI / Strawberry
# ----------------------


def get_db():
    """Provide a database session for dependency injection."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
