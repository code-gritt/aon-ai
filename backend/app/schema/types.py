import strawberry
from typing import Optional


@strawberry.type
class UserType:
    id: int
    email: str
    username: Optional[str] = None
    credits: float


@strawberry.input
class RegisterInput:
    email: str
    password: str
    username: Optional[str] = None


@strawberry.input
class LoginInput:
    email: str
    password: str


@strawberry.type
class AuthResponse:
    token: str
    user: UserType
