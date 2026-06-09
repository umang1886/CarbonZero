import firebase_admin
from firebase_admin import credentials, firestore
import os

def init_firebase():
    if not firebase_admin._apps:
        # Check if serviceAccountKey.json exists locally
        cred_path = os.path.join(os.path.dirname(__file__), "..", "serviceAccountKey.json")
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            # Fallback to Application Default Credentials or just Project ID
            try:
                firebase_admin.initialize_app(options={"projectId": "carbonfootprint-26d84"})
            except ValueError as e:
                print(f"Firebase Admin init failed: {e}")

    # Return the db instance
    try:
        return firestore.client()
    except Exception as e:
        print(f"Firestore client error: {e}")
        return None

db = init_firebase()
