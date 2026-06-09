"""
CarbonZero Backend — FastAPI Application Factory
"""
import logging
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv

from app.api.routers import footprint, chat

load_dotenv()

# ── Logging configuration ─────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address, default_limits=["200/hour", "30/minute"])

def create_app() -> FastAPI:
    app = FastAPI(
        title="CarbonZero API",
        description="AI-Powered Carbon Intelligence Platform",
        version="1.0.0"
    )

    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # ── CORS ─────────────────────────────────────────────
    allowed_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    env_origin = os.getenv("ALLOWED_ORIGIN", "")
    if env_origin:
        allowed_origins.append(env_origin)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    logger.info("CORS configured for origins: %s", allowed_origins)

    # ── Routers ──────────────────────────────────────────
    app.include_router(footprint.router, prefix="/api/v1/footprint", tags=["Footprint"])
    app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])

    @app.get("/api/v1/health", tags=["System"])
    @limiter.exempt
    async def health_check():
        """Return a simple health-check response."""
        return {"status": "ok", "service": "CarbonZero API", "version": "1.0"}

    logger.info("CarbonZero FastAPI application created successfully.")
    return app
