import os
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file if available
load_dotenv()

class AppConfig(BaseModel):
    PROJECT_NAME: str = "Multimodal Construction Intelligence Platform"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    
    # AI Providers Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-pro")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o")
    
    # Provider options: "auto", "gemini", "openai", "mock"
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "auto")
    
    # Server settings
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = AppConfig()

def update_runtime_api_keys(gemini_key: str = None, openai_key: str = None, provider: str = None):
    """Allows updating API keys dynamically at runtime from the frontend settings modal."""
    global settings
    if gemini_key is not None:
        settings.GEMINI_API_KEY = gemini_key.strip()
    if openai_key is not None:
        settings.OPENAI_API_KEY = openai_key.strip()
    if provider is not None:
        settings.AI_PROVIDER = provider.strip()
    return settings
