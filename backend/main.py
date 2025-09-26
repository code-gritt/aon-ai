import os
import logging
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse
from starlette.middleware.sessions import SessionMiddleware
from strawberry.fastapi import GraphQLRouter
import strawberry
from strawberry.types import Info
from sqlalchemy.orm import Session

from app.database import get_db
from app.routes.auth import register, login, me
from app.schema.types import UserType, AuthResponse, RegisterInput, LoginInput
from app.utils.auth import create_access_token
from app.utils.oauth import google, get_user_from_google

logger = logging.getLogger("uvicorn.error")
app = FastAPI(title="Aon AI Backend")

# ----------------------
# Session Middleware for OAuth (must come first)
# ----------------------
app.add_middleware(
    SessionMiddleware,
    secret_key="supersecretkey",  # keep consistent
    session_cookie="aon_ai_session",
    max_age=3600  # 1 hour
)

# ----------------------
# CORS Configuration
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
# GraphQL Schema
# ----------------------


@strawberry.type
class Query:
    me: UserType = strawberry.field(resolver=me)


@strawberry.type
class Mutation:
    @strawberry.field
    def register(self, info: Info, input: RegisterInput) -> AuthResponse:
        return register(info, input)

    @strawberry.field
    def login(self, info: Info, input: LoginInput) -> AuthResponse:
        return login(info, input)


schema = strawberry.Schema(query=Query, mutation=Mutation)


def get_context(db=Depends(get_db)):
    return {"db": db}


graphql_app = GraphQLRouter(schema, context_getter=get_context)
app.include_router(graphql_app, prefix="/graphql")

# ----------------------
# Google OAuth Routes
# ----------------------


@app.get("/auth/google")
async def google_oauth(request: Request):
    """Initiate Google OAuth redirect (CSRF-safe)"""
    redirect_uri = "https://aon-ai-api.onrender.com/auth/google/callback"
    return await google.authorize_redirect(request, redirect_uri)


@app.get("/auth/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    """Handle Google OAuth callback with sync DB"""
    try:
        token = await google.authorize_access_token(request)
    except Exception as e:
        logger.error(f"Google OAuth error: {e}")
        raise HTTPException(status_code=400, detail=f"OAuth error: {e}")

    try:
        # Sync DB is fine here since psycopg2 is synchronous
        user = get_user_from_google(token, db)
    except Exception as e:
        logger.error(f"Error creating/fetching user: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to create/fetch user: {e}"
        )

    jwt_token = create_access_token({"sub": user.email})
    frontend_url = "http://localhost:5173"
    return RedirectResponse(f"{frontend_url}/auth/callback?token={jwt_token}&email={user.email}")
