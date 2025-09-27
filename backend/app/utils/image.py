import os
import base64
import io
from PIL import Image
from google.generativeai import GenerativeModel
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.image import Image
import google.generativeai as genai

genai.configure(api_key="AIzaSyDqxbID4YBbRnVrVMfvuAgRLAyrjG-hs48")
model = GenerativeModel('gemini-1.5-flash')


def save_uploaded_image(file_content: bytes, filename: str, user_id: int, db: Session) -> str:
    """Save image temporarily and return path."""
    if len(file_content) > 5 * 1024 * 1024:  # 5MB limit
        raise HTTPException(status_code=400, detail="Image too large")

    # Create temp dir if needed
    os.makedirs("tmp/uploads", exist_ok=True)
    file_path = f"tmp/uploads/{filename}"
    with open(file_path, "wb") as f:
        f.write(file_content)

    # Save to DB
    db_image = Image(filename=filename, file_path=file_path, user_id=user_id)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return file_path


def deduct_credits(db: Session, user_id: int, amount: float) -> bool:
    """Deduct credits; return True if successful."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.credits < amount:
        raise HTTPException(status_code=400, detail="Insufficient credits")
    user.credits -= amount
    db.commit()
    return True


def perform_ai_edit(image_path: str, action: str, prompt: str = None) -> str:
    """Use Gemini to edit image; return base64 result."""
    with open(image_path, "rb") as img_file:
        img_data = base64.b64encode(img_file.read()).decode()

    full_prompt = f"{action}: {prompt or ''}. Original image: [base64 image data]"
    try:
        response = model.generate_content(
            [full_prompt, {"inline_data": {"mime_type": "image/jpeg", "data": img_data}}])
        # Parse response for edited image (Gemini returns base64 or description; assume base64 for MVP)
        edited_base64 = response.text  # Simplified; parse actual image from response
        return edited_base64
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"AI edit failed: {str(e)}")
