import logging
import httpx
import json
from datetime import datetime, timezone
from typing import List, Optional, Dict

try:
    from backend.core.config import SUPABASE_URL, SUPABASE_KEY, HTTP_TIMEOUT, HTTP_MAX_CONNS
except ImportError:
    from core.config import SUPABASE_URL, SUPABASE_KEY, HTTP_TIMEOUT, HTTP_MAX_CONNS

logger = logging.getLogger('ats_resume_scorer')

# ── Shared async HTTP client ──────────────────────────────────────────────────
# One client for the whole process lifetime — avoids creating a new TCP
# connection pool on every DB call.
_http_client: Optional[httpx.AsyncClient] = None


def _get_client() -> httpx.AsyncClient:
    global _http_client
    if _http_client is None or _http_client.is_closed:
        _http_client = httpx.AsyncClient(
            timeout=HTTP_TIMEOUT,
            limits=httpx.Limits(max_connections=HTTP_MAX_CONNS, max_keepalive_connections=10),
        )
    return _http_client


def _get_headers() -> Optional[Dict]:
    if not SUPABASE_URL or not SUPABASE_KEY:
        return None
    return {
        'apikey':        SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type':  'application/json',
        'Prefer':        'return=representation',
    }


# ── Write ──────────────────────────────────────────────────────────────────────
async def save_analysis(user_id: str, filename: str, analysis_result: Dict) -> Optional[str]:
    headers = _get_headers()
    if not headers:
        return None

    def _json_default(o):
        if hasattr(o, 'model_dump'):
            return o.model_dump()
        return str(o)

    serializable_result = json.loads(json.dumps(analysis_result, default=_json_default))

    doc = {
        'user_id':         user_id,
        'filename':        filename,
        'ats_score':       serializable_result.get('ats_score', 0),
        'keyword_match':   serializable_result.get('keyword_match', 0),
        'missing_keywords':serializable_result.get('missing_keywords', []),
        'created_at':      datetime.now(timezone.utc).isoformat(),
        'analysis_result': serializable_result,
    }

    url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/analyses"
    try:
        response = await _get_client().post(url, headers=headers, json=doc)
        response.raise_for_status()
        data = response.json()
        if data and len(data) > 0:
            inserted_id = str(data[0].get('id'))
            logger.info('Saved analysis for user %s: %s', user_id, inserted_id)
            return inserted_id
        return None
    except Exception as exc:
        logger.error('Failed to save analysis to Supabase: %s', exc)
        return None


# ── Read ───────────────────────────────────────────────────────────────────────
async def get_user_history(user_id: str) -> List[Dict]:
    headers = _get_headers()
    if not headers:
        return []

    url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/analyses"

    # Only fetch the columns needed for the history list view;
    # analysis_result (large blob) is included for reload-on-click.
    select_cols = 'id,filename,ats_score,keyword_match,missing_keywords,created_at,analysis_result'

    try:
        response = await _get_client().get(
            url,
            headers=headers,
            params={
                'select':   select_cols,
                'user_id':  f'eq.{user_id}',
                'order':    'created_at.desc',
            },
        )
        response.raise_for_status()
        docs = response.json()

        return [
            {
                'id':               str(doc.get('id')),
                'filename':         doc.get('filename', 'resume'),
                'ats_score':        doc.get('ats_score', 0),
                'keyword_match':    doc.get('keyword_match', 0),
                'missing_keywords': doc.get('missing_keywords', []),
                'created_at':       doc.get('created_at', ''),
                'analysis_result':  doc.get('analysis_result', {}),
            }
            for doc in docs
        ]
    except Exception as exc:
        logger.error('Failed to fetch history from Supabase: %s', exc)
        return []


# ── Delete ─────────────────────────────────────────────────────────────────────
async def delete_analysis(analysis_id: str, user_id: str) -> bool:
    headers = _get_headers()
    if not headers:
        return False

    url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/analyses"
    try:
        response = await _get_client().delete(
            url,
            headers=headers,
            params={
                'id':      f'eq.{analysis_id}',
                'user_id': f'eq.{user_id}',
            },
        )
        response.raise_for_status()
        return True
    except Exception as exc:
        logger.error('Failed to delete analysis %s: %s', analysis_id, exc)
        return False
