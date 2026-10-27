import base64
import io
from PIL import Image

def process_and_encode_image(image_bytes: bytes, max_dimension: int = 1536) -> tuple[str, str, int, int]:
    """
    Validates, optionally resizes, and base64 encodes image bytes for LLM consumption.
    Returns: (base64_str, mime_type, width, height)
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        orig_format = image.format or "JPEG"
        
        # Convert RGBA to RGB for JPEG compatibility if needed
        if image.mode in ("RGBA", "P") and orig_format.upper() in ("JPEG", "JPG"):
            image = image.convert("RGB")
            
        width, height = image.size
        
        # Resize if dimensions exceed max_dimension while maintaining aspect ratio
        if max(width, height) > max_dimension:
            scaling_factor = max_dimension / max(width, height)
            new_size = (int(width * scaling_factor), int(height * scaling_factor))
            image = image.resize(new_size, Image.Resampling.LANCZOS)
            width, height = image.size
            
        buffered = io.BytesIO()
        mime_format = "JPEG" if orig_format.upper() in ("JPEG", "JPG") else orig_format
        image.save(buffered, format=mime_format)
        
        encoded_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        mime_type = f"image/{mime_format.lower()}"
        if mime_type == "image/jpg":
            mime_type = "image/jpeg"
            
        return encoded_str, mime_type, width, height
    except Exception as e:
        # Fallback to direct raw base64 if PIL fails
        encoded_str = base64.b64encode(image_bytes).decode("utf-8")
        return encoded_str, "image/jpeg", 800, 600

def get_data_url(base64_str: str, mime_type: str = "image/jpeg") -> str:
    """Returns standard data URL format."""
    return f"data:{mime_type};base64,{base64_str}"
