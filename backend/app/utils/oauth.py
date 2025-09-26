# app/utils/oauth_handler.py
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.auth import hash_password

# Load environment configuration
config = Config(".env")
oauth = OAuth(config)

# Register Google OAuth client
google = oauth.register(
    name="google",
    client_id="364386726403-0nch7vromibfcu44cj7lsvjlp2tirurs.apps.googleusercontent.com",
    client_secret="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",
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",  # ✅ Fixed
    client_kwargs={"scope": "openid email profile"},
)


def get_user_from_google(token: dict, db: Session) -> User:
    """
    Fetch an existing user by email/google_id or create a new one from Google token.
    """
    user_info = token.get("userinfo")
    if not user_info:
        raise ValueError("No user info returned from Google")

    email = user_info["email"]
    google_id = user_info["sub"]

    # Check if user exists
    user = db.query(User).filter((User.email == email) |
                                 (User.google_id == google_id)).first()
    if user:
        # Link Google ID if missing
        if not user.google_id:
            user.google_id = google_id
            db.commit()
        return user

    # Create new user
    new_user = User(
        email=email,
        username=user_info.get("name", email.split("@")[0]),
        hashed_password=hash_password("google_oauth_dummy"),
        google_id=google_id,
        credits=100.0,  # Default credits
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
