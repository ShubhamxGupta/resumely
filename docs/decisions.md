# Architectural Decision Records (ADRs) — Resumely

This document serves as the index of key architectural decisions made during the design, development, and evolution of the Resumely system.

---

## ADR 001: Hybrid NLP Execution Model with Deterministic Offline Fallback

### Status

**Approved & Implemented**

### Context & Problem Statement

Resumely needs to extract structured entities (Skills, Experience, Education, Contact Info) and compute similarity scores between resumes and job descriptions. Relying exclusively on third-party LLM APIs (e.g. OpenAI, Groq) presents major operational challenges:

1. API downtime or network outages prevent core application functionality.
2. Users without API keys or internet access cannot evaluate resumes.
3. Cost and rate limits scale linearly with user volume.

Conversely, relying solely on basic regex rules fails to provide qualitative recommendations or extract complex resume layouts.

### Constraints

- The application must function 100% offline without requiring any remote API key.
- Response time for offline analysis must remain under 3 seconds.
- Memory usage must fit within standard container baselines (< 2 GB RAM).

### Alternatives Considered

1. **100% LLM-Dependent Architecture**: Route all parsing and scoring through Groq/OpenAI.
   - _Rejected_: Brittle, fails offline, expensive at scale.
2. **Local Heavy LLM (e.g., Llama-3-8B via Ollama/llama.cpp)**: Run a local 8B model on client/server.
   - _Rejected_: Requires high-end GPU hardware (VRAM > 8GB), unusable on low-end servers or standard developer laptops.
3. **Hybrid Engine (spaCy + Sentence Transformers + Rule Parser + Optional Multi-LLM)**:
   - _Selected_: Uses CPU-optimized spaCy `en_core_web_md` and 384-dimensional Sentence Transformers `all-MiniLM-L6-v2` locally for fast vector math and fallback parsing, while delegating qualitative feedback to pluggable remote LLMs when an API key is available.

### Decision & Rationale

We implemented a hybrid architecture. Local NLP models handle baseline vector math, entity recognition, keyword matching, and deterministic rule parsing (`offline_parser.py`). Remote LLM providers are invoked dynamically via an abstracted gateway adapter when configured.

### Tradeoffs & Implications

- **Pros**: 100% uptime guarantee; fast response times; zero cost for local offline analysis.
- **Cons**: Offline summary extraction lacks the fluency of a 70B parameter LLM, but structural accuracy remains high.

---

## ADR 002: Dual PDF Export Strategy (WeasyPrint HTML + ReportLab Native Fallback)

### Status

**Approved & Implemented**

### Context & Problem Statement

WeasyPrint allows rendering rich HTML/CSS templates into high-fidelity PDF documents. However, WeasyPrint depends on native C-libraries (`cairo`, `pango`, `gdk-pixbuf`, `libgobject-2.0-0.dll`). On Windows operating systems, these DLLs are frequently missing, causing server crashes (`OSError: cannot load library 'libgobject-2.0-0'`).

### Constraints

- PDF export must work reliably across all OS platforms (Windows, Linux, macOS, Docker containers) without forcing Windows developers to install GTK+ runtime installers.

### Alternatives Considered

1. **Force WeasyPrint GTK Dependencies**: Document manual GTK+ installation for Windows users.
   - _Rejected_: Poor developer experience; causes immediate runtime crashes if steps are missed.
2. **Headless Chrome / Puppeteer PDF Export**: Launch a headless browser instance to print PDFs.
   - _Rejected_: High memory footprint (+500MB RAM), slow startup times.
3. **Dual Strategy with ReportLab Fallback**: Attempt WeasyPrint rendering; if native C-libraries fail, automatically fall back to pure-Python `ReportLab`.
   - _Selected_: Provides 100% runtime safety.

### Decision & Rationale

Implemented a dual export strategy in `pdf_export.py`. The application attempts WeasyPrint execution first. If an `ImportError` or `OSError` occurs due to missing system C-libraries, it seamlessly routes PDF construction to ReportLab to generate a clean PDF document without throwing a 500 server error.

### Tradeoffs & Implications

- **Pros**: Zero PDF generation crashes across all environments.
- **Cons**: ReportLab fallback PDF layout is simpler than HTML/CSS templates, but functional and clean.

---

## ADR 003: Ephemeral Header-Based User API Key Handling

### Status

**Approved & Implemented**

### Context & Problem Statement

Users want the flexibility to use their own third-party API keys (OpenAI, Gemini, Claude, Groq) within the application interface. Storing user API keys in a database creates major security, compliance, and encryption overhead risks.

### Constraints

- User keys must never be stored in persistent database tables.
- Keys must not leak into application log files or APM traces.

### Alternatives Considered

1. **Encrypted Database Storage**: Store user API keys encrypted with AES-256 in Supabase.
   - _Rejected_: Increases security risk; violates zero-retention privacy goals.
2. **Ephemeral Header Injection (`X-LLM-API-Key`)**:
   - _Selected_: Streamlit injects custom user keys into HTTP request headers per execution. FastAPI processes the key in memory during request lifecycle and discards it immediately upon completion.

### Decision & Rationale

We adopted the ephemeral header injection model. Keys are passed via `X-LLM-API-Key` headers, processed strictly in memory by `llm_gateway.py`, and never logged or persisted.

### Tradeoffs & Implications

- **Pros**: Maximum privacy, zero security liability for stored keys.
- **Cons**: Users must re-enter their key if session state clears, though browser local storage can cache it locally if desired.
