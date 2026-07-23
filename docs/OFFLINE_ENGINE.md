# Offline Engine & NLP Subsystem Specification — Resumely

## 1. Overview

The **Offline NLP Subsystem** provides deterministic, zero-latency resume parsing, keyword extraction, vector similarity scoring, and rule-based feedback generation without requiring any external network requests or remote API keys.

---

## 2. Core NLP Technologies

### 2.1 spaCy Entity & Noun-Chunk Engine (`en_core_web_md`)

- **Named Entity Recognition (NER)**: Extracts `ORG` (Organizations/Companies), `DATE` (Employment & Education dates), `GPE` / `LOC` (Locations), and `PERSON` (Candidate Name).
- **Noun Chunk Chunking**: Extracts multi-word noun phrases for keyword matching.

### 2.2 Sentence Transformers Vector Embeddings (`all-MiniLM-L6-v2`)

- **Dimensions**: 384-dimensional dense vector embeddings.
- **Cosine Similarity Formula**:
  $$\text{Similarity}(A, B) = \frac{A \cdot B}{\|A\|_2 \|B\|_2}$$
- Evaluates semantic closeness between candidate skill bullet points and target Job Description requirements.

---

## 3. Deterministic Fallback Parser (`offline_parser.py`)

When no remote LLM API key is present, `offline_parser.py` extracts structured resume data using deterministic regex and POS patterns:

```python
# Contact Details Extraction Regex
EMAIL_REGEX    = r'[\w\.-]+@[\w\.-]+\.\w+'
PHONE_REGEX    = r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}'
LINKEDIN_REGEX = r'(?:https?://)?(?:www\.)?linkedin\.com/in/[\w-]+|LinkedIn:\s*([\w-]+)'
GITHUB_REGEX   = r'(?:https?://)?(?:www\.)?github\.com/[\w-]+|GitHub:\s*([\w-]+)'
```
