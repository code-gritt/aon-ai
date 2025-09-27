import os
import base64
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.image import Image
import google.generativeai as genai
from google.generativeai import GenerativeModel

genai.configure(api_key="AIzaSyDqxbID4YBbRnVrVMfvuAgRLAyrjG-hs48")
model = GenerativeModel("gemini-1.5-flash")


def save_uploaded_image(file_content: bytes, filename: str, user_id: int, db: Session):
    """Save uploaded image and return (file_path, db_image)."""
    if len(file_content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large")

    os.makedirs("tmp/uploads", exist_ok=True)
    file_path = f"tmp/uploads/{filename}"
    with open(file_path, "wb") as f:
        f.write(file_content)

    db_image = Image(filename=filename, file_path=file_path, user_id=user_id)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)

    return file_path, db_image


def deduct_credits(db: Session, user_id: int, amount: float) -> bool:
    """Deduct credits from user."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.credits < amount:
        raise HTTPException(status_code=400, detail="Insufficient credits")
    user.credits -= amount
    db.commit()
    return True


def perform_ai_edit(image_path: str, action: str, prompt: str = None) -> str:
    """Perform AI edit using Gemini. Return base64 image."""
    with open(image_path, "rb") as img_file:
        img_data = base64.b64encode(img_file.read()).decode()

    full_prompt = f"Apply action: {action}. {prompt or ''}"
    try:
        response = model.generate_content(
            [full_prompt, {"inline_data": {
                "mime_type": "image/jpeg", "data": img_data}}]
        )
        return response.text  # Simplified: should be parsed carefully
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"AI edit failed: {str(e)}")
