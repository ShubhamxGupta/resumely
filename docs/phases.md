# Engineering Roadmap & Release Matrix — Resumely

## 1. Roadmap Overview & Strategic Priorities

This document outlines the engineering priorities, milestone dependencies, complexity estimates, and risk ratings for **Resumely**.

---

## 2. Milestone Matrix

### Phase 1: Core Foundation, Windows Stability & Bug Fixes

**Status: COMPLETED (v1.0.0)**

| Task Item                                      | Target Component     | Complexity | Priority | Risk   | Status    |
| :--------------------------------------------- | :------------------- | :--------- | :------- | :----- | :-------- |
| **Virtual Env & Dependency Standardization**   | Build / Setup        | Low        | High     | Low    | Completed |
| **Windows File Parsing (`libmagic` Fallback)** | `resume_parser.py`   | Medium     | Critical | Medium | Completed |
| **Syntax Error Cleanup**                       | `feedback_engine.py` | Low        | Critical | Low    | Completed |
| **Dual PDF Export (ReportLab Fallback)**       | `pdf_export.py`      | Medium     | High     | Medium | Completed |
| **Network & DNS Humanized Error Handling**     | `supabase_client.py` | Low        | Medium   | Low    | Completed |

---

### Phase 2: Multi-LLM Provider Integration & BYOK Architecture

**Status: COMPLETED (v1.1.0)**

| Task Item                                   | Target Component              | Complexity | Priority | Risk   | Status    |
| :------------------------------------------ | :---------------------------- | :--------- | :------- | :----- | :-------- |
| **Unified LLM Gateway Adapter**             | `llm_gateway.py`              | High       | Critical | Medium | Completed |
| **OpenAI, Gemini & Claude Adapter Support** | `llm_gateway.py`              | Medium     | High     | Medium | Completed |
| **Header-Based Custom API Key Injection**   | `routes.py` / `api_client.py` | Medium     | High     | Low    | Completed |
| **UI Provider Selector & Password Input**   | `streamlit_app.py`            | Low        | High     | Low    | Completed |

---

### Phase 3: Offline Engine & NLP Accuracy Overhaul

**Status: COMPLETED (v1.2.0)**

| Task Item                                        | Target Component     | Complexity | Priority | Risk   | Status    |
| :----------------------------------------------- | :------------------- | :--------- | :------- | :----- | :-------- |
| **Deterministic Offline NLP Rule Parser**        | `offline_parser.py`  | High       | Critical | Medium | Completed |
| **Bullet Point Metric Quantification Check**     | `feedback_engine.py` | Medium     | High     | Low    | Completed |
| **False Positive Elimination on Sample Resumes** | `groq_parser.py`     | Medium     | High     | Medium | Completed |

---

### Phase 4: Production Polish & UI Redesign (Planned)

**Status: IN PROGRESS (v1.3.0 Target)**

| Task Item                                   | Target Component   | Complexity | Priority | Risk | Status      |
| :------------------------------------------ | :----------------- | :--------- | :------- | :--- | :---------- |
| **Single Unified Export Panel**             | `dashboard.py`     | Low        | High     | Low  | Completed   |
| **Glassmorphic Theme Polish**               | `styles.css`       | Medium     | Medium   | Low  | In Progress |
| **Interactive Metric Gauges (Plotly/Vega)** | `score_display.py` | Medium     | Low      | Low  | Planned     |

---

### Phase 5: Advanced Premium Features & Scaling

**Status: COMPLETED (v2.0.0 Target)**

| Task Item | Target Component | Complexity | Priority | Risk | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **AI Resume Rewriter & Metric Optimizer** | `routes.py` / `RewritePage.jsx` | High | High | Low | Completed |
| **Tailored Cover Letter Generator** | `routes.py` / `RewritePage.jsx` | High | High | Low | Completed |
| **Recruiter 6-Second Simulation Heatmap** | `RecruiterPage.jsx` | Medium | Medium | Low | Completed |
| **Supabase DB Live Analytics & History Vault** | `ExecutiveDashboard.jsx` | Medium | High | Low | Completed |
