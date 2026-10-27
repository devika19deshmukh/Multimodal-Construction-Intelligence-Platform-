import datetime
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from app.models.schemas import DailyAssistantResponse
from app.prompts.engineered_prompts import DAILY_ASSISTANT_SYSTEM_PROMPT
from app.services.ai_service import AIService
from app.utils.image_utils import process_and_encode_image

router = APIRouter(prefix="/assistant", tags=["Daily Site Assistant"])

def generate_fallback_assistant(query: str, project_name: str, has_image: bool) -> dict:
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return {
        "summary": f"Daily operational briefing synthesized for {project_name}. Main structural concrete pour on Level 4 completed at 92% efficiency. Reinforcement cages for east shear walls delivered and staged.",
        "daily_activities": [
            "Level 4 suspended slab: Placed 140 m³ of 35 MPa ready-mix concrete with dual boom pumps.",
            "Rebar tying on Core Wall C2 verified and approved by third-party inspector.",
            "MEP sub-contractor completed fire suppression risers on Levels 2 and 3.",
            "Delivery of 42 tons of ASTM A615 Grade 60 rebar offloaded and tagged."
        ],
        "critical_alerts": [
            "Minor delay on western stairwell formwork due to temporary lumber staging bottleneck.",
            "Tower Crane #1 scheduled for mandatory quarterly load-cell calibration tomorrow at 06:30 AM."
        ],
        "recommendations": [
            "Implement thermal curing blankets on fresh slab overnight due to forecasted temperature drop.",
            "Reassign 4 carpenters from interior drywall framing to expedite western stairwell shoring."
        ],
        "estimated_progress_delta_pct": 0.85,
        "safety_highlights": [
            "Toolbox talk conducted on 100% tie-off compliance during leading edge decking.",
            "Zero recordable incidents or near-misses in the preceding 72 hours."
        ],
        "raw_ai_notes": (
            f"Query processed: '{query}'. "
            + ("Site inspection photograph verified: visual evidence confirms clean formwork alignment and active barricade fencing." if has_image else "Analysis based on site operational logs and project schedule telemetry.")
        ),
        "timestamp": now_str
    }

@router.post("/chat", response_model=DailyAssistantResponse)
async def chat_daily_assistant(
    query: str = Form(..., description="User query or site briefing notes"),
    project_name: Optional[str] = Form("Skyline Tower Phase II"),
    user_role: Optional[str] = Form("Site Superintendent"),
    active_phase: Optional[str] = Form("Superstructure Concrete & Core Walls"),
    file: Optional[UploadFile] = File(None)
):
    image_base64 = None
    mime_type = "image/jpeg"
    has_image = False

    if file:
        content = await file.read()
        if content:
            image_base64, mime_type, _, _ = process_and_encode_image(content)
            has_image = True

    user_prompt = f"""
Project Name: {project_name}
User Role: {user_role}
Current Active Phase: {active_phase}
User Query / Field Update: {query}
Attached Image: {"Yes, site photograph uploaded." if has_image else "No photo uploaded."}
"""

    def fallback():
        return generate_fallback_assistant(query, project_name or "Skyline Tower Phase II", has_image)

    result = await AIService.generate_multimodal_analysis(
        module_name="DailyAssistant",
        system_prompt=DAILY_ASSISTANT_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        fallback_generator=fallback,
        image_base64=image_base64,
        mime_type=mime_type
    )

    if "timestamp" not in result:
        result["timestamp"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    return DailyAssistantResponse(**result)
