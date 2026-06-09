"""
CarbonZero — Auth Middleware

Provides a Flask route decorator that verifies Firebase ID tokens.
"""
from __future__ import annotations

import logging
from functools import wraps
from typing import Callable

from flask import request, jsonify
from firebase_admin import auth
from firebase_admin.auth import (
    ExpiredIdTokenError,
    InvalidIdTokenError,
    RevokedIdTokenError,
)

logger = logging.getLogger(__name__)


def require_auth(f: Callable) -> Callable:
    """Decorator that enforces Firebase authentication on a route.

    Reads the ``Authorization: Bearer <token>`` header, verifies it against
    Firebase Auth, and attaches the decoded token to ``request.user``.

    Args:
        f: The Flask route function to protect.

    Returns:
        The wrapped function that enforces authentication.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Allow CORS preflight requests to pass through
        if request.method == "OPTIONS":
            return f(*args, **kwargs)

        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({
                "error": "Unauthorized",
                "message": "Missing or malformed Authorization header. Expected: Bearer <token>",
            }), 401

        id_token = auth_header.split(" ", 1)[1]

        try:
            decoded_token = auth.verify_id_token(id_token)
            request.user = decoded_token
            logger.debug("Authenticated uid=%s", decoded_token.get("uid"))
        except ExpiredIdTokenError:
            return jsonify({"error": "Unauthorized", "message": "Token has expired"}), 401
        except RevokedIdTokenError:
            return jsonify({"error": "Unauthorized", "message": "Token has been revoked"}), 401
        except InvalidIdTokenError:
            return jsonify({"error": "Unauthorized", "message": "Invalid token"}), 401
        except Exception as exc:  # noqa: BLE001
            logger.warning("Token verification failed: %s", exc)
            return jsonify({"error": "Unauthorized", "message": str(exc)}), 401

        return f(*args, **kwargs)

    return decorated_function
