import os
from pathlib import Path

# Load .env from the project root (two levels up from this file) explicitly —
# load_dotenv() with no args relies on caller-frame inspection that can fail
# silently under uvicorn reload, leaving env vars unset.
try:
    from dotenv import load_dotenv
    _backend_env = Path(__file__).resolve().parent.parent / '.env'
    _root_env    = Path(__file__).resolve().parents[2] / '.env'
    if _backend_env.exists():
        load_dotenv(_backend_env)
    elif _root_env.exists():
        load_dotenv(_root_env)
    else:
        load_dotenv()
except ImportError:
    pass

# ── API Metadata ──────────────────────────────────────────────────────────────
APP_TITLE       = 'ATS Resume Analyzer API'
APP_VERSION     = '2.0.0'
APP_DESCRIPTION = 'Multi-dimensional ATS resume scoring, skill validation, and AI-powered rewriting.'

# ── CORS ──────────────────────────────────────────────────────────────────────
# Add all origins that need access. In production, restrict to your actual domain.
_extra_origins = os.getenv('EXTRA_ALLOWED_ORIGINS', '')
ALLOWED_ORIGINS: list[str] = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173',
    *([o.strip() for o in _extra_origins.split(',') if o.strip()] if _extra_origins else []),
]

# ── File Validation ───────────────────────────────────────────────────────────
MAX_FILE_SIZE_MB    = 5
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

# Supported MIME types → short names used internally
SUPPORTED_MIME_TYPES = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
}

SUPPORTED_EXTENSIONS = {'.pdf', '.doc', '.docx'}

# ── NLP / ML Models ───────────────────────────────────────────────────────────
SPACY_MODEL_PRIMARY   = 'en_core_web_md'   # higher accuracy
SPACY_MODEL_SECONDARY = 'en_core_web_sm'   # fallback (was broken: had extra `"` in value)
SENTENCE_TRANSFORMER_MODEL = os.getenv('SENTENCE_TRANSFORMER_MODEL', 'all-MiniLM-L6-v2')

# ── Score Component Weights ───────────────────────────────────────────────────
SCORE_WEIGHTS = {
    'formatting':       20,
    'keywords':         25,
    'content':          25,
    'skill_validation': 15,
    'ats_compatibility': 15,
}

JD_KEYWORD_WEIGHT  = 0.6
JD_SEMANTIC_WEIGHT = 0.4

# ── Supabase ──────────────────────────────────────────────────────────────────
SUPABASE_URL        = os.getenv('SUPABASE_URL', '')
SUPABASE_KEY        = os.getenv('SUPABASE_KEY', '')           # service_role — DB writes (bypasses RLS)
SUPABASE_ANON_KEY   = os.getenv('SUPABASE_ANON_KEY', '')      # public anon — frontend auth calls
SUPABASE_JWT_SECRET = os.getenv('SUPABASE_JWT_SECRET', '')    # used by backend to verify access tokens

# ── LLM Provider Keys (server-side defaults) ──────────────────────────────────
GROQ_API_KEY = os.getenv('GROQ_API_KEY', '')

# ── Server / Runtime ─────────────────────────────────────────────────────────
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO').upper()
RELOAD    = os.getenv('RELOAD', 'false').lower() == 'true'  # set RELOAD=true in dev .env only

# ── HTTP Client ───────────────────────────────────────────────────────────────
HTTP_TIMEOUT   = float(os.getenv('HTTP_TIMEOUT', '30'))    # seconds per LLM/DB call
HTTP_MAX_CONNS = int(os.getenv('HTTP_MAX_CONNS', '20'))    # connection pool size
