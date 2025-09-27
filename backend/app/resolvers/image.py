import os
import base64
import strawberry
from strawberry.types import Info
from strawberry.file_uploads import Upload
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.image import Image
from app.schema.image import ImageType, AiEditInput
from app.utils.image import save_uploaded_image, deduct_credits, perform_ai_edit
from app.utils.auth import get_current_user


async def upload_image(file: Upload, info: Info) -> ImageType:
    db: Session = info.context["db"]

    # Auth
    token = info.context["request"].headers.get(
        "Authorization", "").replace("Bearer ", "")
    user = get_current_user(token, db)

    # Save file
    file_content = await file.read()
    file_path, db_image = save_uploaded_image(
        file_content, file.filename, user.id, db)

    return ImageType(
        id=db_image.id,
        filename=db_image.filename,
        url=f"/images/{db_image.filename}",  # adjust if you serve from CDN
        created_at=str(db_image.created_at),
    )


async def ai_edit(input: AiEditInput, info: Info) -> ImageType:
    db: Session = info.context["db"]

    # Auth
    token = info.context["request"].headers.get(
        "Authorization", "").replace("Bearer ", "")
    user = get_current_user(token, db)

    # Check image belongs to user
    db_image = db.query(Image).filter(
        Image.id == input.image_id, Image.user_id == user.id
    ).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Image not found")

    # Deduct credits
    credit_cost = 5 if input.action in ["enhance", "remove_background"] else 10
    deduct_credits(db, user.id, credit_cost)

    # AI edit
    edited_base64 = perform_ai_edit(
        db_image.file_path, input.action, input.prompt)

    # Save new edited file
    edited_filename = f"edited_{db_image.filename}"
    edited_path = f"tmp/uploads/{edited_filename}"
    os.makedirs("tmp/uploads", exist_ok=True)
    with open(edited_path, "wb") as f:
        f.write(base64.b64decode(edited_base64))

    # Save DB entry
    new_image = Image(filename=edited_filename,
                      file_path=edited_path, user_id=user.id)
    db.add(new_image)
    db.commit()
    db.refresh(new_image)

    return ImageType(
        id=new_image.id,
        filename=new_image.filename,
        url=f"data:image/jpeg;base64,{edited_base64}",
        created_at=str(new_image.created_at),
    )
