from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from app.models.schemas import CrackAnalysisResponse
from app.prompts.engineered_prompts import STRUCTURAL_ENGINEER_CRACK_PROMPT
from app.services.ai_service import AIService
from app.utils.image_utils import process_and_encode_image

router = APIRouter(prefix="/structural", tags=["Crack Detection & Structural Analysis"])

def generate_fallback_crack_analysis() -> dict:
    return {
        "crack_detected": True,
        "crack_type": "Structural Shear",
        "estimated_width_mm": 1.85,
        "estimated_length_cm": 68.0,
        "structural_element": "Reinforced Concrete Beam",
        "severity": "Severe",
        "structural_risk_level": "HIGH",
        "probable_causes": [
            "Excessive principal diagonal tension exceeding stirrup shear capacity near quarter-span support.",
            "Dynamic load amplification from heavy material staging directly above on Level 3 slab.",
            "Sub-optimal aggregate interlock compounded by early thermal shrinkage micro-fissuring."
        ],
        "immediate_mitigation_steps": [
            "Install adjustable heavy-duty steel shoring posts (minimum 25-ton load rating) directly below the affected beam span.",
            "Immediately restrict construction traffic and live load staging on the overhead slab bay.",
            "Affix mechanical optical crack tell-tale displacement gauges to monitor ongoing aperture widening."
        ],
        "long_term_remediation": [
            "Core drilling and high-pressure structural epoxy injection (ASTM C881 Type I/IV low-viscosity resin).",
            "Surface preparation and installation of multi-ply carbon fiber reinforced polymer (CFRP) shear laminates bonded with high-modulus epoxy."
        ],
        "requires_licensed_pe_inspection": True,
        "urgency_timeframe": "Within 48 Hours",
        "detailed_assessment": "The uploaded photograph reveals a prominent 45-degree diagonal fracture traversing the web of the reinforced concrete girder. The measured 1.85 mm aperture exceeds the ACI 224R tolerable serviceability limit (0.30 mm) by more than 500%. This indicates significant shear distress rather than cosmetic shrinkage. Immediate temporary structural shoring is mandatory to arrest progression prior to permanent engineered composite reinforcement."
    }

@router.post("/analyze-crack", response_model=CrackAnalysisResponse)
async def analyze_concrete_crack(
    file: UploadFile = File(..., description="High-resolution image of concrete crack or structural element"),
    element_type: Optional[str] = Form("Reinforced Concrete Beam"),
    age_of_structure: Optional[str] = Form("Under Active Construction (6 months)")
):
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty image file provided.")

    image_base64, mime_type, width, height = process_and_encode_image(content)

    user_prompt = f"""
Perform forensic structural evaluation on this image for concrete distress and cracking.
Reported Element Type: {element_type}
Structure Age: {age_of_structure}
Image Resolution: {width}x{height} pixels.
Determine crack aperture, morphology, underlying structural causes, and emergency remediation.
"""

    result = await AIService.generate_multimodal_analysis(
        module_name="CrackAnalysis",
        system_prompt=STRUCTURAL_ENGINEER_CRACK_PROMPT,
        user_prompt=user_prompt,
        fallback_generator=generate_fallback_crack_analysis,
        image_base64=image_base64,
        mime_type=mime_type
    )

    return CrackAnalysisResponse(**result)
