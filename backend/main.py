import sys
import os
from pathlib import Path

# Add project root and backend dir to sys.path so imports work both when running
# from project root (`python -m backend.main`) and inside backend directory (`uvicorn main:app`).
_dir = Path(__file__).resolve().parent
_root = _dir.parent
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))
if str(_dir) not in sys.path:
    sys.path.insert(0, str(_dir))

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from backend.core.config import (
        ALLOWED_ORIGINS,
        APP_DESCRIPTION,
        APP_TITLE,
        APP_VERSION,
        LOG_LEVEL,
        RELOAD,
        SPACY_MODEL_PRIMARY,
        SPACY_MODEL_SECONDARY,
        SENTENCE_TRANSFORMER_MODEL,
    )
    from backend.api.routes import router
except ImportError:
    from core.config import (
        ALLOWED_ORIGINS,
        APP_DESCRIPTION,
        APP_TITLE,
        APP_VERSION,
        LOG_LEVEL,
        RELOAD,
        SPACY_MODEL_PRIMARY,
        SPACY_MODEL_SECONDARY,
        SENTENCE_TRANSFORMER_MODEL,
    )
    from api.routes import router

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL, logging.INFO),
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
)
logger = logging.getLogger('ats_resume_scorer')


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info('Starting ATS Resume Analyzer API v%s', APP_VERSION)

    # ── Load spaCy NLP model ──────────────────────────────────────────────────
    logger.info('Loading spaCy NLP model: %s', SPACY_MODEL_PRIMARY)
    import spacy
    try:
        app.state.nlp = spacy.load(SPACY_MODEL_PRIMARY)
        logger.info('Loaded %s', SPACY_MODEL_PRIMARY)
    except OSError:
        logger.warning('%s not found — falling back to %s', SPACY_MODEL_PRIMARY, SPACY_MODEL_SECONDARY)
        app.state.nlp = spacy.load(SPACY_MODEL_SECONDARY)
        logger.info('Loaded %s (fallback)', SPACY_MODEL_SECONDARY)

    # ── Load SentenceTransformer ──────────────────────────────────────────────
    logger.info('Loading SentenceTransformer: %s', SENTENCE_TRANSFORMER_MODEL)
    try:
        import torch
        torch.set_num_threads(1)  # Limit PyTorch memory & CPU thread allocation on 512MB instances
    except ImportError:
        pass

    try:
        from sentence_transformers import SentenceTransformer
        app.state.embedder = SentenceTransformer(SENTENCE_TRANSFORMER_MODEL)
        logger.info('Loaded %s', SENTENCE_TRANSFORMER_MODEL)
    except Exception as exc:
        logger.warning('Failed to load SentenceTransformer (%s). Semantic matching fallback enabled.', exc)
        app.state.embedder = None

    logger.info('All models loaded. API is ready.')
    yield

    logger.info('ATS Resume Analyzer API shutting down.')


app = FastAPI(
    title=APP_TITLE,
    description=APP_DESCRIPTION,
    version=APP_VERSION,
    lifespan=lifespan,
    docs_url='/docs',
    redoc_url='/redoc',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(router)


@app.get('/', tags=['Meta'])
async def root():
    """API index — lists available endpoints."""
    return {
        'name':    APP_TITLE,
        'version': APP_VERSION,
        'endpoints': {
            'POST   /api/v1/analyze-resume':         'Analyze a resume file',
            'GET    /api/v1/history':                'Get user analysis history',
            'DELETE /api/v1/history/{id}':           'Delete a history entry',
            'GET    /api/v1/history/{id}/pdf':       'Download PDF for a history entry',
            'POST   /api/v1/generate-pdf':           'Generate PDF from analysis data',
            'POST   /api/v1/rewrite-bullet':         'AI-powered bullet rewriter',
            'POST   /api/v1/generate-cover-letter':  'AI cover letter generator',
            'GET    /api/v1/health':                 'Health check',
        },
    }


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(
        'main:app',
        host   = '0.0.0.0',
        port   = 8000,
        reload = RELOAD,
    )
