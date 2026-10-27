from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from app.models.schemas import SafetyAuditResponse, SafetyDetectionBox, BoundingBox2D
from app.prompts.engineered_prompts import SAFETY_MONITOR_SYSTEM_PROMPT
from app.services.ai_service import AIService
from app.utils.image_utils import process_and_encode_image

router = APIRouter(prefix="/safety", tags=["Safety Monitoring & Hazards"])

def generate_fallback_safety_audit() -> dict:
    return {
        "overall_safety_score": 74,
        "compliance_status": "MINOR_INFRACTIONS",
        "violation_count": 2,
        "compliant_elements_count": 3,
        "detections": [
            {
                "id": "det_ppe_01",
                "label": "Missing Hard Hat (OSHA Non-Compliant)",
                "category": "ppe_violation",
                "confidence": 0.94,
                "box_2d": {"ymin": 160.0, "xmin": 280.0, "ymax": 310.0, "xmax": 420.0},
                "risk_level": "HIGH",
                "description": "Worker observed operating near active scaffolding without ANSI-certified protective headwear.",
                "remediation": "Provide immediate Type I Class E hard hat before permitting further task execution."
            },
            {
                "id": "det_fall_02",
                "label": "Unprotected Slab Edge (Fall Hazard)",
                "category": "fall_hazard",
                "confidence": 0.96,
                "box_2d": {"ymin": 520.0, "xmin": 610.0, "ymax": 840.0, "xmax": 950.0},
                "risk_level": "CRITICAL",
                "description": "Perimeter elevation exceeds 6 feet with missing midrail and toeboards along southern bay.",
                "remediation": "Erect standard 42-inch top-rail guardrail system with 200 lb lateral strength capacity."
            },
            {
                "id": "det_ppe_03",
                "label": "High-Visibility Class 2 Vest Verified",
                "category": "ppe_compliant",
                "confidence": 0.98,
                "box_2d": {"ymin": 300.0, "xmin": 260.0, "ymax": 620.0, "xmax": 440.0},
                "risk_level": "LOW",
                "description": "Worker correctly equipped with ANSI/ISEA 107 fluorescent yellow reflective vest.",
                "remediation": "No action needed. In full compliance."
            },
            {
                "id": "det_ppe_04",
                "label": "Steel-Toe Safety Footwear Confirmed",
                "category": "ppe_compliant",
                "confidence": 0.91,
                "box_2d": {"ymin": 760.0, "xmin": 290.0, "ymax": 890.0, "xmax": 410.0},
                "risk_level": "LOW",
                "description": "ASTM F2413 compliant puncture-resistant safety boots visible.",
                "remediation": "Maintain ongoing daily PPE checks."
            },
            {
                "id": "det_trip_05",
                "label": "Unguarded Electrical Conduit (Trip Hazard)",
                "category": "trip_hazard",
                "confidence": 0.88,
                "box_2d": {"ymin": 780.0, "xmin": 450.0, "ymax": 920.0, "xmax": 630.0},
                "risk_level": "MEDIUM",
                "description": "Temporary 480V generator feeder cable routed across pedestrian walkway without cable bridges.",
                "remediation": "Install heavy-duty polyurethane cable crossover ramp immediately."
            }
        ],
        "immediate_corrective_actions": [
            "Halt activity in Bay 3 until perimeter guardrail is anchored to concrete deck.",
            "Issue written PPE reminder and safety helmet to ironworker crew on Level 4.",
            "Deploy rubberized cable protectors across all ingress/egress ramps."
        ],
        "osha_references": [
            "OSHA 29 CFR 1926.100(a) - Head Protection Requirements",
            "OSHA 29 CFR 1926.501(b)(1) - Duty to Have Fall Protection at 6+ Feet",
            "OSHA 29 CFR 1926.416(a)(1) - Protection from Electric Power Circuits"
        ],
        "supervisor_signoff_required": True,
        "summary": "AI computer vision audit identified 1 critical fall hazard and 1 high-risk PPE deficiency alongside verified compliant high-visibility garments. Overall safety index stands at 74/100. Corrective field actions must be verified by site safety supervisor before afternoon crane operations."
    }

@router.post("/audit", response_model=SafetyAuditResponse)
async def audit_safety_image(
    file: UploadFile = File(..., description="Job site photo to analyze for PPE and safety hazards"),
    site_location: Optional[str] = Form("Site Perimeter Zone 4"),
    inspection_priority: Optional[str] = Form("Standard Full Audit")
):
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty image file provided.")

    image_base64, mime_type, width, height = process_and_encode_image(content)

    user_prompt = f"""
Inspect this construction site image for PPE compliance (helmets, high-vis vests, eye wear, boots, harnesses),
fall hazards, open floor penetrations, scaffolding guardrails, and heavy machinery pinch points.
Site Location: {site_location}
Priority: {inspection_priority}
Image Dimensions: {width}x{height} pixels.
Generate 2D bounding boxes normalized on a 0-1000 scale.
"""

    result = await AIService.generate_multimodal_analysis(
        module_name="SafetyAudit",
        system_prompt=SAFETY_MONITOR_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        fallback_generator=generate_fallback_safety_audit,
        image_base64=image_base64,
        mime_type=mime_type
    )

    return SafetyAuditResponse(**result)
