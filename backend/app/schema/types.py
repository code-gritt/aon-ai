import strawberry
from typing import Optional
from app.schema.image import ImageType, AiEditInput, Upload


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


@strawberry.type
class Mutation:
    upload_image: ImageType = strawberry.field(resolver=upload_image)
    ai_edit: ImageType = strawberry.field(resolver=ai_edit)
