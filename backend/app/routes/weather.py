from fastapi import APIRouter
from app.models.schemas import WeatherAdvisoryRequest, WeatherAdvisoryResponse, TaskWeatherImpact
from app.prompts.engineered_prompts import WEATHER_ADVISOR_SYSTEM_PROMPT
from app.services.ai_service import AIService

router = APIRouter(prefix="/weather", tags=["Weather-Aware Advisory"])

def generate_fallback_weather_advisory(req: WeatherAdvisoryRequest) -> dict:
    is_rain = "rain" in req.weather_condition.lower() or req.precipitation_prob_pct > 50 or req.precipitation_amount_mm > 5.0
    is_high_wind = req.wind_speed_kmh > 35.0
    is_heat = req.temperature_c > 33.0
    is_freezing = req.temperature_c < 2.0

    task_impacts = []
    has_halt = False
    has_caution = False

    for task in req.active_tasks:
        task_lower = task.lower()
        if "crane" in task_lower or "lift" in task_lower:
            if is_high_wind:
                task_impacts.append({
                    "task_name": task,
                    "status": "HALT",
                    "primary_hazard": "Wind gusts exceed crane manufacturer maximum permissible out-of-service limit (38 km/h). Extreme risk of pendulum load deflection and structural boom fatigue.",
                    "limiting_threshold": "Max permissible crane wind: 38 km/h. Current recorded wind: " + str(req.wind_speed_kmh) + " km/h.",
                    "mandatory_protocol": "Disengage hooks, land all suspended loads immediately, dog the hoist, and release the slewing brake to allow weather-vaning.",
                    "safe_alternative_task": "Perform preventative ground inspection, grease hoist ropes, or verify electrical junction boxes in sheltered basement."
                })
                has_halt = True
            elif req.wind_speed_kmh > 25.0:
                task_impacts.append({
                    "task_name": task,
                    "status": "CAUTION",
                    "primary_hazard": "Moderate wind turbulence may induce load rotation.",
                    "limiting_threshold": "Watchful operation: 25-35 km/h.",
                    "mandatory_protocol": "Utilize dual non-conductive taglines with dedicated rigging spotters for every pick.",
                    "safe_alternative_task": None
                })
                has_caution = True
            else:
                task_impacts.append({
                    "task_name": task,
                    "status": "GO",
                    "primary_hazard": "None within current wind parameters.",
                    "limiting_threshold": "Wind within safe envelope (<25 km/h).",
                    "mandatory_protocol": "Standard pre-shift lift meeting and daily inspection checklist.",
                    "safe_alternative_task": None
                })
                
        elif "concrete" in task_lower or "pour" in task_lower:
            if is_rain:
                task_impacts.append({
                    "task_name": task,
                    "status": "HALT",
                    "primary_hazard": "Rainwater mixing into unhydrated concrete alters the water-cement ratio, degrading compressive strength and causing severe surface delamination and dusting.",
                    "limiting_threshold": "Zero unmitigated precipitation permitted during placement and finishing.",
                    "mandatory_protocol": "Halt ready-mix batching immediately. Protect newly placed sections with anchored waterproof poly sheeting. Cut temporary bulkheads if cold joint required.",
                    "safe_alternative_task": "Erect shoring forms on lower enclosed floors or tie rebar on sheltered decks."
                })
                has_halt = True
            elif is_heat:
                task_impacts.append({
                    "task_name": task,
                    "status": "CAUTION",
                    "primary_hazard": "High ambient temperature accelerates hydration, risking plastic shrinkage cracking and rapid slump loss.",
                    "limiting_threshold": "ACI 305 Hot Weather Concreting limits (>32°C).",
                    "mandatory_protocol": "Add liquid nitrogen or shaved ice to batch water, apply evaporative retarders, and commence fog spraying immediately post-troweling.",
                    "safe_alternative_task": "Shift major pours to early morning (04:00 AM) window."
                })
                has_caution = True
            elif is_freezing:
                task_impacts.append({
                    "task_name": task,
                    "status": "HALT",
                    "primary_hazard": "Freezing before reaching 500 psi destroys internal capillary structure permanently.",
                    "limiting_threshold": "Ambient temp < 5°C requires ACI 306 Cold Weather protocols.",
                    "mandatory_protocol": "Enclose bay with insulated tarps, ignite indirect hydronic ground heaters, verify subgrade is free of frost.",
                    "safe_alternative_task": "Indoor MEP rough-ins."
                })
                has_halt = True
            else:
                task_impacts.append({
                    "task_name": task,
                    "status": "GO",
                    "primary_hazard": "Nominal thermal conditions.",
                    "limiting_threshold": "Temperature and moisture within optimal curing spectrum.",
                    "mandatory_protocol": "Ensure standard wet burlap or liquid membrane curing.",
                    "safe_alternative_task": None
                })
                
        elif "glazing" in task_lower or "curtain" in task_lower or "facade" in task_lower:
            if is_high_wind or req.wind_speed_kmh > 28.0:
                task_impacts.append({
                    "task_name": task,
                    "status": "HALT",
                    "primary_hazard": "Glass panels act as large sails under wind pressure; risk of glass fracture and loss of vacuum cup suction adhesion.",
                    "limiting_threshold": "Curtain wall suction cup limit: 28 km/h.",
                    "mandatory_protocol": "Secure all unanchored glass lites in transport stillages inside building perimeter.",
                    "safe_alternative_task": "Interior bracket anchoring and perimeter fire-stopping installation."
                })
                has_halt = True
            else:
                task_impacts.append({
                    "task_name": task,
                    "status": "GO",
                    "primary_hazard": "Low aerodynamic threat.",
                    "limiting_threshold": "Wind < 28 km/h.",
                    "mandatory_protocol": "Verify vacuum pump battery charge and redundant safety straps.",
                    "safe_alternative_task": None
                })
                
        elif "excavat" in task_lower or "trench" in task_lower:
            if is_rain:
                task_impacts.append({
                    "task_name": task,
                    "status": "CAUTION",
                    "primary_hazard": "Water runoff saturates trench banks, increasing hydrostatic pressure and triggering potential sidewall sloughing or mud slide.",
                    "limiting_threshold": "Precipitation > 5 mm warrants trench reassessment.",
                    "mandatory_protocol": "Continuous trash pump dewatering, re-inspect soil benches, inspect trench boxes for shifting.",
                    "safe_alternative_task": "Equipment servicing in yard."
                })
                has_caution = True
            else:
                task_impacts.append({
                    "task_name": task,
                    "status": "GO",
                    "primary_hazard": "Soil cohesion stable under dry conditions.",
                    "limiting_threshold": "No water accumulation observed.",
                    "mandatory_protocol": "Daily competent person soil classification verification.",
                    "safe_alternative_task": None
                })
        else:
            task_impacts.append({
                "task_name": task,
                "status": "CAUTION" if (is_rain or is_high_wind) else "GO",
                "primary_hazard": "General inclement weather ambient hazards (slick footing, reduced visibility).",
                "limiting_threshold": "General job site conditions.",
                "mandatory_protocol": "Wear high-traction slip-resistant boots and maintain strict 3-point contact on ladders.",
                "safe_alternative_task": "Interior non-structural tasks."
            })

    if has_halt:
        site_status = "PARTIAL_STANDDOWN" if len(task_impacts) > 1 else "FULL_SITE_STOPPAGE"
        safety_index = 52
    elif has_caution:
        site_status = "CAUTIONARY_ADVISORY"
        safety_index = 78
    else:
        site_status = "NORMAL_OPERATIONS"
        safety_index = 96

    return {
        "overall_site_status": site_status,
        "site_safety_index": safety_index,
        "forecast_summary": f"Telemetry at {req.location}: Temperature {req.temperature_c}°C, Sustained Winds {req.wind_speed_kmh} km/h, Precipitation Probability {req.precipitation_prob_pct}%, Expected Moisture {req.precipitation_amount_mm} mm ({req.weather_condition}).",
        "task_impacts": task_impacts,
        "emergency_precautions": [
            "Tie down all loose lightweight building materials, insulation bundles, and plywood sheets.",
            "Verify all sump pumps on subterranean levels are energized with auxiliary generator backup.",
            "Inspect all exterior scaffolding ties and anchor points before next morning shift."
        ],
        "resumption_timeline": "Conditions projected to stabilize in approximately 4 to 6 hours as front passes eastward."
    }

@router.post("/evaluate", response_model=WeatherAdvisoryResponse)
async def evaluate_weather_risks(request: WeatherAdvisoryRequest):
    user_prompt = f"""
Evaluate active construction operations against real-time site weather conditions:
Job Site: {request.location}
Ambient Temperature: {request.temperature_c}°C
Wind Speed: {request.wind_speed_kmh} km/h
Precipitation Probability: {request.precipitation_prob_pct}% ({request.precipitation_amount_mm} mm)
Reported Condition: {request.weather_condition}
Active Construction Tasks: {", ".join(request.active_tasks)}

Designate GO, CAUTION, or HALT for each task with safety protocols and engineering thresholds.
"""

    def fallback():
        return generate_fallback_weather_advisory(request)

    result = await AIService.generate_multimodal_analysis(
        module_name="WeatherAdvisory",
        system_prompt=WEATHER_ADVISOR_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        fallback_generator=fallback
    )

    return WeatherAdvisoryResponse(**result)
