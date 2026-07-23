# Engineering Handbook & Developer Standards — Resumely

## 1. Repository & Code Standards

### 1.1 Python Code Style

- **PEP 8 Compliance**: Strict adherence to PEP 8 formatting rules.
- **Type Annotations**: All function signatures MUST include explicit type hints (`typing.Dict`, `typing.List`, `typing.Optional`, `typing.Tuple`).
- **Docstrings**: Use Google-style docstrings for all top-level functions, classes, and public API endpoints.

```python
def calculate_score(skills: List[str], text: str) -> Tuple[float, List[str]]:
    """Calculates component score based on skill presence.

    Args:
        skills: List of extracted skill names.
        text: Raw document text string.

    Returns:
        Tuple containing calculated numerical score and list of matched skills.
    """
    ...
```

---

## 2. API Design & Security Rules

### 2.1 Pydantic Validation

- All API endpoint payloads MUST be validated using Pydantic v2 schemas (`backend/models/schemas.py`).
- Never pass raw, unvalidated JSON dictionaries across API routes.

### 2.2 Error Handling & Logging

- **No Silent Exception Swallowing**: Never use bare `except:` blocks or swallow stack traces silently.
- **Structured Error Responses**: Always raise `fastapi.HTTPException` with appropriate status codes (`400`, `401`, `422`, `500`).
- **Humanized Messages**: Surface non-technical, actionable error text to the user interface.

### 2.3 Ephemeral Key & Secret Handling

- **Zero-Storage Policy**: User-supplied third-party API keys passed via `X-LLM-API-Key` headers MUST be processed ephemerally in memory and NEVER saved to database tables or printed in server logs.

---

## 3. Git Workflow & Code Review Standards

### 3.1 Branch Naming Conventions

- `feature/<feature-name>` (e.g. `feature/claude-llm-adapter`)
- `bugfix/<issue-name>` (e.g. `bugfix/windows-pdf-export-crash`)
- `docs/<doc-name>` (e.g. `docs/architecture-overhaul`)

### 3.2 Commit Message Convention (Conventional Commits)

- `feat: add Claude-3.5-Sonnet provider adapter`
- `fix: add ReportLab fallback for WeasyPrint missing C-libraries`
- `docs: update system architecture Mermaid diagrams`
