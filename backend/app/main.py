from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings, update_runtime_api_keys
from app.models.schemas import ApiKeyConfigRequest, HealthResponse
from app.routes.assistant import router as assistant_router
from app.routes.safety import router as safety_router
from app.routes.structural import router as structural_router
from app.routes.planning import router as planning_router
from app.routes.weather import router as weather_router
from app.routes.valuation import router as valuation_router
from app.routes.compliance import router as compliance_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Multimodal AI-Powered Construction Intelligence Platform: Safety, Structural Analysis, Planning, Weather, Valuation & Compliance",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Module Routers
app.include_router(assistant_router, prefix=settings.API_PREFIX)
app.include_router(safety_router, prefix=settings.API_PREFIX)
app.include_router(structural_router, prefix=settings.API_PREFIX)
app.include_router(planning_router, prefix=settings.API_PREFIX)
app.include_router(weather_router, prefix=settings.API_PREFIX)
app.include_router(valuation_router, prefix=settings.API_PREFIX)
app.include_router(compliance_router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "status": "Operational",
        "modules": [
            "Dashboard & Daily Site Assistant",
            "Safety Monitoring & PPE Hazard Detection",
            "Crack Detection & Forensic Structural Analysis",
            "Construction Project Planning & CPM Scheduling",
            "Weather-Aware Meteorological Advisory",
            "Predictive Real Estate Valuation",
            "Knowledge Base & Regulatory Compliance (RAG)"
        ]
    }

@app.get(f"{settings.API_PREFIX}/health", response_model=HealthResponse)
def get_system_health():
    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        active_provider=settings.AI_PROVIDER,
        gemini_configured=bool(settings.GEMINI_API_KEY),
        openai_configured=bool(settings.OPENAI_API_KEY)
    )

@app.post(f"{settings.API_PREFIX}/config/keys")
def update_api_credentials(payload: ApiKeyConfigRequest):
    update_runtime_api_keys(
        gemini_key=payload.gemini_api_key,
        openai_key=payload.openai_api_key,
        provider=payload.ai_provider
    )
    return {
        "message": "API configuration updated successfully",
        "active_provider": settings.AI_PROVIDER,
        "gemini_configured": bool(settings.GEMINI_API_KEY),
        "openai_configured": bool(settings.OPENAI_API_KEY)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
