import strawberry
from typing import Optional


@strawberry.type
class ImageType:
    id: int
    filename: str
    url: str  # public URL or base64 preview
    created_at: str


@strawberry.input
class AiEditInput:
    image_id: int
    action: str  # e.g. "remove_background", "enhance"
    prompt: Optional[str] = None
