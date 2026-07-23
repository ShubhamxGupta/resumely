# Multi-Provider LLM Gateway Architecture — Resumely

## 1. Overview & Architectural Goals

The **LLM Gateway Subsystem** (`backend/services/llm_gateway.py`) abstracts third-party Large Language Model (LLM) providers behind a unified provider contract. It enables Resumely to route structured resume and job description parsing requests dynamically across **Groq**, **OpenAI**, **Google Gemini**, **Anthropic Claude**, or a deterministic **Offline Rule Engine**.

---

## 2. Dynamic Provider Adapter Design

```mermaid
                                 +-------------------------+
                                 |    BaseLLMProvider      |
                                 |  + parse_text(...)      |
                                 +-------------------------+
                                              |
     +-------------------+--------------------+--------------------+--------------------+
     |                   |                    |                    |                    |
     v                   v                    v                    v                    v
+------------+   +---------------+   +----------------+   +----------------+   +------------------+
|    Groq    |   |    OpenAI     |   | Google Gemini  |   | Anthropic      |   | Offline Rule     |
|  Provider  |   |   Provider    |   |   Provider     |   | Claude Provider|   | Parser Fallback  |
+------------+   +---------------+   +----------------+   +----------------+   +------------------+
```

---

## 3. Supported LLM Providers & Models

| Provider             | Model Identifier             | Input Transport            | Authentication Header         | Response Format                        |
| :------------------- | :--------------------------- | :------------------------- | :---------------------------- | :------------------------------------- |
| **Groq**             | `llama-3.3-70b-versatile`    | Native SDK / HTTP REST     | `Authorization: Bearer <key>` | Raw JSON text                          |
| **OpenAI**           | `gpt-4o-mini`                | HTTP REST                  | `Authorization: Bearer <key>` | `response_format: json_object`         |
| **Google Gemini**    | `gemini-1.5-flash`           | HTTP REST                  | `?key=<key>` Query Parameter  | `response_mime_type: application/json` |
| **Anthropic Claude** | `claude-3-5-sonnet-20241022` | HTTP REST                  | `x-api-key: <key>`            | Raw JSON text                          |
| **Offline Engine**   | Deterministic Regex & NLP    | In-process Local Execution | None                          | Dictionary                             |

---

## 4. Key Precedence & Ephemeral Security

When executing a request, the LLM Gateway resolves the API key using a strict precedence order:

1. **User-Supplied Key**: Passed dynamically via `X-LLM-API-Key` HTTP header.
2. **Server Environment Variable**: Read from `.env` (`GROQ_API_KEY`, `OPENAI_API_KEY`, etc.).
3. **Offline Fallback**: If no key is present, the gateway automatically falls back to `offline_parser.py` without throwing a 500 error.
