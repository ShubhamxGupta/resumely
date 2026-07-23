import os
import json
import logging
from typing import Dict, Optional, Any
import httpx

logger = logging.getLogger('ats_resume_scorer')

class BaseLLMProvider:
    def parse_text(self, system_prompt: str, user_prompt: str, api_key: Optional[str] = None) -> Optional[Dict]:
        raise NotImplementedError

class GroqProvider(BaseLLMProvider):
    def __init__(self, default_key: str = ""):
        self.default_key = default_key
        self.model = "llama-3.3-70b-versatile"

    def parse_text(self, system_prompt: str, user_prompt: str, api_key: Optional[str] = None) -> Optional[Dict]:
        key = api_key or self.default_key or os.getenv("GROQ_API_KEY")
        if not key:
            return None
        try:
            from groq import Groq
            client = Groq(api_key=key)
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user', 'content': user_prompt}
                ],
                temperature=0.0,
                max_tokens=4096
            )
            raw = response.choices[0].message.content.strip()
            return _try_parse_json(raw)
        except Exception as exc:
            logger.warning(f"Groq API call failed: {exc}")
            return None

class OpenAIProvider(BaseLLMProvider):
    def __init__(self, default_key: str = ""):
        self.default_key = default_key
        self.model = "gpt-4o-mini"

    def parse_text(self, system_prompt: str, user_prompt: str, api_key: Optional[str] = None) -> Optional[Dict]:
        key = api_key or self.default_key or os.getenv("OPENAI_API_KEY")
        if not key:
            return None
        try:
            headers = {
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "response_format": {"type": "json_object"},
                "temperature": 0.0
            }
            resp = httpx.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=30.0)
            resp.raise_for_status()
            raw = resp.json()["choices"][0]["message"]["content"].strip()
            return _try_parse_json(raw)
        except Exception as exc:
            logger.warning(f"OpenAI API call failed: {exc}")
            return None

class GeminiProvider(BaseLLMProvider):
    def __init__(self, default_key: str = ""):
        self.default_key = default_key
        self.model = "gemini-1.5-flash"

    def parse_text(self, system_prompt: str, user_prompt: str, api_key: Optional[str] = None) -> Optional[Dict]:
        key = api_key or self.default_key or os.getenv("GEMINI_API_KEY")
        if not key:
            return None
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={key}"
            payload = {
                "contents": [{
                    "parts": [{"text": f"{system_prompt}\n\n{user_prompt}"}]
                }],
                "generationConfig": {
                    "response_mime_type": "application/json",
                    "temperature": 0.0
                }
            }
            resp = httpx.post(url, json=payload, timeout=30.0)
            resp.raise_for_status()
            candidates = resp.json().get("candidates", [])
            if candidates:
                raw = candidates[0]["content"]["parts"][0]["text"].strip()
                return _try_parse_json(raw)
            return None
        except Exception as exc:
            logger.warning(f"Gemini API call failed: {exc}")
            return None

class ClaudeProvider(BaseLLMProvider):
    def __init__(self, default_key: str = ""):
        self.default_key = default_key
        self.model = "claude-3-5-sonnet-20241022"

    def parse_text(self, system_prompt: str, user_prompt: str, api_key: Optional[str] = None) -> Optional[Dict]:
        key = api_key or self.default_key or os.getenv("ANTHROPIC_API_KEY")
        if not key:
            return None
        try:
            headers = {
                "x-api-key": key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            }
            payload = {
                "model": self.model,
                "max_tokens": 4096,
                "system": system_prompt,
                "messages": [{"role": "user", "content": user_prompt}],
                "temperature": 0.0
            }
            resp = httpx.post("https://api.anthropic.com/v1/messages", headers=headers, json=payload, timeout=30.0)
            resp.raise_for_status()
            raw = resp.json()["content"][0]["text"].strip()
            return _try_parse_json(raw)
        except Exception as exc:
            logger.warning(f"Claude API call failed: {exc}")
            return None

def _try_parse_json(text: str) -> Optional[Dict]:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        first_newline = cleaned.index("\n") if "\n" in cleaned else len(cleaned)
        cleaned = cleaned[first_newline + 1:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return None

PROVIDERS = {
    'groq': GroqProvider(),
    'openai': OpenAIProvider(),
    'gemini': GeminiProvider(),
    'claude': ClaudeProvider(),
}

def get_llm_provider(provider_name: str = 'groq') -> BaseLLMProvider:
    name = (provider_name or 'groq').lower()
    return PROVIDERS.get(name, PROVIDERS['groq'])
