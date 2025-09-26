# app/main.py
import logging
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from starlette.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.utils.oauth import google, get_user_from_google
from app.utils.auth import create_access_token

logger = logging.getLogger("uvicorn.error")

app = FastAPI(title="Aon AI Backend")

# ----------------------
# SessionMiddleware MUST be first
# ----------------------
app.add_middleware(
    SessionMiddleware,
    secret_key="supersecretkey",  # keep hardcoded for now
    session_cookie="aon_ai_session",
    max_age=3600
)

# ----------------------
# CORS
# ----------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://aon-ai.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------
# Google OAuth Routes
# ----------------------


@app.get("/auth/google")
async def google_oauth(request: Request):
    """Initiate Google OAuth redirect"""
    # This stores the `state` in the session cookie
    redirect_uri = "https://aon-ai-api.onrender.com/auth/google/callback"
    return await google.authorize_redirect(request, redirect_uri)


@app.get("/auth/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    """Handle Google callback"""
    try:
        # reads state from session
        token = await google.authorize_access_token(request)
    except Exception as e:
        logger.error(f"Google OAuth error: {e}")
        raise HTTPException(status_code=400, detail=f"OAuth error: {e}")

    try:
        user = get_user_from_google(token, db)  # synchronous DB is fine
    except Exception as e:
        logger.error(f"Error creating/fetching user: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to create/fetch user: {e}"
        )

    jwt_token = create_access_token({"sub": user.email})
    frontend_url = "http://localhost:5173"
    return RedirectResponse(f"{frontend_url}/auth/callback?token={jwt_token}&email={user.email}")
