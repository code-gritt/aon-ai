from fastapi import HTTPException
from strawberry.types import Info
from app.database import get_db, SessionLocal
from app.models.user import User
from app.schema.types import RegisterInput, LoginInput, UserType, AuthResponse  # fixed import
from app.utils.auth import hash_password, verify_password, create_access_token, get_current_user


async def register(input: RegisterInput, info: Info) -> AuthResponse:
    """Register a new user and return token + user info"""
    db = next(info.context["db"])  # get the DB session from context
    # Check if email already exists
    if db.query(User).filter(User.email == input.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user
    user = User(
        email=input.email,
        username=input.username,
        hashed_password=hash_password(input.password)
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
            credits=user.credits
        )
    )


async def login(input: LoginInput, info: Info) -> AuthResponse:
    """Authenticate a user and return token + user info"""
    db = next(info.context["db"])
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
            credits=user.credits
        )
    )


async def me(token: str, info: Info) -> UserType:
    """Get current user from token"""
    db = next(info.context["db"])
    user = get_current_user(token, db)
    return UserType(
        id=user.id,
        email=user.email,
        username=user.username,
        credits=user.credits
    )
