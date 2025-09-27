from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, nullable=True)
    hashed_password = Column(String, nullable=False)
    credits = Column(Float, default=100.0)
    google_id = Column(String, unique=True, nullable=True)

    # Relationship with images
    images = relationship("Image", back_populates="user")
