from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)

    # CORS — allow Next.js dev server
    CORS(app, resources={r"/api/*": {"origins": [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        os.getenv("ALLOWED_ORIGIN", ""),
    ]}})

    # Rate limiting
    Limiter(
        get_remote_address,
        app=app,
        default_limits=["200 per hour"],
        storage_uri="memory://"
    )

    # Register blueprints
    from app.routes.footprint import footprint_bp
    from app.routes.activities import activities_bp
    from app.routes.insights import insights_bp
    from app.routes.chat import chat_bp

    app.register_blueprint(footprint_bp, url_prefix="/api/v1/footprint")
    app.register_blueprint(activities_bp, url_prefix="/api/v1/activities")
    app.register_blueprint(insights_bp, url_prefix="/api/v1/insights")
    app.register_blueprint(chat_bp, url_prefix="/api/v1/chat")

    @app.route("/api/v1/health")
    def health_check():
        return jsonify({"status": "ok", "service": "CarbonZero API", "version": "1.0"})

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error"}), 500

    return app
