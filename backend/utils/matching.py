from typing import Dict, List

from rapidfuzz import fuzz

SKILL_ALIASES: Dict[str, str] = {
    # JavaScript frameworks
    'reactjs':          'react',
    'react.js':         'react',
    'angularjs':        'angular',
    'angular.js':       'angular',
    'vuejs':            'vue',
    'vue.js':           'vue',
    'nextjs':           'next.js',
    'nuxtjs':           'nuxt.js',
    'nuxt':             'nuxt.js',
    'sveltejs':         'svelte',
    # Node / backend JS
    'nodejs':           'node.js',
    'node':             'node.js',
    'expressjs':        'express',
    'express.js':       'express',
    'nestjs':           'nest.js',
    # Java
    'springboot':       'spring boot',
    'spring-boot':      'spring boot',
    # Go
    'golang':           'go',
    # .NET
    'dotnet':           '.net',
    'asp.net':          '.net',
    'aspnet':           '.net',
    'csharp':           'c#',
    'c-sharp':          'c#',
    # Python ML
    'sklearn':          'scikit-learn',
    'scikit':           'scikit-learn',
    'pytorch':          'pytorch',
    'tensorflow2':      'tensorflow',
    'tf':               'tensorflow',
    'huggingface':      'hugging face',
    'hf':               'hugging face',
    'pyspark':          'spark',
    'apache spark':     'spark',
    # Databases
    'postgres':         'postgresql',
    'pg':               'postgresql',
    'mongo':            'mongodb',
    'mysql 8':          'mysql',
    'mssql':            'sql server',
    'ms sql':           'sql server',
    'redis cache':      'redis',
    'elastic':          'elasticsearch',
    'es':               'elasticsearch',
    # Cloud
    'amazon web services': 'aws',
    'gcp':              'google cloud',
    'google cloud platform': 'google cloud',
    'azure cloud':      'azure',
    'microsoft azure':  'azure',
    # CSS
    'tailwindcss':      'tailwind',
    'sass':             'scss',
    # DevOps / infra
    'k8s':              'kubernetes',
    'kube':             'kubernetes',
    'docker-compose':   'docker',
    'ci/cd':            'cicd',
    'ci-cd':            'cicd',
    'github actions':   'cicd',
    'gitlab ci':        'cicd',
    'jenkins pipeline': 'jenkins',
    # ML / AI
    'ml':               'machine learning',
    'ai':               'artificial intelligence',
    'nlp':              'natural language processing',
    'cv':               'computer vision',
    'llm':              'large language models',
    'gen ai':           'generative ai',
    'genai':            'generative ai',
    'rag':              'retrieval augmented generation',
    # Data
    'pandas df':        'pandas',
    'numpy arrays':     'numpy',
    'tableau desktop':  'tableau',
    'power bi desktop': 'power bi',
    # Misc
    'rest':             'rest api',
    'restful':          'rest api',
    'graphql api':      'graphql',
    'grpc':             'grpc',
    'microservice':     'microservices',
    'micro-services':   'microservices',
    'agile scrum':      'agile',
    'jira software':    'jira',
    'git hub':          'github',
    'git lab':          'gitlab',
}


def normalize_skill(skill: str) -> str:
    cleaned = skill.strip().lower()
    return SKILL_ALIASES.get(cleaned, cleaned)


def fuzzy_match_keywords(
    resume_keywords: List[str],
    jd_keywords: List[str],
    threshold: int = 80,
) -> Dict[str, List[str]]:
    resume_normalized = {normalize_skill(kw): kw for kw in resume_keywords}
    jd_normalized     = {normalize_skill(kw): kw for kw in jd_keywords}

    matched_jd_originals = []
    missing_jd_originals = []

    for jd_canon, jd_original in jd_normalized.items():
        # 1. Exact canonical match
        if jd_canon in resume_normalized:
            matched_jd_originals.append(jd_original)
            continue

        # 2. Fuzzy match against all resume canonical names
        best_score = 0
        for resume_canon in resume_normalized:
            score = fuzz.token_sort_ratio(jd_canon, resume_canon)
            best_score = max(best_score, score)

        if best_score >= threshold:
            matched_jd_originals.append(jd_original)
        else:
            missing_jd_originals.append(jd_original)

    return {
        'matched': sorted(matched_jd_originals),
        'missing': missing_jd_originals,
    }
