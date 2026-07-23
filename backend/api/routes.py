import logging
from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile, status
from fastapi.responses import Response

from backend.api.auth import get_current_user
from backend.database.supabase_db import (
    delete_analysis,
    get_user_history,
    save_analysis,
)
from backend.models.schemas import AnalysisResponse, ComponentScores, JDComparison, SkillValidationDetails
from backend.services.groq_parser import parse_resume, parse_job_description
from backend.services.jd_matcher import compare_resume_with_jd
from backend.services.llm_gateway import (
    get_llm_provider,
    BULLET_SYSTEM_PROMPT,
    COVER_LETTER_SYSTEM_PROMPT,
)
from backend.services.report_generator import generate_html_reports
from backend.services.pdf_export import generate_combined_pdf
from backend.services.resume_analyzer import analyze_full_resume
from backend.services.resume_parser import FileParsingError, FileValidationError, parse_resume_file
from backend.utils.file_utils import (
    get_default_grammar_results,
    get_default_location_results,
    get_default_skill_validation_results,
)

logger = logging.getLogger('ats_resume_scorer')

router = APIRouter(prefix='/api/v1', tags=['Analysis'])

# ── LLM prompt constants ───────────────────────────────────────────────────────
_BULLET_USER_PROMPT_TEMPLATE = (
    'Original Bullet: {bullet_point}\nTarget Job Title: {job_title}'
)
_COVER_LETTER_USER_PROMPT_TEMPLATE = (
    'Job Title: {job_title}\nCompany: {company_name}\nKey Skills: {skills_summary}'
)


# ── Helpers ────────────────────────────────────────────────────────────────────
def _safe_detail(message: str, exc: Exception) -> str:
    """Return a user-friendly error string without leaking raw exception internals."""
    return message


def _build_analysis_response(result: dict, jd_comparison_result: Optional[JDComparison]) -> AnalysisResponse:
    """Construct the AnalysisResponse Pydantic model from the raw analysis dict."""
    svd_raw = result.get('skill_validation_details') or {}
    skill_val_details = SkillValidationDetails(
        validated       = svd_raw.get('validated', []),
        unvalidated     = svd_raw.get('unvalidated', []),
        total           = svd_raw.get('total', 0),
        validated_count = svd_raw.get('validated_count', 0),
        validation_pct  = svd_raw.get('validation_pct', 0.0),
    )

    return AnalysisResponse(
        ATS_score=result['ats_score'],
        ats_score=result['ats_score'],
        component_scores=ComponentScores(**result['component_scores']),
        issues_summary=result['issues_summary'],
        detailed_feedback=result.get('detailed_feedback', []),
        jd_match_analysis=jd_comparison_result,
        skill_validation_details=skill_val_details,
        keyword_match=jd_comparison_result.match_percentage if jd_comparison_result else 0.0,
        missing_keywords=result.get('missing_keywords', []),
        matched_keywords=result.get('matched_keywords', []),
        skills=list(result.get('skills', [])[:20]),
        jd_comparison=jd_comparison_result,
        interpretation=result.get('interpretation', ''),
        strengths=result.get('strengths', []),
    )


# ── Routes ─────────────────────────────────────────────────────────────────────
@router.post('/analyze-resume', response_model=AnalysisResponse)
async def analyze_resume(
    request: Request,
    resume: UploadFile = File(..., description='Resume file — PDF or DOCX, max 5 MB'),
    job_description: str = Form('', description='Job description text (optional)'),
    user_id: str = Depends(get_current_user),
):
    """Parse, score, and return an ATS analysis for the uploaded resume."""
    nlp      = request.app.state.nlp
    embedder = request.app.state.embedder

    provider_name  = request.headers.get('X-LLM-Provider', 'groq')
    custom_api_key = request.headers.get('X-LLM-API-Key') or None

    # ── File parsing ──────────────────────────────────────────────────────────
    try:
        file_bytes = await resume.read()
        filename   = resume.filename or 'resume'
        resume_text, _metadata = parse_resume_file(file_bytes, filename)
        logger.info("Parsed '%s': %d chars extracted", filename, len(resume_text))
    except (FileParsingError, FileValidationError) as exc:
        logger.warning('File parsing failed: %s', exc)
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception as exc:
        logger.error('Unexpected file parsing error: %s', exc)
        raise HTTPException(
            status_code=422,
            detail='Could not read or parse the resume. Please ensure it is a valid PDF or DOCX.',
        )

    # ── Full analysis pipeline ────────────────────────────────────────────────
    try:
        result = analyze_full_resume(
            resume_text=resume_text,
            nlp=nlp,
            embedder=embedder,
            job_description=job_description,
            provider_name=provider_name,
            api_key=custom_api_key,
        )
    except Exception as exc:
        logger.error('Full analysis pipeline failed: %s', exc)
        raise HTTPException(
            status_code=500,
            detail='Analysis pipeline encountered an error. Please try again.',
        )

    # ── Build JD comparison model ─────────────────────────────────────────────
    jd_comparison_result: Optional[JDComparison] = None
    if result.get('jd_comparison'):
        jd_raw = result['jd_comparison']
        jd_comparison_result = JDComparison(
            match_percentage    = round(float(jd_raw.get('match_percentage', 0.0)), 1),
            semantic_similarity = round(float(jd_raw.get('semantic_similarity', 0.0)), 3),
            matched_keywords    = jd_raw.get('matched_keywords', [])[:20],
            missing_keywords    = jd_raw.get('missing_keywords', [])[:15],
            skills_gap          = jd_raw.get('skills_gap', [])[:10],
        )

    response = _build_analysis_response(result, jd_comparison_result)

    # ── Persist to history (non-blocking) ────────────────────────────────────
    try:
        await save_analysis(user_id, filename, result)
    except Exception as exc:
        logger.warning('History save failed (non-blocking): %s', exc)

    return response


@router.get('/health')
async def health_check(request: Request):
    """Health check — confirms NLP models are loaded."""
    return {
        'status':          'healthy',
        'nlp_loaded':      request.app.state.nlp is not None,
        'embedder_loaded': request.app.state.embedder is not None,
    }


@router.get('/history')
async def get_history(user_id: str = Depends(get_current_user)):
    """Return the signed-in user's past analyses."""
    try:
        return await get_user_history(user_id)
    except Exception as exc:
        logger.error('History fetch failed: %s', exc)
        raise HTTPException(status_code=500, detail='Could not load history. Please try again.')


@router.delete('/history/{analysis_id}')
async def delete_history_entry(
    analysis_id: str,
    user_id: str = Depends(get_current_user),
):
    """Delete one analysis from the signed-in user's history."""
    try:
        success = await delete_analysis(analysis_id, user_id)
        if not success:
            raise HTTPException(status_code=404, detail='Analysis not found or not owned by this user.')
        return {'status': 'deleted', 'id': analysis_id}
    except HTTPException:
        raise
    except Exception as exc:
        logger.error('History delete failed: %s', exc)
        raise HTTPException(status_code=500, detail='Could not delete the analysis. Please try again.')


@router.post('/generate-pdf')
async def generate_pdf(
    data: AnalysisResponse,
    user_id: str = Depends(get_current_user),
):
    """Generate and return a PDF report from an AnalysisResponse payload."""
    try:
        html_docs = generate_html_reports(data.model_dump())
        pdf_bytes = generate_combined_pdf(html_docs, data=data.model_dump())
        return Response(
            content=pdf_bytes,
            media_type='application/pdf',
            headers={'Content-Disposition': 'attachment; filename=ats_report.pdf'},
        )
    except Exception as exc:
        logger.error('PDF generation failed: %s', exc)
        raise HTTPException(status_code=500, detail='Failed to generate PDF report. Please try again.')


@router.get('/history/{analysis_id}/pdf')
async def generate_history_pdf(
    analysis_id: str,
    user_id: str = Depends(get_current_user),
):
    """Fetch a stored analysis by ID and return it as a downloadable PDF."""
    history = await get_user_history(user_id)
    analysis_data = next(
        (item['analysis_result'] for item in history if item['id'] == analysis_id),
        None,
    )

    if not analysis_data:
        raise HTTPException(status_code=404, detail='Analysis not found or access denied.')

    try:
        html_docs = generate_html_reports(analysis_data)
        pdf_bytes = generate_combined_pdf(html_docs, data=analysis_data)
        return Response(
            content=pdf_bytes,
            media_type='application/pdf',
            headers={'Content-Disposition': f'attachment; filename=ats_report_{analysis_id}.pdf'},
        )
    except Exception as exc:
        logger.error('History PDF generation failed for %s: %s', analysis_id, exc)
        raise HTTPException(status_code=500, detail='Failed to generate PDF. Please try again.')


@router.post('/rewrite-bullet')
async def rewrite_bullet(
    request: Request,
    bullet_point: str = Form(..., description='Original resume bullet point'),
    job_title: str    = Form('',  description='Target job title (optional)'),
    user_id: str = Depends(get_current_user),
):
    """Rewrite a weak resume bullet into an action-verb & metric-quantified statement."""
    provider_name  = request.headers.get('X-LLM-Provider', 'groq')
    custom_api_key = request.headers.get('X-LLM-API-Key') or None

    provider    = get_llm_provider(provider_name)
    user_prompt = _BULLET_USER_PROMPT_TEMPLATE.format(
        bullet_point=bullet_point,
        job_title=job_title or 'not specified',
    )

    res = provider.parse_text(BULLET_SYSTEM_PROMPT, user_prompt, api_key=custom_api_key)
    if res and 'rewritten_bullet' in res:
        return res

    # Rule-based fallback
    lower = bullet_point.lower()
    if any(kw in lower for kw in ('code', 'develop', 'implement', 'engineer', 'build')):
        action_verb = 'Engineered'
    elif any(kw in lower for kw in ('manage', 'lead', 'coordinate', 'oversee')):
        action_verb = 'Led'
    elif any(kw in lower for kw in ('analy', 'data', 'report', 'metric')):
        action_verb = 'Analysed'
    else:
        action_verb = 'Optimized'

    fallback = (
        f'{action_verb} {bullet_point.strip().rstrip(".")}, '
        'resulting in measurable improvements in team efficiency and delivery speed.'
    )
    return {'rewritten_bullet': fallback}


@router.post('/generate-cover-letter')
async def generate_cover_letter(
    request: Request,
    job_title: str      = Form(..., description='Target job title'),
    company_name: str   = Form(..., description='Company name'),
    skills_summary: str = Form('',  description='Key skills and highlights'),
    user_id: str = Depends(get_current_user),
):
    """Generate a tailored, ATS-optimized cover letter."""
    provider_name  = request.headers.get('X-LLM-Provider', 'groq')
    custom_api_key = request.headers.get('X-LLM-API-Key') or None

    provider    = get_llm_provider(provider_name)
    user_prompt = _COVER_LETTER_USER_PROMPT_TEMPLATE.format(
        job_title=job_title,
        company_name=company_name,
        skills_summary=skills_summary or 'modern software development stacks',
    )

    res = provider.parse_text(COVER_LETTER_SYSTEM_PROMPT, user_prompt, api_key=custom_api_key)
    if res and 'cover_letter' in res:
        return res

    # Rule-based fallback
    skills_str = skills_summary or 'relevant technical expertise'
    fallback_letter = (
        f'Dear Hiring Manager at {company_name},\n\n'
        f'I am writing to express my enthusiastic interest in the {job_title} position. '
        f'With a proven background in {skills_str}, '
        f'I am confident in my ability to make an immediate, positive impact on your team.\n\n'
        f'Throughout my career I have prioritized clean architecture, data-driven decision making, '
        f'and rapid, reliable delivery. I would welcome the opportunity to discuss how my experience '
        f'aligns with the goals of {company_name}.\n\n'
        f'Sincerely,\n[Your Name]'
    )
    return {'cover_letter': fallback_letter}