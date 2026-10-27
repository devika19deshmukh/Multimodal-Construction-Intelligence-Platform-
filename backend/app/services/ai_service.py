import json
import re
import logging
import httpx
from typing import Optional, Dict, Any
from app.config import settings

logger = logging.getLogger("ai_service")
logging.basicConfig(level=logging.INFO)

def clean_json_string(raw_text: str) -> str:
    """Extracts raw JSON content by stripping markdown code fences or conversational boilerplate."""
    text = raw_text.strip()
    
    # Try regex matching ```json ... ``` or ``` ... ```
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if match:
        return match.group(1).strip()
    
    # If starting with { or [, find the balance
    first_brace = text.find("{")
    last_brace = text.rfind("}")
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        return text[first_brace:last_brace + 1].strip()
        
    return text

class AIService:
    @staticmethod
    async def call_gemini(system_prompt: str, user_prompt: str, image_base64: Optional[str] = None, mime_type: str = "image/jpeg") -> str:
        """Invokes Gemini Multimodal API via HTTPX with JSON enforcement."""
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            raise ValueError("GEMINI_API_KEY not configured.")
            
        model = settings.GEMINI_MODEL or "gemini-1.5-pro"
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        
        parts = []
        if image_base64:
            parts.append({
                "inline_data": {
                    "mime_type": mime_type,
                    "data": image_base64
                }
            })
        parts.append({"text": user_prompt})
        
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": parts
                }
            ],
            "system_instruction": {
                "parts": [{"text": system_prompt}]
            },
            "generationConfig": {
                "response_mime_type": "application/json",
                "temperature": 0.2
            }
        }
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(url, json=payload)
            if response.status_code != 200:
                raise RuntimeError(f"Gemini API error {response.status_code}: {response.text}")
            
            data = response.json()
            candidates = data.get("candidates", [])
            if not candidates:
                raise RuntimeError("No candidates returned from Gemini.")
            
            content_parts = candidates[0].get("content", {}).get("parts", [])
            if not content_parts:
                raise RuntimeError("Empty response content from Gemini.")
                
            return content_parts[0].get("text", "")

    @staticmethod
    async def call_openai(system_prompt: str, user_prompt: str, image_base64: Optional[str] = None, mime_type: str = "image/jpeg") -> str:
        """Invokes OpenAI Vision API via HTTPX with JSON mode."""
        api_key = settings.OPENAI_API_KEY
        if not api_key:
            raise ValueError("OPENAI_API_KEY not configured.")
            
        model = settings.OPENAI_MODEL or "gpt-4o"
        url = "https://api.openai.com/v1/chat/completions"
        
        user_content = []
        if image_base64:
            user_content.append({
                "type": "image_url",
                "image_url": {
                    "url": f"data:{mime_type};base64,{image_base64}"
                }
            })
        user_content.append({"type": "text", "text": user_prompt})
        
        payload = {
            "model": model,
            "response_format": {"type": "json_object"},
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            "temperature": 0.2
        }
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(url, json=payload, headers=headers)
            if response.status_code != 200:
                raise RuntimeError(f"OpenAI API error {response.status_code}: {response.text}")
                
            data = response.json()
            choices = data.get("choices", [])
            if not choices:
                raise RuntimeError("No choices returned from OpenAI.")
                
            return choices[0].get("message", {}).get("content", "")

    @classmethod
    async def generate_multimodal_analysis(
        cls,
        module_name: str,
        system_prompt: str,
        user_prompt: str,
        fallback_generator,
        image_base64: Optional[str] = None,
        mime_type: str = "image/jpeg"
    ) -> Dict[str, Any]:
        """
        Orchestrates AI call: tries configured provider (Gemini or OpenAI).
        If no API key is provided or if network fails, seamlessly falls back to high-fidelity domain simulator.
        """
        provider = settings.AI_PROVIDER.lower()
        has_gemini = bool(settings.GEMINI_API_KEY)
        has_openai = bool(settings.OPENAI_API_KEY)
        
        raw_result = None
        
        # 1. Try Gemini
        if (provider in ("auto", "gemini") and has_gemini):
            try:
                logger.info(f"Invoking Gemini for module {module_name}")
                raw_result = await cls.call_gemini(system_prompt, user_prompt, image_base64, mime_type)
            except Exception as e:
                logger.warning(f"Gemini call failed: {e}. Checking secondary options...")
                
        # 2. Try OpenAI
        if not raw_result and (provider in ("auto", "openai") and has_openai):
            try:
                logger.info(f"Invoking OpenAI for module {module_name}")
                raw_result = await cls.call_openai(system_prompt, user_prompt, image_base64, mime_type)
            except Exception as e:
                logger.warning(f"OpenAI call failed: {e}. Falling back to domain simulation engine...")

        # Parse AI output if available
        if raw_result:
            try:
                cleaned = clean_json_string(raw_result)
                parsed = json.loads(cleaned)
                return parsed
            except Exception as e:
                logger.error(f"Failed to parse AI output as JSON: {e}. Output was: {raw_result}")
                
        # 3. High-Fidelity Domain Simulation Fallback
        logger.info(f"Executing high-fidelity domain simulation generator for {module_name}")
        return fallback_generator()
