# Resumely — AI-Powered ATS Resume Analyzer

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.32+-FF4B4B.svg?style=flat&logo=streamlit)](https://streamlit.io/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?style=flat&logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Resumely is a production-grade, open-source Applicant Tracking System (ATS) resume scorer and optimization platform. It evaluates resumes against job descriptions, computes multi-dimensional compatibility scores, identifies missing keywords, validates skills against work history, and provides actionable recommendations.

---

## 🌟 Key Features

- **Hybrid NLP Execution**: Combines local CPU-optimized NLP (`spaCy` + `Sentence Transformers`) for instant vector similarity scoring with optional multi-LLM qualitative analysis.
- **Bring Your Own Key (BYOK) Multi-LLM Gateway**: Connect **Groq** (`llama-3.3-70b`), **OpenAI** (`gpt-4o-mini`), **Google Gemini** (`gemini-1.5-flash`), **Anthropic Claude** (`claude-3-5-sonnet`), or run 100% **Offline**.
- **Deterministic Offline Fallback**: Operates with 100% uptime even without internet access or API keys using `offline_parser.py`.
- **Zero-Storage Privacy Policy**: Custom third-party API keys are processed strictly in memory and NEVER saved to database tables or application logs.
- **Dual PDF Export**: Generates clean downloadable PDF reports with automatic ReportLab fallback for Windows systems.

---

## 🏗️ Architecture Overview

```mermaid
+--------------------------+        +--------------------------+        +--------------------------+
|    Streamlit Frontend    | -----> |     FastAPI Backend      | -----> |   Supabase PostgreSQL    |
|   (Port 8501 / Web UI)   |        |   (Port 8000 / Engine)   |        |  (Auth & Analysis History)|
+--------------------------+        +--------------------------+        +--------------------------+
```

---

## 📚 Technical Documentation Index

All engineering specifications, decision records, and technical handbooks are stored in the [`docs/`](file:///d:/Coding/resumely/docs) directory:

- 📋 **[Product Requirements Document (PRD)](file:///d:/Coding/resumely/docs/prd.md)**: Product vision, user personas, functional/non-functional requirements.
- 🏛️ **[System Architecture Specification](file:///d:/Coding/resumely/docs/architecture.md)**: Logical, physical, and request sequence diagrams.
- 📑 **[Architectural Decision Records (ADRs)](file:///d:/Coding/resumely/docs/decisions.md)**: Key technical decisions, trade-offs, and constraints.
- 🎨 **[Design System Specification](file:///d:/Coding/resumely/docs/design.md)**: HSL design tokens, component behaviors, and WCAG accessibility rules.
- 🤖 **[Multi-LLM Gateway Specification](file:///d:/Coding/resumely/docs/LLM_GATEWAY.md)**: Dynamic LLM provider adapter architecture.
- 🧠 **[Offline Engine & NLP Specification](file:///d:/Coding/resumely/docs/OFFLINE_ENGINE.md)**: spaCy entity recognition and Sentence Transformer embeddings.
- 📊 **[Scoring Engine Specification](file:///d:/Coding/resumely/docs/SCORING_ENGINE.md)**: Multi-dimensional scoring formulas and weight matrices.
- 🔒 **[Security Specification](file:///d:/Coding/resumely/docs/SECURITY.md)**: Threat model, zero-storage key policy, and JWT auth.
- 📈 **[Scalability & Performance Analysis](file:///d:/Coding/resumely/docs/SCALABILITY.md)**: 100 to 10,000 user scaling roadmap.
- 🗺️ **[Engineering Roadmap](file:///d:/Coding/resumely/docs/phases.md)**: Completed features and future stretch goals.
- 📖 **[Developer Knowledge Base](file:///d:/Coding/resumely/docs/memory.md)**: Setup, directory layout, and debugging guide.
- 📘 **[Engineering Handbook](file:///d:/Coding/resumely/docs/rules.md)**: Coding standards, PEP 8 rules, and Git workflow.
- 🏆 **[Documentation & Architectural Review Report](file:///d:/Coding/resumely/docs/REVIEW_REPORT.md)**: System review and maturity scores.

---

## 🚀 Quickstart Guide

### Prerequisites

- Python 3.10+ (64-bit)
- Git

### Installation & Setup

```powershell
# 1. Clone repository
git clone https://github.com/your-org/resumely.git
cd resumely

# 2. Setup Virtual Environment
python -m venv venv
.\venv\Scripts\activate

# 3. Install Dependencies
pip install -r requirements.txt
python -m spacy download en_core_web_md

# 4. Launch Backend (Terminal 1)
python -c "import uvicorn; from backend.main import app; uvicorn.run(app, host='127.0.0.1', port=8000)"

# 5. Launch Frontend (Terminal 2)
streamlit run frontend/streamlit_app.py
```

Open [http://localhost:8501](http://localhost:8501) in your web browser to start analyzing resumes!
