import strawberry
from typing import Optional


@strawberry.type
class ImageType:
    id: int
    filename: str
    url: str  # Signed URL or base64 for preview
    created_at: str


@strawberry.input
class AiEditInput:
    image_id: int
    action: str  # e.g., "remove_background", "enhance"
    prompt: Optional[str] = None  # Custom prompt for advanced edits
