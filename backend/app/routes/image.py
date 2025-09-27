from strawberry.types import Info
from fastapi import Depends, HTTPException
from app.database import get_db
from app.models.user import User
from app.models.image import Image
from app.schemas.image import AiEditInput, ImageType
from app.utils.image import save_uploaded_image, deduct_credits, perform_ai_edit
from app.utils.auth import get_current_user
from strawberry import scalar


@scalar
class Upload:
    pass  # For file uploads


async def upload_image(file: Upload, info: Info) -> ImageType:
    db = info.context["db"]
    user = get_current_user(info.context["request"].headers.get(
        "Authorization", "").replace("Bearer ", ""), db)
    filename = file.filename
    file_path = save_uploaded_image(await file.read(), filename, user.id, db)
    return ImageType(id=db_image.id, filename=filename, url=f"/images/{filename}", created_at=str(db_image.created_at))


async def ai_edit(input: AiEditInput, info: Info) -> ImageType:
    db = info.context["db"]
    user = get_current_user(info.context["request"].headers.get(
        "Authorization", "").replace("Bearer ", ""), db)

    # Get image
    db_image = db.query(Image).filter(
        Image.id == input.image_id, Image.user_id == user.id).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Image not found")

    # Deduct credits (5 for basic AI, 10 for advanced)
    credit_cost = 5 if input.action in ["enhance", "remove_background"] else 10
    deduct_credits(db, user.id, credit_cost)

    # Perform AI edit
    edited_base64 = perform_ai_edit(
        db_image.file_path, input.action, input.prompt)

    # Save edited image (simplified; store base64 or new file)
    edited_filename = f"edited_{db_image.filename}"
    with open(f"tmp/uploads/{edited_filename}", "wb") as f:
        f.write(base64.b64decode(edited_base64))

    # Update DB or create new image entry
    new_image = Image(filename=edited_filename,
                      file_path=f"tmp/uploads/{edited_filename}", user_id=user.id)
    db.add(new_image)
    db.commit()

    return ImageType(id=new_image.id, filename=edited_filename, url=f"data:image/jpeg;base64,{edited_base64}", created_at=str(new_image.created_at))
