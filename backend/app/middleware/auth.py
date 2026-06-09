from functools import wraps
from flask import request, jsonify
import firebase_admin
from firebase_admin import auth

def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Allow preflight OPTIONS requests to pass
        if request.method == "OPTIONS":
            return f(*args, **kwargs)

        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Unauthorized", "message": "Missing or invalid Authorization header"}), 401

        id_token = auth_header.split(" ")[1]

        try:
            # Verify the token against Firebase Auth
            decoded_token = auth.verify_id_token(id_token)
            request.user = decoded_token  # Attach user data to request context
        except Exception as e:
            return jsonify({"error": "Unauthorized", "message": str(e)}), 401

        return f(*args, **kwargs)

    return decorated_function
