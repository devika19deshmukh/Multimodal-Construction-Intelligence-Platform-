"""
Knowledge Base & RAG service for construction codes, OSHA regulations, and engineering standards.
"""

from typing import List, Dict, Any

KNOWLEDGE_DOCUMENTS = [
    {
        "id": "osha-1926-501",
        "standard": "OSHA 29 CFR 1926.501",
        "title": "Duty to Have Fall Protection",
        "category": "OSHA Safety",
        "keywords": ["fall", "height", "guardrail", "harness", "tie-off", "hole", "roof", "edge", "scaffold"],
        "content": (
            "Each employee on a walking/working surface (horizontal and vertical surface) with an unprotected "
            "side or edge which is 6 feet (1.8 m) or more above a lower level shall be protected from falling by "
            "the use of guardrail systems, safety net systems, or personal fall arrest systems. Holes and skylights "
            "must be covered with covers capable of supporting twice the maximum intended load."
        ),
        "citation": "OSHA 1926.501(b)(1)"
    },
    {
        "id": "osha-1926-100",
        "standard": "OSHA 29 CFR 1926.100",
        "title": "Head Protection (Hard Hats)",
        "category": "OSHA Safety",
        "keywords": ["helmet", "hard hat", "head", "ppe", "impact", "falling object"],
        "content": (
            "Employees working in areas where there is a possible danger of head injury from impact, or from "
            "falling or flying objects, or from electrical shock and burns, shall be protected by protective helmets "
            "meeting ANSI Z89.1 standards. Type I helmets protect against top impact; Type II helmets protect against "
            "both top and lateral impact."
        ),
        "citation": "OSHA 1926.100(a)"
    },
    {
        "id": "osha-1926-651",
        "standard": "OSHA 29 CFR 1926.651 / 652",
        "title": "Specific Excavation Requirements & Shoring",
        "category": "OSHA Safety",
        "keywords": ["excavation", "trench", "cave-in", "soil", "shoring", "shield", "slope", "ingress", "ladder"],
        "content": (
            "Each employee in an excavation 5 feet (1.52 m) deep or deeper shall be protected from cave-ins by "
            "an adequate protective system (sloping, benching, shielding, or shoring) designed in accordance with "
            "soil classification (Type A, B, or C). Trenches 4 feet or more in depth must have a stairway, ladder, "
            "ramp or other safe means of egress located so as to require no more than 25 feet of lateral travel."
        ),
        "citation": "OSHA 1926.652(a)(1)"
    },
    {
        "id": "ibc-2024-chap10",
        "standard": "IBC 2024 Chapter 10",
        "title": "Means of Egress & Stairway Widths",
        "category": "International Building Code (IBC)",
        "keywords": ["egress", "door", "stairway", "corridor", "exit", "occupancy", "clearance", "width"],
        "content": (
            "The total width of means of egress in inches shall not be less than the total occupant load served by "
            "the means of egress multiplied by 0.3 inches per occupant for stairways and by 0.2 inches per occupant "
            "for other egress components. Minimum interior door clear opening width shall be not less than 32 inches."
        ),
        "citation": "IBC 2024 Section 1005.3.1"
    },
    {
        "id": "ibc-2024-chap16",
        "standard": "IBC 2024 Chapter 16",
        "title": "Structural Design, Wind, and Seismic Loads",
        "category": "International Building Code (IBC)",
        "keywords": ["structural", "load", "wind", "seismic", "dead load", "live load", "deflection", "concrete"],
        "content": (
            "Buildings, structures and all parts thereof shall be designed and constructed to support the safely "
            "factored loads without exceeding allowable stresses. Wind loads shall be calculated per ASCE 7. "
            "Special inspection is mandatory for cast-in-place structural concrete, continuous inspection for high-strength bolting."
        ),
        "citation": "IBC 2024 Section 1604 & 1705.3"
    },
    {
        "id": "aci-224r",
        "standard": "ACI 224R-01 & ACI 318-19",
        "title": "Control of Cracking in Concrete Structures",
        "category": "Standard Operating Procedures (SOP)",
        "keywords": ["crack", "concrete", "shrinkage", "shear", "tolerable width", "beam", "water-cement", "epoxy"],
        "content": (
            "Tolerable crack widths for reinforced concrete under service loads: Dry air or protective membrane: 0.41 mm (0.016 in); "
            "Humid air, soil, or deicing chemicals: 0.18 mm - 0.30 mm. Cracks wider than 0.3 mm on exposed structural elements "
            "require investigation. Diagonal cracks at 45 degrees near beam supports indicate shear distress requiring immediate shoring."
        ),
        "citation": "ACI 224R-01 Table 4.1"
    },
    {
        "id": "zoning-setbacks",
        "standard": "Municipal Land Development Code § 25-2",
        "title": "Zoning Setbacks, Height Limits, and FAR",
        "category": "Local Zoning & Permits",
        "keywords": ["zoning", "setback", "far", "floor area ratio", "height", "parking", "easement", "buffer"],
        "content": (
            "Principal structures must respect minimum yard setbacks: Front 25 feet, Rear 20 feet, Interior Sides 10 feet. "
            "Maximum Floor Area Ratio (FAR) for downtown mixed-use core is 8.0:1, with allowable bonus up to 12.0:1 for "
            "LEED Gold certification and affordable housing contributions. Construction noise restricted to 7:00 AM - 6:00 PM."
        ),
        "citation": "Land Dev Code § 25-2-492"
    }
]

def search_compliance_documents(query: str, category: str = None, top_k: int = 3) -> List[Dict[str, Any]]:
    """Retrieves relevant compliance documents based on lexical keyword matching and category filters."""
    query_tokens = set(query.lower().split())
    ranked_docs = []
    
    for doc in KNOWLEDGE_DOCUMENTS:
        if category and category.lower() not in doc["category"].lower() and doc["category"].lower() not in category.lower():
            # If category is provided and doesn't match, give lower priority unless query specifically mentions it
            pass
            
        score = 0
        doc_tokens = set(doc["content"].lower().split()) | set(doc["keywords"]) | set(doc["title"].lower().split())
        overlap = query_tokens.intersection(doc_tokens)
        score += len(overlap) * 2
        
        for kw in doc["keywords"]:
            if kw in query.lower():
                score += 3
                
        if score > 0 or not query.strip():
            ranked_docs.append((score, doc))
            
    ranked_docs.sort(key=lambda x: x[0], reverse=True)
    if not ranked_docs:
        return [doc for doc in KNOWLEDGE_DOCUMENTS[:top_k]]
        
    return [item[1] for item in ranked_docs[:top_k]]
