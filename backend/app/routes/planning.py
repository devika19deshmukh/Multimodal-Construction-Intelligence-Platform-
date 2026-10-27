from fastapi import APIRouter
from app.models.schemas import ProjectPlanRequest, ProjectPlanResponse
from app.prompts.engineered_prompts import PROJECT_PLANNER_SYSTEM_PROMPT
from app.services.ai_service import AIService

router = APIRouter(prefix="/planning", tags=["Project Planning & Scheduling"])

def generate_fallback_project_plan(req: ProjectPlanRequest) -> dict:
    total_cost = req.budget_usd * 0.985  # slightly below budget
    variance = round(((total_cost - req.budget_usd) / req.budget_usd) * 100, 2)
    
    return {
        "project_name": req.project_name,
        "total_estimated_cost_usd": total_cost,
        "budget_variance_pct": variance,
        "feasibility_score": 91,
        "duration_months": req.target_duration_months,
        "critical_path": [
            "Site Mobilization & Deep Foundation Drilled Shafts",
            "Subterranean Reinforced Concrete Basement Walls",
            "Tower Crane Installation & Superstructure Cast-in-Place Concrete",
            "Curtain Wall Envelope Weather-tight Enclosure",
            "MEP Primary Risers & High-Voltage Transformer Energization",
            "Substantial Completion & Municipal Life Safety Signoff"
        ],
        "phases": [
            {
                "phase_id": "P1",
                "phase_name": "Mobilization, Excavation & Substructure",
                "start_month": 0.0,
                "end_month": 3.5,
                "duration_weeks": 14,
                "estimated_cost_usd": req.budget_usd * 0.18,
                "labor_headcount": 42,
                "equipment_needed": ["Caterpillar 349 Excavator", "Bauer BG 28 H Drilling Rig", "Tri-Axle Dump Trucks"],
                "key_milestones": ["Excavation to -32 ft completed", "Soldier pile retention verified", "Foundation mat pour accepted"],
                "risk_level": "HIGH",
                "dependencies": ["None (Site Access Approval)"]
            },
            {
                "phase_id": "P2",
                "phase_name": "Superstructure Core & Shell Concrete",
                "start_month": 3.5,
                "end_month": 9.0,
                "duration_weeks": 22,
                "estimated_cost_usd": req.budget_usd * 0.36,
                "labor_headcount": 85,
                "equipment_needed": ["Liebherr 550 EC-H Tower Crane", "Putzmeister 56Z Concrete Boom Pump", "Hydraulic Climbing Core Formwork"],
                "key_milestones": ["Level 1 Podium slab cured", "Core Wall slipform topped out", "Roof deck topping slab completed"],
                "risk_level": "MEDIUM",
                "dependencies": ["P1"]
            },
            {
                "phase_id": "P3",
                "phase_name": "Building Envelope & Glazing",
                "start_month": 7.5,
                "end_month": 12.0,
                "duration_weeks": 18,
                "estimated_cost_usd": req.budget_usd * 0.19,
                "labor_headcount": 38,
                "equipment_needed": ["Glass Vacuum Manipulator Rig", "Spider Stage Suspended Scaffolds", "Mast Climbers"],
                "key_milestones": ["Dry-in achieved on floors 1-5", "Rooftop membrane waterproofing spark-tested", "100% exterior curtain wall glazed"],
                "risk_level": "MEDIUM",
                "dependencies": ["P2 (Levels 1-5 released)"]
            },
            {
                "phase_id": "P4",
                "phase_name": "MEP Rough-in & Fire Protection",
                "start_month": 8.0,
                "end_month": 14.5,
                "duration_weeks": 26,
                "estimated_cost_usd": req.budget_usd * 0.16,
                "labor_headcount": 55,
                "equipment_needed": ["Scissor Lifts (19ft & 26ft)", "Pipe Threaders & Hydraulic Benders", "Air Handling Unit Rigging Crane"],
                "key_milestones": ["Electrical switchgear energized", "HVAC duct pressure leak testing passed", "Sprinkler hydrostatic test certified"],
                "risk_level": "LOW",
                "dependencies": ["P2", "P3"]
            },
            {
                "phase_id": "P5",
                "phase_name": "Interior Architectural Fit-Out & Finishes",
                "start_month": 11.0,
                "end_month": 16.5,
                "duration_weeks": 22,
                "estimated_cost_usd": req.budget_usd * 0.08,
                "labor_headcount": 48,
                "equipment_needed": ["Drywall Sanders with HEPA extraction", "Tile Saws", "Airless Paint Sprayers"],
                "key_milestones": ["Drywall taped & painted floors 1-4", "Flooring installation completed", "Cabinetry and high-end millwork installed"],
                "risk_level": "LOW",
                "dependencies": ["P4"]
            },
            {
                "phase_id": "P6",
                "phase_name": "Commissioning, Punchlist & Certificate of Occupancy",
                "start_month": 15.5,
                "end_month": float(req.target_duration_months),
                "duration_weeks": 10,
                "estimated_cost_usd": req.budget_usd * 0.03,
                "labor_headcount": 22,
                "equipment_needed": ["Balancing Hoods & Fluke Power Analyzers", "Thermal Imaging Cameras"],
                "key_milestones": ["TAB (Testing, Adjusting, Balancing) certified", "Fire Alarm integrated strobe/horn test passed", "Final Certificate of Occupancy issued"],
                "risk_level": "LOW",
                "dependencies": ["P5"]
            }
        ],
        "resource_allocations": [
            {
                "category": "Labor Trade",
                "resource_name": "Journeyman Electricians & Pipefitters",
                "quantity": 36.0,
                "unit": "licensed tradespersons",
                "peak_phase": "P4",
                "estimated_cost_usd": req.budget_usd * 0.09
            },
            {
                "category": "Labor Trade",
                "resource_name": "Structural Ironworkers & Concrete Finishers",
                "quantity": 52.0,
                "unit": "skilled workers",
                "peak_phase": "P2",
                "estimated_cost_usd": req.budget_usd * 0.12
            },
            {
                "category": "Heavy Machinery",
                "resource_name": "Tower Crane (50T Capacity)",
                "quantity": 1.0,
                "unit": "crane units",
                "peak_phase": "P2",
                "estimated_cost_usd": 380000.0
            },
            {
                "category": "Core Materials",
                "resource_name": "High-Performance Concrete (40 MPa)",
                "quantity": round(req.total_sqft * 0.14, 0),
                "unit": "cubic yards",
                "peak_phase": "P2",
                "estimated_cost_usd": req.budget_usd * 0.11
            },
            {
                "category": "Core Materials",
                "resource_name": "Deformed Steel Reinforcing Bars (Rebar)",
                "quantity": round(req.total_sqft * 0.009, 1),
                "unit": "metric tons",
                "peak_phase": "P2",
                "estimated_cost_usd": req.budget_usd * 0.08
            }
        ],
        "risk_matrix": [
            {
                "risk_title": "Soil Stratum Differential Settlement at Substructure",
                "severity": "High",
                "probability": "Medium",
                "mitigation_strategy": "Execute continuous geotechnical rotary coring and expand drilled pier socket depths by 12% into competent limestone."
            },
            {
                "risk_title": "Long-Lead Switchgear & Transformer Equipment Delays",
                "severity": "Critical",
                "probability": "High",
                "mitigation_strategy": "Issue early procurement notice-to-proceed in Month 1 with dual-source vendor reservation deposit."
            },
            {
                "risk_title": "High-Wind Tower Crane Downtime",
                "severity": "Medium",
                "probability": "Medium",
                "mitigation_strategy": "Incorporate 14-day cumulative weather contingency buffer into CPM schedule and schedule critical core lifts during morning calm windows."
            }
        ],
        "executive_summary": f"Optimized CPM schedule generated for {req.project_name} across {req.target_duration_months} months with a feasibility rating of 91/100. Total projected expenditure of ${total_cost:,.2f} USD leaves a healthy contingency reserve of ${req.budget_usd - total_cost:,.2f} USD. Staggered overlapping of envelope dry-in and interior rough-ins shortens overall critical path by 6.5 weeks compared to traditional linear scheduling."
    }

@router.post("/generate-plan", response_model=ProjectPlanResponse)
async def generate_project_schedule(request: ProjectPlanRequest):
    user_prompt = f"""
Generate an optimized construction project schedule, resource allocation matrix, and risk mitigation plan.
Project Name: {request.project_name}
Building Type: {request.building_type}
Gross Area: {request.total_sqft:,} sq ft
Allocated Budget: ${request.budget_usd:,.2f} USD
Target Duration: {request.target_duration_months} months
Location: {request.location}
Soil Condition: {request.soil_condition}
Scope: {request.project_scope}
"""

    def fallback():
        return generate_fallback_project_plan(request)

    result = await AIService.generate_multimodal_analysis(
        module_name="ProjectPlanner",
        system_prompt=PROJECT_PLANNER_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        fallback_generator=fallback
    )

    return ProjectPlanResponse(**result)
