from fastapi import HTTPException
from strawberry.types import Info
from app.models.user import User
from app.schema.types import RegisterInput, LoginInput, UserType, AuthResponse
from app.utils.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)


async def register(info: Info, input: RegisterInput) -> AuthResponse:
    """Register a new user and return token + user info"""
    db = info.context["db"]  # ✅ directly use session

    # Check if email already exists
    if db.query(User).filter(User.email == input.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user
    user = User(
        email=input.email,
        username=input.username,
        hashed_password=hash_password(input.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Generate JWT token
    token = create_access_token({"sub": user.email})

    return AuthResponse(
        token=token,
        user=UserType(
            id=user.id,
            email=user.email,
            username=user.username,
            credits=user.credits,
        ),
    )


async def login(info: Info, input: LoginInput) -> AuthResponse:
    """Authenticate a user and return token + user info"""
    db = info.context["db"]  # ✅ directly use session
    user = db.query(User).filter(User.email == input.email).first()

    if not user or not verify_password(input.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})

    return AuthResponse(
        token=token,
        user=UserType(
            id=user.id,
            email=user.email,
            username=user.username,
            credits=user.credits,
        ),
    )


async def me(info: Info, token: str) -> UserType:
    """Get current user from token"""
    db = info.context["db"]  # ✅ directly use session
    user = get_current_user(token, db)

    return UserType(
        id=user.id,
        email=user.email,
        username=user.username,
        credits=user.credits,
    )
