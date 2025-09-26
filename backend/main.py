from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
import strawberry
from strawberry.types import Info
from app.database import get_db
from app.routes.auth import register, login, me
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
