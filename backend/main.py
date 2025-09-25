from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
import strawberry
from app.database import get_db
from app.routes.auth import register, login, me
# adjust path if needed
from app.schema.types import UserType, AuthResponse, RegisterInput, LoginInput

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
    @strawberry.field
    def me(self, info) -> UserType:
        """Resolver for current logged-in user"""
        db = info.context["db"]
        token = info.context.get("token")
        return me(token, db)


@strawberry.type
class Mutation:
    @strawberry.field
    def register(self, input: RegisterInput) -> AuthResponse:
        """Resolver for user registration"""
        return register(input)

    @strawberry.field
    def login(self, input: LoginInput) -> AuthResponse:
        """Resolver for user login"""
        return login(input)


schema = strawberry.Schema(query=Query, mutation=Mutation)

# ----------------------
# Dependency Injection for DB
# ----------------------


async def get_context(db=Depends(get_db)):
    """Provide database session in GraphQL context"""
    return {"db": db}

graphql_app = GraphQLRouter(schema, context_getter=get_context)
app.include_router(graphql_app, prefix="/graphql")
