import re
from typing import Dict, List

def fallback_rule_parser(raw_text: str) -> Dict:
    """
    Pure Python rule-based resume parser used when no remote LLM API key is present.
    Extracts contact info, summary, skills, experience, education, projects, and keywords.
    """
    # 1. Contact Information
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', raw_text)
    phone_match = re.search(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}', raw_text)
    linkedin_match = re.search(r'(?:https?://)?(?:www\.)?linkedin\.com/in/[\w-]+|LinkedIn:\s*([\w-]+)', raw_text, re.I)
    github_match = re.search(r'(?:https?://)?(?:www\.)?github\.com/[\w-]+|GitHub:\s*([\w-]+)', raw_text, re.I)

    email = email_match.group(0) if email_match else None
    phone = phone_match.group(0) if phone_match else None
    linkedin = linkedin_match.group(0) if linkedin_match else None
    github = github_match.group(0) if github_match else None

    # Name extraction (first non-empty line before email/phone)
    lines = [l.strip() for l in raw_text.split('\n') if l.strip()]
    name = lines[0] if lines else "Candidate"
    if '@' in name or len(name) > 40:
        name = "Candidate"

    # 2. Professional Summary
    summary = ""
    summary_match = re.search(r'(?:SUMMARY|PROFESSIONAL SUMMARY|PROFILE|OBJECTIVE)\s*\n([\s\S]*?)(?=\n[A-Z\s]{4,}|\Z)', raw_text, re.I)
    if summary_match:
        summary = summary_match.group(1).strip()

    # 3. Skills Extraction
    skills: List[str] = []
    skills_match = re.search(r'(?:TECHNICAL SKILLS|SKILLS|COMPETENCIES|TECHNOLOGIES)\s*\n([\s\S]*?)(?=\n[A-Z\s]{4,}|\Z)', raw_text, re.I)
    if skills_match:
        skills_block = skills_match.group(1)
        raw_items = re.split(r'[,•|\n:]', skills_block)
        ignore_words = {'languages', 'technologies', 'web technologies', 'databases', 'cloud', 'tools', 'developer tools', 'ai/ml & data science'}
        for item in raw_items:
            clean_item = item.strip()
            if clean_item and clean_item.lower() not in ignore_words and len(clean_item) > 1 and len(clean_item) < 35:
                skills.append(clean_item)

    # 4. Experience Section
    experience = []
    exp_match = re.search(r'(?:EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT)\s*\n([\s\S]*?)(?=\n[A-Z\s]{4,}|\Z)', raw_text, re.I)
    if exp_match:
        exp_text = exp_match.group(1)
        blocks = re.split(r'\n(?=[A-Z0-9][A-Za-z0-9\s,–\-]+\s*(?:Remote|Present|20\d\d))', exp_text)
        for b in blocks:
            if len(b.strip()) > 10:
                b_lines = [l.strip() for l in b.strip().split('\n') if l.strip()]
                title = b_lines[0] if b_lines else "Work Experience"
                experience.append({
                    "job_title": title,
                    "company": "Organization",
                    "start_date": "",
                    "end_date": "",
                    "duration_months": 12,
                    "description": b
                })

    # 5. Projects Section
    projects = []
    proj_match = re.search(r'(?:PROJECTS|PERSONAL PROJECTS)\s*\n([\s\S]*?)(?=\n[A-Z\s]{4,}|\Z)', raw_text, re.I)
    if proj_match:
        proj_text = proj_match.group(1)
        proj_blocks = re.split(r'\n(?=[A-Z0-9][A-Za-z0-9\s,–\-]+[—\-–])', proj_text)
        for p in proj_blocks:
            if len(p.strip()) > 10:
                p_lines = [l.strip() for l in p.strip().split('\n') if l.strip()]
                title = p_lines[0] if p_lines else "Project"
                projects.append({
                    "title": title,
                    "description": p,
                    "technologies": []
                })

    # 6. Education Section
    education = []
    edu_match = re.search(r'(?:EDUCATION|ACADEMIC BACKGROUND)\s*\n([\s\S]*?)(?=\n[A-Z\s]{4,}|\Z)', raw_text, re.I)
    if edu_match:
        education.append({
            "degree": "Degree",
            "institution": edu_match.group(1).strip()[:100],
            "year": ""
        })

    # 7. Action Verbs & Keywords
    action_verbs = list(set(re.findall(r'\b(?:Led|Engineered|Developed|Built|Implemented|Re-architected|Constructed|Optimized|Secured|Designed)\b', raw_text, re.I)))
    keywords = list(set(skills + action_verbs))

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
        "github": github,
        "professional_summary": summary,
        "skills": skills,
        "experience": experience,
        "education": education,
        "certifications": [],
        "projects": projects,
        "action_verbs": action_verbs,
        "keywords": keywords,
    }
