from fastapi import APIRouter
from app.models.schemas import ComplianceQueryRequest, ComplianceQueryResponse, CodeCitation, ComplianceChecklistItem
from app.prompts.engineered_prompts import COMPLIANCE_OFFICER_SYSTEM_PROMPT
from app.services.ai_service import AIService
from app.services.rag_service import search_compliance_documents

router = APIRouter(prefix="/compliance", tags=["Knowledge Base & Compliance"])

def generate_fallback_compliance_response(query: str, retrieved_docs: list) -> dict:
    primary_doc = retrieved_docs[0] if retrieved_docs else None
    
    return {
        "answer": (
            f"Under construction regulatory standards ({primary_doc['standard'] if primary_doc else 'OSHA 1926 & IBC 2024'}), "
            f"employers and general contractors are mandated to maintain rigorous compliance for '{query}'. "
            + (primary_doc['content'] if primary_doc else "All elevated work above 6 feet requires compliant guardrail or personal fall arrest systems with daily certified inspections.")
        ),
        "citations": [
            {
                "standard": doc["standard"],
                "section_title": doc["title"],
                "relevance": f"Directly governs the standard of care for site operations concerning {doc['category']}.",
                "mandatory_rule": doc["content"][:240] + "..."
            }
            for doc in retrieved_docs[:2]
        ],
        "compliance_checklist": [
            {
                "requirement": "Pre-shift inspection of safety perimeter cables and anchorages.",
                "compliance_status": "MANDATORY_COMPLIANCE",
                "inspection_method": "Visual torque verification and physical tension test with signed logbook entry."
            },
            {
                "requirement": "Certified Competent Person designated on site during hazardous activities.",
                "compliance_status": "MANDATORY_COMPLIANCE",
                "inspection_method": "Verify OSHA 30-Hour card or equivalent professional accreditation on file."
            },
            {
                "requirement": "Daily toolbox talk documented with all subcontractor signatures.",
                "compliance_status": "ACTION_REQUIRED",
                "inspection_method": "Archive digital sign-in roster within site management portal."
            }
        ],
        "risk_if_non_compliant": "OSHA serious violations carry statutory civil penalties up to $16,131 per violation, escalating to $161,323 for willful or repeated non-compliance, alongside immediate Stop-Work Orders and general contractor liability exposure.",
        "recommended_documentation": [
            "Site-Specific Safety Plan (SSSP) signed by Project Executive",
            "Job Hazard Analysis (JHA / JSA) form for each active subcontractor",
            "Manufacturer certification sheets for fall arrest lanyards and anchor points"
        ]
    }

@router.post("/query", response_model=ComplianceQueryResponse)
async def query_compliance_assistant(request: ComplianceQueryRequest):
    # Retrieve relevant RAG context documents
    retrieved_docs = search_compliance_documents(request.query, category=request.regulatory_domain, top_k=3)
    
    context_str = "\n\n".join([
        f"--- {doc['standard']}: {doc['title']} ---\n{doc['content']}\nCitation: {doc['citation']}"
        for doc in retrieved_docs
    ])

    user_prompt = f"""
Inquiry: {request.query}
Regulatory Domain Selected: {request.regulatory_domain}
Specific Clause Filter: {request.specific_clause or 'None'}

RETRIEVED KNOWLEDGE BASE CONTEXT:
{context_str}

Evaluate the user query using the above statutory authority. Provide direct answers, precise citations, a compliance checklist, and risk penalties.
"""

    def fallback():
        return generate_fallback_compliance_response(request.query, retrieved_docs)

    result = await AIService.generate_multimodal_analysis(
        module_name="ComplianceAssistant",
        system_prompt=COMPLIANCE_OFFICER_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        fallback_generator=fallback
    )

    return ComplianceQueryResponse(**result)
