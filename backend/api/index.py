import sys
import os
from pathlib import Path

# Add backend directory to sys.path for Vercel Serverless environment
_dir = Path(__file__).resolve().parent.parent
if str(_dir) not in sys.path:
    sys.path.insert(0, str(_dir))

try:
    from main import app
except ImportError:
    from backend.main import app

# Vercel Serverless ASGI entry point
app = app
