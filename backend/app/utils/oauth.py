from authlib.integrations.starlette_client import OAuth
from fastapi import Request
from starlette.config import Config
from app.database import SessionLocal
from app.models.user import User
from app.utils.auth import create_access_token, hash_password  # Reuse existing
from sqlalchemy.orm import Session
import os

# Load config
config = Config('.env')
oauth = OAuth(config)

# Register Google client
google = oauth.register(
    name='google',
    client_id="364386726403-0nch7vromibfcu44cj7lsvjlp2tirurs.apps.googleusercontent.com",
    client_secret="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",
    server_metadata_url='https://accounts.google.com/.well-known/openid-federation',
    client_kwargs={'scope': 'openid email profile'},
)


def get_user_from_google(token: dict, db: Session) -> User:
    """Fetch or create user from Google token."""
    user_info = token.get('userinfo')
    if not user_info:
        raise Exception("No user info from Google")

    email = user_info['email']
    google_id = user_info['sub']  # Google's unique user ID

    # Check if user exists by email or google_id
    existing_user = db.query(User).filter(
        (User.email == email) | (User.google_id == google_id)
    ).first()

    if existing_user:
        # Link google_id if not already
        if not existing_user.google_id:
            existing_user.google_id = google_id
            db.commit()
        return existing_user

    # Create new user (no password needed for Google users; set dummy for compatibility)
    dummy_password = hash_password(
        "google_oauth_dummy")  # Reuse existing hash func
    new_user = User(
        email=email,
        # Use name or derive from email
        username=user_info.get('name', email.split('@')[0]),
        hashed_password=dummy_password,
        google_id=google_id,
        credits=100.0  # Default credits
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
