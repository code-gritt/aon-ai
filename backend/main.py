# app/main.py
import os
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse
from strawberry.fastapi import GraphQLRouter
import strawberry
from strawberry.types import Info
import logging

from app.database import get_db
from app.routes.auth import register, login, me
from app.schema.types import UserType, AuthResponse, RegisterInput, LoginInput
from app.utils.auth import create_access_token
from app.utils.oauth import google, get_user_from_google

app = FastAPI(title="Aon AI Backend")
logger = logging.getLogger("uvicorn.error")

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
    async def register(self, info: Info, input: RegisterInput) -> AuthResponse:
        return await register(info, input)

    @strawberry.field
    async def login(self, info: Info, input: LoginInput) -> AuthResponse:
        return await login(info, input)


schema = strawberry.Schema(query=Query, mutation=Mutation)


async def get_context(db=Depends(get_db)):
    return {"db": db}


graphql_app = GraphQLRouter(schema, context_getter=get_context)
app.include_router(graphql_app, prefix="/graphql")

# ----------------------
# Google OAuth Routes
# ----------------------


@app.get("/auth/google")
async def google_oauth(request: Request):
    """Initiate Google OAuth redirect"""
    redirect_uri = "https://aon-ai-api.onrender.com/auth/google/callback"
    return await google.authorize_redirect(request, redirect_uri)


@app.get("/auth/google/callback")
async def google_callback(request: Request, db=Depends(get_db)):
    """Handle Google callback, create/login user, redirect with JWT"""
    try:
        token = await google.authorize_access_token(request)
    except Exception as e:
        logger.error(f"Google OAuth error: {e}")
        raise HTTPException(status_code=400, detail=f"OAuth error: {e}")

    try:
        user = get_user_from_google(token, db)
    except Exception as e:
        logger.error(f"Error creating/fetching user: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to create or fetch user")

    jwt_token = create_access_token({"sub": user.email})
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    return RedirectResponse(f"{frontend_url}/auth/callback?token={jwt_token}&email={user.email}")
