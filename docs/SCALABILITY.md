# Scalability & Production Readiness Analysis — Resumely

## 1. Capacity & Performance Tiers

| Concurrency Tier | Architecture Readiness | Bottlenecks | Required Scaling Actions |
| :--- | :--- | :--- | :--- |
| **100 Concurrent Users** | **Ready (Current Architecture)** | CPU saturation during spaCy/MiniLM embedding generation. | Scale FastAPI backend horizontally across 2–4 workers (`uvicorn --workers 4`). |
| **1,000 Concurrent Users** | **Requires Infrastructure Upgrades** | Memory consumption of spaCy/MiniLM; Supabase REST rate limits. | Implement Redis caching for embedding vectors; introduce Celery task queue. |
| **10,000 Concurrent Users** | **Enterprise Architecture** | External LLM API rate limits & database connections. | Containerize with Docker/Kubernetes; implement connection pooling & autoscale workers. |
