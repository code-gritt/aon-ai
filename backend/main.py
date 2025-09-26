from backend.app.utils.auth import create_access_token
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
import strawberry
from strawberry.types import Info
from starlette.responses import RedirectResponse
import os

from app.database import get_db
from app.routes.auth import register, login, me
from app.schema.types import UserType, AuthResponse, RegisterInput, LoginInput
from app.utils.oauth import google, get_user_from_google  # New import


app = FastAPI(title="Aon AI Backend")

# ----------------------
# CORS Configuration
# ----------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://aon-ai.vercel.app"
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
        """Resolver for user registration"""
        return await register(info, input)

    @strawberry.field
    async def login(self, info: Info, input: LoginInput) -> AuthResponse:
        """Resolver for user login"""
        return await login(info, input)


schema = strawberry.Schema(query=Query, mutation=Mutation)

# ----------------------
# Dependency Injection for DB
# ----------------------


async def get_context(db=Depends(get_db)):
    """Provide database session in GraphQL context"""
    return {"db": db}

graphql_app = GraphQLRouter(schema, context_getter=get_context)
app.include_router(graphql_app, prefix="/graphql")

# ----------------------
# Google OAuth Routes (NEW)
# ----------------------


@app.get("/auth/google")
async def google_oauth(request: Request):
    """Initiate Google OAuth redirect."""
    redirect_uri = "https://aon-ai-api.onrender.com/auth/google/callback"
    return await google.authorize_redirect(request, redirect_uri)


@app.get("/auth/google/callback")
async def google_callback(request: Request, db=Depends(get_db)):
    """Handle Google callback, create/login user, redirect with JWT."""
    try:
        token = await google.authorize_access_token(request)
    except Exception:
        raise HTTPException(status_code=400, detail="OAuth error")

    user = get_user_from_google(token, db)
    # Reuse existing JWT creation
    jwt_token = create_access_token({"sub": user.email})

    # Redirect to frontend with token in query param
    frontend_url = os.getenv(
        "FRONTEND_URL", "http://localhost:5173", "https://aon-ai.vercel.app")
    return RedirectResponse(f"{frontend_url}/auth/callback?token={jwt_token}&email={user.email}")
