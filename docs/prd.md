# Product Requirements Document (PRD) — Resumely

## 1. Executive Summary & Vision

### 1.1 Vision Statement

Resumely is designed to democratize Applicant Tracking System (ATS) optimization for job seekers worldwide. By pairing zero-latency offline NLP analysis with dynamic multi-provider Large Language Models (LLMs), Resumely provides objective, multi-dimensional resume scoring, skill validation, and actionable resume optimization suggestions.

### 1.2 Mission

To provide an open, transparent, privacy-first, and resilient resume evaluation platform that operates seamlessly offline or online, allowing users to bring their own AI provider keys or rely on deterministic local models.

---

## 2. Problem Statement & Market Analysis

### 2.1 The Problem

Modern hiring workflows rely heavily on automated ATS parsers (e.g., Workday, Taleo, Greenhouse, Lever). Up to 75% of resumes are rejected before reaching a human recruiter due to formatting issues, missing target keywords, unquantified achievement bullets, or non-standard section headers. Existing commercial resume screeners suffer from:

1. **Opaque Scoring**: Black-box scores without granular component breakdowns.
2. **Vendor Lock-in & API Reliability**: Hard dependency on single AI API vendors leading to service outages.
3. **Privacy Concerns**: Indefinite retention of user resume data and private API keys on third-party servers.

### 2.2 Product Positioning

Resumely acts as a self-hostable, open, hybrid resume optimization engine. It combines local NLP processing (`spaCy`, `Sentence Transformers`) for instant vector similarity scoring with optional multi-LLM qualitative analysis (`Groq`, `OpenAI`, `Google Gemini`, `Anthropic Claude`).

---

## 3. Target Audience & User Personas

| Persona           | Role                | Primary Goal                                       | Key Pain Points                                                   |
| :---------------- | :------------------ | :------------------------------------------------- | :---------------------------------------------------------------- |
| **Alex Chen**     | Software Engineer   | Match resume against target Job Descriptions (JDs) | Failing ATS filters despite having required technical skills      |
| **Sarah Jenkins** | Recent Graduate     | Format entry-level resume & highlight project work | Lack of work history; unquantified project bullet points          |
| **Marcus Vance**  | Executive / Manager | Quick health check on resume readability & impact  | Needs quick, high-level actionable feedback without cloud lock-in |

---

## 4. User Stories & Acceptance Criteria

### US-001: Offline General ATS Scoring

- **As a** job seeker without an AI API key,
- **I want to** upload my resume in PDF or DOCX format,
- **So that** I can get an instant 0–100 ATS compatibility score based on formatting, content quality, and skill structure.
- **Acceptance Criteria**:
  - Upload supports files up to 5 MB.
  - Processing completes in under 3 seconds using the local offline engine.
  - Returns a overall score, component breakdown (Formatting, Keywords, Content, Skill Validation, ATS Compatibility), and specific issue recommendations.

### US-002: Targeted Job Description Comparison

- **As an** applicant applying for a specific role,
- **I want to** paste the job description alongside my resume,
- **So that** I can see exact keyword matches, missing required skills, and semantic match percentage.
- **Acceptance Criteria**:
  - Highlights matched keywords in green and missing JD keywords in red/amber.
  - Calculates cosine similarity using Sentence Transformers (`all-MiniLM-L6-v2`).

### US-003: Bring Your Own Key (BYOK) Multi-LLM Analysis

- **As a** user with an OpenAI, Gemini, Claude, or Groq API key,
- **I want to** select my preferred provider and enter my key in the sidebar,
- **So that** I can receive qualitative LLM-generated resume improvements.
- **Acceptance Criteria**:
  - User API key is passed ephemerally via request headers.
  - User key is processed in memory and NEVER written to the database or application logs.

---

## 5. Functional Requirements

### 5.1 Document Parsing & File Handling

- **FR-1.1**: The system MUST validate incoming files for MIME type and file size (max 5 MB).
- **FR-1.2**: Support `.pdf`, `.docx`, and `.doc` extensions.
- **FR-1.3**: Fallback gracefully using file extension detection if OS `libmagic` binaries are missing.

### 5.2 Multi-Dimensional ATS Scoring Engine

- **FR-2.1**: Calculate composite ATS Score (0–100) using weighted component formulas:
  - Formatting Quality: 20%
  - Keyword Density & Match: 25%
  - Content Quality & Achievements: 25%
  - Skill Experience Validation: 15%
  - Structure & ATS Compatibility: 15%
- **FR-2.2**: Evaluate bullet point metric density (detecting percentages, dollar amounts, scale metrics).

### 5.3 Multi-Provider LLM Gateway

- **FR-3.1**: Support provider selection: Groq (`llama-3.3-70b`), OpenAI (`gpt-4o-mini`), Google Gemini (`gemini-1.5-flash`), Anthropic Claude (`claude-3-5-sonnet`), and Offline Mode.
- **FR-3.2**: Automatically route parsing requests to the selected provider adapter.

### 5.4 Report Exporting & Persistence

- **FR-4.1**: Generate downloadable PDF reports using WeasyPrint (HTML/CSS) with automatic ReportLab fallback on Windows.
- **FR-4.2**: Persist analysis results to Supabase PostgreSQL for authenticated users.

---

## 6. Non-Functional Requirements

### 6.1 Performance & Latency

- **NFR-1.1**: Offline analysis response time MUST be < 3 seconds.
- **NFR-1.2**: LLM-assisted analysis response time MUST be < 6 seconds.
- **NFR-1.3**: PDF report generation MUST complete in < 2 seconds.

### 6.2 Security & Privacy

- **NFR-2.1**: Zero-storage policy for third-party API keys.
- **NFR-2.2**: Enforce Supabase Row Level Security (RLS) policies on all user history records.
- **NFR-2.3**: Sanitize file upload inputs against malicious PDF payload injections.

### 6.3 Reliability & Availability

- **NFR-3.1**: System MUST remain 100% operational in Offline Mode if external APIs or network connections are unavailable.

---

## 7. Success Metrics & Key Performance Indicators (KPIs)

- **Engine Reliability**: 100% successful analysis completion rate even when remote APIs fail (via offline fallback).
- **Parsing Accuracy**: > 95% accurate extraction of contact details, skills, and experience sections across standard resume templates.
- **PDF Export Reliability**: 0% PDF generation crash rate across all OS platforms (Windows, Linux, macOS).
