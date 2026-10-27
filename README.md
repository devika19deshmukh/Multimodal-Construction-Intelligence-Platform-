# ConstructIQ — AI-Powered Multimodal Construction Intelligence Platform

**ConstructIQ** is a full-stack, enterprise-grade decision-support platform designed for construction planning, execution, safety monitoring, structural health assessment, and predictive real estate analytics. Built with **React 19**, **FastAPI**, and an **Engineered Multimodal AI Architecture** (supporting **Google Gemini 1.5 Pro / Flash**, **OpenAI GPT-4o**, and an offline high-fidelity domain engineering simulator).

---

## 🌟 Key Modules & Core Capabilities

### 1. 🏗️ Dashboard & Daily Site Assistant
- **Multimodal Site Chat**: Field engineers and superintendents can submit natural language inquiries paired with daily site photographs.
- **Automated Operational Briefings**: Synthesizes daily task logs, material deliveries, progress delta calculations, and critical alerts.
- **Forensic AI Reasoning**: Correlates visual evidence with CPM schedules to detect bottlenecks early.

### 2. 🦺 Safety Monitoring & Hazard Detection
- **Computer Vision PPE Audit**: Detects missing helmets (OSHA 1926.100), high-visibility vests (ANSI/ISEA 107), safety footwear, and harnesses.
- **Spatial 2D Bounding Boxes**: Normalized coordinates mapped onto uploaded photos with color-coded risk tiers (*Critical*, *High*, *Medium*, *Compliant*).
- **Hazard Zone Localization**: Identifies unprotected leading edges, unbarricaded floor openings, and electrical trip hazards.
- **Supervisor Certification**: Field verification and electronic sign-off workflow.

### 3. 🔍 Crack Detection & Structural Health Analysis
- **Forensic Fracture Diagnosis**: Classifies crack morphology (45° diagonal shear, vertical flexural tension, shrinkage, differential settlement).
- **Aperture & Risk Gauge**: Compares crack width in millimeters against ACI 224R tolerable limits.
- **Remediation Protocols**: Recommends emergency shoring posts, structural epoxy pressure injection, and carbon fiber (CFRP) wrapping specifications.
- **PE Sign-off Trigger**: Mandates licensed Professional Engineer on-site inspection when critical shear limits are exceeded.

### 4. 📅 Project CPM Planning & Scheduling
- **Critical Path Method (CPM) Generator**: Computes duration, phased milestone sequences, and float-free critical paths.
- **Interactive Gantt Timeline**: Visual phase progress bars, milestone flags, and risk assessments.
- **Resource Allocation Matrix**: Predicts peak workforce headcount across licensed trades, heavy machinery (tower cranes, boom pumps), and core materials.
- **Contingency Risk Matrix**: Quantifies probability, severity, and proactive risk mitigations.

### 5. ⛅ Weather-Aware Risk Advisory
- **Meteorological Telemetry Station**: Evaluates ambient temperature, sustained wind speed, rainfall probability, and lightning threat.
- **Dynamic Task Clearance**: Real-time **GO**, **CAUTION**, or **HALT** directives based on engineering thresholds (e.g. crane wind stops at 38 km/h, concrete rain dilution limits, trench soil hydrostatic pressure).
- **Safe Task Reassignments**: Reallocates stranded crews to sheltered interior or maintenance activities.

### 6. 🏢 Predictive Real Estate Valuation
- **Multimodal Appraisal Engine**: Models current As-Is market value vs Completed Gross Development Value (GDV).
- **5-Year Growth Trajectory**: Forecasts capital appreciation, IRR, and capitalization rates (Cap Rate).
- **Disaggregated Cost Breakdown**: Separates land parcel basis, superstructure hard costs, finishes, and amenities.
- **Comparable Market Sales (Comps)**: Benchmarks recent local transactions with similarity indices.

### 7. ⚖️ Knowledge Base & Compliance Assistant (RAG)
- **Indexed Regulatory Corpus**: Pre-loaded with OSHA 29 CFR 1926, International Building Code (IBC 2024), ACI standards, and Municipal Zoning Codes.
- **Statutory Citations**: Returns exact legal sections, authority numbers, and mandatory rule texts.
- **Field Inspection Checklists**: Actionable verification steps paired with civil penalty liability warnings (up to $161,323 per willful citation).

---

## 🛠️ Architecture & Tech Stack

```
Skillwallet/
├── backend/                        # FastAPI Backend
│   ├── app/
│   │   ├── main.py                 # Application entrypoint & CORS middleware
│   │   ├── config.py               # Settings & dynamic runtime API key updating
│   │   ├── models/schemas.py       # Strict Pydantic models for all 7 modules
│   │   ├── prompts/
│   │   │   └── engineered_prompts.py # Tailored system prompts enforcing strict JSON
│   │   ├── services/
│   │   │   ├── ai_service.py       # Gemini 1.5 Pro / GPT-4o / Simulation fallback
│   │   │   └── rag_service.py      # Indexed codes & lexical/semantic document search
│   │   ├── routes/                 # 7 RESTful API modules
│   │   └── utils/image_utils.py    # Resizing, MIME handling, base64 encoding
│   ├── requirements.txt
│   ├── .env.example
│   └── run.py
│
├── frontend/                       # React 19 + Tailwind CSS + Vite
│   ├── src/
│   │   ├── App.jsx                 # Sidebar routing & global layout
│   │   ├── api/                    # API client & module service methods
│   │   ├── components/
│   │   │   ├── layout/             # Sidebar, Header, Live Clock
│   │   │   ├── common/             # BoundingBoxCanvas, ImageUploader, MetricCard
│   │   │   ├── dashboard/          # Daily Assistant chat & briefings
│   │   │   ├── safety/             # Safety & PPE Detection
│   │   │   ├── structural/         # Crack Analysis & Forensics
│   │   │   ├── planning/           # Project Planner & Gantt Timeline
│   │   │   ├── weather/            # Weather Risk Advisory
│   │   │   ├── valuation/          # Predictive Real Estate Valuation
│   │   │   ├── compliance/         # Knowledge Base & RAG Assistant
│   │   │   └── settings/           # API Keys & Provider Settings Modal
│   │   └── utils/sampleData.js     # Built-in SVG samples & presets
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+) & **npm**
- **Python** (v3.10+) with `pip`

---

### Step 1: Start the Backend (FastAPI)

```bash
cd backend

# (Optional) Create and activate virtual environment
# python -m venv venv && source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI Server (port 8000)
python run.py
```
- API Documentation (Swagger UI): `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/api/v1/health`

---

### Step 2: Start the Frontend (React + Vite)

```bash
cd frontend

# Install packages
npm install

# Start Vite dev server
npm run dev
```
- Open `http://localhost:5173/` in your browser.

---

## 🔑 AI API Key Configuration (Zero-Setup Ready)

1. **Zero-Setup Mode**: If no API keys are entered, **ConstructIQ runs out of the box** using its built-in high-fidelity domain engineering simulator. All 7 modules will execute immediately with rich forensic data, bounding boxes, and Gantt charts!
2. **Live AI Mode**: To connect your live models:
   - Click the **API Keys** / **Settings** button in the header or sidebar.
   - Enter your **Google Gemini API Key** or **OpenAI API Key**.
   - Or configure via `backend/.env`:
     ```env
     GEMINI_API_KEY=AIzaSy...
     OPENAI_API_KEY=sk-proj-...
     AI_PROVIDER=auto
     ```
