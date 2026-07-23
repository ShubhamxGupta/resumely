# Developer Knowledge Base & Operations Manual — Resumely

## 1. Executive Developer Overview

This document serves as the central operational guide for developers maintaining, debugging, and deploying **Resumely**.

---

## 2. Directory Structure & File Map

```mermaid
resumely/
├── backend/                        FastAPI application backend
│   ├── api/                        REST API layer & route handlers
│   │   ├── auth.py                 Supabase JWT verification dependency
│   │   └── routes.py               API endpoints (/analyze-resume, /history, /generate-pdf)
│   ├── core/                       Configuration & application metadata
│   │   └── config.py               Environment variable loader & constants
│   ├── database/                   Database abstraction layer
│   │   └── supabase_db.py          Async HTTP REST integration with Supabase
│   ├── models/                     Pydantic schema definitions
│   │   └── schemas.py              Request & response payload schemas
│   ├── services/                   Core domain & NLP business logic
│   │   ├── ats_scorer.py           Multi-dimensional scoring algorithms
│   │   ├── feedback_engine.py      Rule-based issue detection engine
│   │   ├── groq_parser.py          LLM parsing orchestrator & fallback caller
│   │   ├── jd_matcher.py           Semantic vector matching & keyword comparison
│   │   ├── llm_gateway.py          Multi-provider adapter (Groq, OpenAI, Gemini, Claude)
│   │   ├── offline_parser.py       Deterministic rule-based NLP fallback parser
│   │   ├── pdf_export.py           Dual PDF exporter (WeasyPrint + ReportLab fallback)
│   │   ├── report_generator.py     Jinja2 HTML template renderer
│   │   ├── recommendation_engine.py Action item & improvement generator
│   │   └── resume_parser.py        File type validator & document text extractor
│   └── main.py                     FastAPI entrypoint & lifespan model loader
├── frontend/                       Streamlit web application
│   ├── assets/                     CSS stylesheets & design tokens
│   │   └── styles.css              Custom styling definitions
│   ├── components/                 Reusable Streamlit visual components
│   │   ├── dashboard.py            Results dashboard layout
│   │   ├── score_display.py        Score gauge & component progress bars
│   │   └── detailed_feedback.py   Expandable issue cards
│   ├── services/                   Frontend HTTP client layer
│   │   ├── api_client.py           FastAPI REST API client & header injector
│   │   └── supabase_client.py      Supabase auth & session manager
│   ├── views/                      Application page views
│   │   ├── landing.py              Landing hero view
│   │   ├── scorer.py               Resume upload & analysis view
│   │   ├── history.py              Past analysis history view
│   │   └── resources.py            Career & ATS guide view
│   └── streamlit_app.py            Streamlit entrypoint & router
├── docs/                           Technical architecture & reference specifications
├── samples/                        Sample test resumes and reports for validation
├── requirements.txt                Combined backend & frontend dependencies
└── .env                            Environment variable configuration
```

---

## 3. Environment Setup & Development Workflow

### 3.1 Prerequisites

- **Python 3.10+ (64-bit)**
- **Git**

### 3.2 Installation Steps

```powershell
# 1. Clone repository & enter workspace
cd d:\Coding\resumely

# 2. Create virtual environment
python -m venv venv
.\venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Download spaCy medium language model
python -m spacy download en_core_web_md

# 5. Configure environment variables
# Ensure .env contains valid SUPABASE_URL, SUPABASE_KEY, SUPABASE_ANON_KEY, and SUPABASE_JWT_SECRET
```

### 3.3 Running Local Development Servers

```powershell
# Terminal 1: Launch FastAPI Backend
.\venv\Scripts\python.exe -c "import uvicorn; from backend.main import app; uvicorn.run(app, host='127.0.0.1', port=8000)"

# Terminal 2: Launch Streamlit Frontend
.\venv\Scripts\python.exe -m streamlit run frontend/streamlit_app.py
```

---

## 4. Technical Debt & Known Edge Cases

| Technical Debt Item                     | Location                          | Severity | Mitigation / Resolution Strategy                                                    |
| :-------------------------------------- | :-------------------------------- | :------- | :---------------------------------------------------------------------------------- |
| **Monolithic Scorer View**              | `frontend/views/scorer.py`        | Medium   | Refactor session state management into a dedicated state handler module.            |
| **Direct Async HTTP DB Integration**    | `backend/database/supabase_db.py` | Low      | Replace manual `httpx` REST calls with official `supabase-py` async client methods. |
| **spaCy Model Loading Memory Baseline** | `backend/main.py`                 | Low      | Cache spaCy model across processes or load lazily on first analysis request.        |

---

## 5. Common Troubleshooting & Debugging Guide

### Issue 1: `OSError: cannot load library 'libgobject-2.0-0'` during PDF Export

- **Root Cause**: WeasyPrint cannot locate GTK+ C-libraries on Windows.
- **Resolution**: Handled automatically by `pdf_export.py`. System falls back to `ReportLab` without throwing a 500 error.

### Issue 2: `[Errno 11001] getaddrinfo failed` on Authentication

- **Root Cause**: Host computer has lost internet connectivity or DNS lookup failed when contacting Supabase servers.
- **Resolution**: Handled automatically by `_humanize` in `supabase_client.py`. Displays humanized network warning toast to user.

### Issue 3: Low ATS Score on Valid Resumes in Offline Mode

- **Root Cause**: Previously caused by empty parser fallback.
- **Resolution**: Fixed in `offline_parser.py`. System uses regex & NLP fallback parsing when no LLM key is supplied.
