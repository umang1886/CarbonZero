"""
CarbonZero Backend — Application Factory
"""
import logging
import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv

load_dotenv()

# ── Logging configuration ─────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


def create_app() -> Flask:
    """Create and configure the Flask application.

    Returns:
        Flask: The configured Flask application instance.
    """
    app = Flask(__name__)

    # ── CORS ─────────────────────────────────────────────
    allowed_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    env_origin = os.getenv("ALLOWED_ORIGIN", "")
    if env_origin:
        allowed_origins.append(env_origin)

    CORS(app, resources={r"/api/*": {"origins": allowed_origins}})
    logger.info("CORS configured for origins: %s", allowed_origins)

    # ── Rate limiting ─────────────────────────────────────
    Limiter(
        get_remote_address,
        app=app,
        default_limits=["200 per hour", "30 per minute"],
        storage_uri="memory://",
    )

    # ── Blueprints ────────────────────────────────────────
    from app.routes.footprint import footprint_bp
    from app.routes.activities import activities_bp
    from app.routes.insights import insights_bp
    from app.routes.chat import chat_bp

    app.register_blueprint(footprint_bp, url_prefix="/api/v1/footprint")
    app.register_blueprint(activities_bp, url_prefix="/api/v1/activities")
    app.register_blueprint(insights_bp, url_prefix="/api/v1/insights")
    app.register_blueprint(chat_bp, url_prefix="/api/v1/chat")

    # ── Health check ──────────────────────────────────────
    @app.route("/api/v1/health")
    def health_check():
        """Return a simple health-check response."""
        return jsonify({"status": "ok", "service": "CarbonZero API", "version": "1.0"})

    # ── Global error handlers ─────────────────────────────
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": "Bad request", "message": str(e)}), 400

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({"error": "Method not allowed"}), 405

    @app.errorhandler(429)
    def rate_limit_exceeded(e):
        return jsonify({"error": "Rate limit exceeded", "message": str(e)}), 429

    @app.errorhandler(500)
    def server_error(e):
        logger.exception("Unhandled server error: %s", e)
        return jsonify({"error": "Internal server error"}), 500

    logger.info("CarbonZero API application created successfully.")
    return app
