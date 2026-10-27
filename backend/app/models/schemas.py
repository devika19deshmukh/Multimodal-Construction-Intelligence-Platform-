from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# ==========================================
# 1. Dashboard & Daily Site Assistant Models
# ==========================================

class DailyAssistantRequest(BaseModel):
    query: str = Field(..., description="User's query or description of the daily site status")
    project_name: Optional[str] = Field("Skyline Tower Phase II", description="Active project name")
    user_role: Optional[str] = Field("Site Superintendent", description="Role of the user")
    active_phase: Optional[str] = Field("Structural Framing & Concrete Pouring", description="Current project phase")

class DailyAssistantResponse(BaseModel):
    summary: str = Field(..., description="Executive summary of the day's site operations")
    daily_activities: List[str] = Field(default_factory=list, description="Key activities logged or inferred")
    critical_alerts: List[str] = Field(default_factory=list, description="Immediate issues requiring attention")
    recommendations: List[str] = Field(default_factory=list, description="Proactive operational recommendations")
    estimated_progress_delta_pct: float = Field(0.0, description="Estimated daily progress change percentage")
    safety_highlights: List[str] = Field(default_factory=list, description="Safety reminders or highlights")
    raw_ai_notes: Optional[str] = Field(None, description="Detailed reasoning and analysis from multimodal LLM")
    timestamp: str = Field(..., description="Timestamp of generation")


# ==========================================
# 2. Safety Monitoring & Hazard Detection Models
# ==========================================

class BoundingBox2D(BaseModel):
    ymin: float = Field(..., description="Top coordinate (0-1000 scale or percentage)")
    xmin: float = Field(..., description="Left coordinate (0-1000 scale or percentage)")
    ymax: float = Field(..., description="Bottom coordinate (0-1000 scale or percentage)")
    xmax: float = Field(..., description="Right coordinate (0-1000 scale or percentage)")

class SafetyDetectionBox(BaseModel):
    id: str = Field(..., description="Unique detection identifier")
    label: str = Field(..., description="Detection label, e.g. 'Missing Hard Hat', 'High-Vis Vest Detected', 'Unsecured Edge'")
    category: str = Field(..., description="Category: 'ppe_violation', 'ppe_compliant', 'fall_hazard', 'trip_hazard', 'machinery_danger'")
    confidence: float = Field(..., description="Confidence score 0.0 - 1.0")
    box_2d: BoundingBox2D = Field(..., description="Normalized coordinates of the detected object")
    risk_level: str = Field(..., description="Risk tier: 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'")
    description: str = Field(..., description="Observation notes on the detection")
    remediation: str = Field(..., description="Immediate corrective protocol")

class SafetyAuditResponse(BaseModel):
    overall_safety_score: int = Field(..., description="Safety index score from 0 to 100")
    compliance_status: str = Field(..., description="'COMPLIANT', 'MINOR_INFRACTIONS', 'HIGH_RISK', 'STOP_WORK_RECOMMENDED'")
    violation_count: int = Field(0, description="Number of active safety violations")
    compliant_elements_count: int = Field(0, description="Number of observed compliant safety elements")
    detections: List[SafetyDetectionBox] = Field(default_factory=list, description="Identified objects and hazards with bounding coordinates")
    immediate_corrective_actions: List[str] = Field(default_factory=list, description="Top immediate actions required on site")
    osha_references: List[str] = Field(default_factory=list, description="Relevant OSHA standards (e.g. 1926.100, 1926.501)")
    supervisor_signoff_required: bool = Field(False, description="Flag indicating if site supervisor signoff is mandatory before proceeding")
    summary: str = Field(..., description="Detailed safety assessment narrative")


# ==========================================
# 3. Crack Detection & Structural Analysis Models
# ==========================================

class CrackAnalysisResponse(BaseModel):
    crack_detected: bool = Field(..., description="True if cracks or structural fractures were identified")
    crack_type: str = Field(..., description="'Hairline Shrinkage', 'Structural Shear', 'Settlement Differential', 'Thermal Expansion', 'Corrosion Spalling', 'Flexural Tension', 'None Detected'")
    estimated_width_mm: float = Field(..., description="Estimated crack aperture width in millimeters")
    estimated_length_cm: float = Field(..., description="Estimated crack length in centimeters")
    structural_element: str = Field(..., description="'Reinforced Concrete Beam', 'Load-Bearing Column', 'Foundation Footing', 'Slab', 'Retaining Wall', 'Masonry Shear Wall'")
    severity: str = Field(..., description="'Negligible (Cosmetic)', 'Minor', 'Moderate (Requires Monitoring)', 'Severe', 'Critical (Structural Threat)'")
    structural_risk_level: str = Field(..., description="'LOW', 'MEDIUM', 'HIGH', 'IMMINENT_COLLAPSE_RISK'")
    probable_causes: List[str] = Field(default_factory=list, description="Root mechanical or environmental causes identified")
    immediate_mitigation_steps: List[str] = Field(default_factory=list, description="Emergency or immediate mitigation protocols")
    long_term_remediation: List[str] = Field(default_factory=list, description="Engineered long-term repair specifications")
    requires_licensed_pe_inspection: bool = Field(True, description="Whether an on-site Professional Engineer (PE) inspection is mandated")
    urgency_timeframe: str = Field(..., description="'Routine Scheduled Maintenance', 'Within 14 Days', 'Within 48 Hours', 'IMMEDIATE EVACUATION & SHORING'")
    detailed_assessment: str = Field(..., description="In-depth forensic engineering breakdown")


# ==========================================
# 4. Construction Project Planning Models
# ==========================================

class ProjectPlanRequest(BaseModel):
    project_name: str = Field(..., description="Name of the construction development")
    building_type: str = Field("Commercial Office Tower", description="Category: Commercial, Residential, Industrial, Infrastructure, Mixed-Use")
    total_sqft: float = Field(50000.0, description="Total gross floor area in square feet")
    budget_usd: float = Field(12000000.0, description="Total allocated project budget in USD")
    target_duration_months: int = Field(18, description="Target completion timeline in months")
    location: str = Field("Austin, TX", description="Site geographic location")
    soil_condition: Optional[str] = Field("Clay & Limestone Bedrock", description="Geotechnical baseline")
    project_scope: Optional[str] = Field("Substructure foundation, 8-story steel-reinforced concrete frame, curtain wall envelope, MEP fit-out", description="Scope overview")

class ProjectPhase(BaseModel):
    phase_id: str = Field(..., description="e.g. P1, P2")
    phase_name: str = Field(..., description="e.g. Substructure & Deep Foundations")
    start_month: float = Field(..., description="Starting month index")
    end_month: float = Field(..., description="Completion month index")
    duration_weeks: int = Field(..., description="Duration in weeks")
    estimated_cost_usd: float = Field(..., description="Allocated cost for this phase")
    labor_headcount: int = Field(..., description="Peak labor workforce required")
    equipment_needed: List[str] = Field(default_factory=list, description="Primary machinery e.g. Tower Crane, Piling Rig")
    key_milestones: List[str] = Field(default_factory=list, description="Critical deliverable milestones")
    risk_level: str = Field("MEDIUM", description="'LOW', 'MEDIUM', 'HIGH'")
    dependencies: List[str] = Field(default_factory=list, description="Prerequisite phases")

class ResourceAllocation(BaseModel):
    category: str = Field(..., description="'Labor Trade', 'Heavy Machinery', 'Core Materials'")
    resource_name: str = Field(..., description="e.g. Structural Ironworkers, Tower Crane 50T, Grade 60 Rebar")
    quantity: float = Field(..., description="Required quantity")
    unit: str = Field(..., description="Unit of measure: workers, units, metric tons, cubic yards")
    peak_phase: str = Field(..., description="Phase requiring highest concentration")
    estimated_cost_usd: float = Field(..., description="Projected expenditure")

class RiskMitigation(BaseModel):
    risk_title: str = Field(..., description="Identified project risk")
    severity: str = Field(..., description="'Low', 'Medium', 'High', 'Critical'")
    probability: str = Field(..., description="'Low', 'Medium', 'High'")
    mitigation_strategy: str = Field(..., description="Proactive contingency procedure")

class ProjectPlanResponse(BaseModel):
    project_name: str = Field(..., description="Project title")
    total_estimated_cost_usd: float = Field(..., description="Total cost estimate from AI schedule modeling")
    budget_variance_pct: float = Field(..., description="Variance against target budget (+/- %)")
    feasibility_score: int = Field(..., description="Overall schedule & budget realism index (0-100)")
    duration_months: int = Field(..., description="Computed duration in months")
    critical_path: List[str] = Field(default_factory=list, description="Critical path task sequence")
    phases: List[ProjectPhase] = Field(default_factory=list, description="Detailed project phase schedule")
    resource_allocations: List[ResourceAllocation] = Field(default_factory=list, description="Resource demand forecast")
    risk_matrix: List[RiskMitigation] = Field(default_factory=list, description="Project risk contingencies")
    executive_summary: str = Field(..., description="Strategic executive narrative")


# ==========================================
# 5. Weather-Aware Advisory Models
# ==========================================

class WeatherAdvisoryRequest(BaseModel):
    location: str = Field("Dallas-Fort Worth Site #4", description="Job site location")
    temperature_c: float = Field(34.5, description="Ambient temperature in Celsius")
    wind_speed_kmh: float = Field(42.0, description="Wind speed in km/h")
    precipitation_prob_pct: int = Field(75, description="Chance of precipitation 0-100%")
    precipitation_amount_mm: float = Field(12.5, description="Expected rainfall in mm")
    weather_condition: str = Field("Thunderstorm & High Winds", description="Condition summary")
    active_tasks: List[str] = Field(
        default=["Tower Crane Heavy Lifts", "Structural Concrete Pouring (Level 4)", "Exterior Curtain Wall Glazing", "Trench Excavation", "Electrical Rough-in"],
        description="Tasks planned or currently underway on site"
    )

class TaskWeatherImpact(BaseModel):
    task_name: str = Field(..., description="Name of the construction activity")
    status: str = Field(..., description="'GO' (Safe to proceed), 'CAUTION' (Proceed with strict controls), 'HALT' (Mandatory stoppage)")
    primary_hazard: str = Field(..., description="Specific physical risk posed by weather")
    limiting_threshold: str = Field(..., description="e.g. Max Crane Wind Limit 38 km/h, Concrete Max Temp 35°C")
    mandatory_protocol: str = Field(..., description="Required on-site protocol")
    safe_alternative_task: Optional[str] = Field(None, description="Indoor or safe secondary task to reassign crews")

class WeatherAdvisoryResponse(BaseModel):
    overall_site_status: str = Field(..., description="'NORMAL_OPERATIONS', 'CAUTIONARY_ADVISORY', 'PARTIAL_STANDDOWN', 'FULL_SITE_STOPPAGE'")
    site_safety_index: int = Field(..., description="Weather safety rating 0-100")
    forecast_summary: str = Field(..., description="Meteorological analysis for the site")
    task_impacts: List[TaskWeatherImpact] = Field(default_factory=list, description="Granular task-by-task weather clearance decisions")
    emergency_precautions: List[str] = Field(default_factory=list, description="Precautionary site tie-down or drainage measures")
    resumption_timeline: str = Field(..., description="Estimated safe restart window")


# ==========================================
# 6. Real Estate Valuation Models
# ==========================================

class ValuationRequest(BaseModel):
    property_type: str = Field("Mixed-Use Commercial & Residential", description="Asset type")
    location_tier: str = Field("Tier 1 Urban Core (Austin Downtown)", description="Market location tier")
    total_sqft: float = Field(45000.0, description="Gross building area")
    plot_size_sqft: float = Field(18000.0, description="Land parcel size")
    floors: int = Field(7, description="Number of stories")
    construction_quality: str = Field("Premium Architectural Grade", description="'Standard', 'Premium Architectural Grade', 'Ultra Luxury LEED Gold'")
    completion_status_pct: float = Field(65.0, description="Current construction completion percentage")
    year_built: int = Field(2026, description="Year of delivery")
    amenities: List[str] = Field(default=["Rooftop Terrace", "EV Charging Hub", "Smart HVAC", "Subterranean Parking"], description="Key asset amenities")
    expected_rental_yield_pct: float = Field(6.8, description="Target cap rate / rental yield")

class ValuationResponse(BaseModel):
    estimated_current_value_usd: float = Field(..., description="As-is current market value")
    estimated_at_completion_value_usd: float = Field(..., description="Gross development value at 100% completion")
    price_per_sqft_usd: float = Field(..., description="Current price per square foot")
    projected_5yr_value_usd: float = Field(..., description="Forecasted 5-year appreciation valuation")
    projected_annual_growth_pct: float = Field(..., description="Projected compound annual growth rate (CAGR)")
    cap_rate_pct: float = Field(..., description="Calculated capitalization rate")
    confidence_score: float = Field(..., description="Valuation confidence level (0.0 to 1.0)")
    valuation_breakdown: Dict[str, float] = Field(default_factory=dict, description="Component value breakdown (Land, Hard Costs, Finishes, Location Premium)")
    comparable_benchmarks: List[Dict[str, Any]] = Field(default_factory=list, description="Recent market comp indicators")
    investment_grade: str = Field(..., description="'AAA (Prime Institutional)', 'AA (Strong Commercial)', 'A (Solid Return)', 'BBB (Speculative)'")
    market_sentiment: str = Field(..., description="Macroeconomic commentary on absorption and demand")


# ==========================================
# 7. Knowledge Base & Compliance Models
# ==========================

class ComplianceQueryRequest(BaseModel):
    query: str = Field(..., description="Natural language question regarding codes, safety, zoning, or standards")
    regulatory_domain: str = Field("OSHA 1926 & IBC 2024", description="'OSHA Safety', 'International Building Code (IBC)', 'Local Zoning & Permits', 'Standard Operating Procedures (SOP)'")
    specific_clause: Optional[str] = Field(None, description="Optional specific code reference if known")

class CodeCitation(BaseModel):
    standard: str = Field(..., description="e.g. OSHA 29 CFR 1926.501 or IBC Section 1004")
    section_title: str = Field(..., description="Title of the section")
    relevance: str = Field(..., description="How this section applies to the query")
    mandatory_rule: str = Field(..., description="Clear statutory requirement")

class ComplianceChecklistItem(BaseModel):
    requirement: str = Field(..., description="Verifiable requirement")
    compliance_status: str = Field(..., description="'MANDATORY_COMPLIANCE', 'RECOMMENDED_BEST_PRACTICE', 'ACTION_REQUIRED'")
    inspection_method: str = Field(..., description="How to verify on site")

class ComplianceQueryResponse(BaseModel):
    answer: str = Field(..., description="Direct, authoritative regulatory analysis")
    citations: List[CodeCitation] = Field(default_factory=list, description="Authoritative statutory citations")
    compliance_checklist: List[ComplianceChecklistItem] = Field(default_factory=list, description="Step-by-step compliance checklist")
    risk_if_non_compliant: str = Field(..., description="Legal, financial, or safety penalties for violation")
    recommended_documentation: List[str] = Field(default_factory=list, description="Records, permits, or inspection logs to archive")


# ==========================================
# System & Key Config Models
# ==========================================

class ApiKeyConfigRequest(BaseModel):
    gemini_api_key: Optional[str] = None
    openai_api_key: Optional[str] = None
    ai_provider: Optional[str] = "auto"

class HealthResponse(BaseModel):
    status: str
    version: str
    active_provider: str
    gemini_configured: bool
    openai_configured: bool
