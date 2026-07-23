# Security Audit & Vulnerability Assessment — Resumely

## 1. Executive Security Summary
This document outlines the security architecture, threat model, input validation, and secrets policy for **Resumely**.

---

## 2. Threat Model & Risk Matrix

| Threat Vector | Severity | Impact | Implemented Defense Mechanism |
| :--- | :--- | :--- | :--- |
| **User API Key Leakage** | Critical | High | **Zero-Storage Policy**: Custom keys passed in `X-LLM-API-Key` headers are processed ephemerally in RAM and never written to database tables or application logs. |
| **Malicious File Upload (PDF Injection)** | High | High | Strict MIME validation via `python-magic-bin` + file extension verification + 5 MB file size limit. |
| **Unauthorized DB Access** | High | High | Supabase Row Level Security (RLS) policies enforce user-level isolation. |
| **JWT Token Forgery** | High | Critical | HS256 JWT signature verification using `SUPABASE_JWT_SECRET`. |
