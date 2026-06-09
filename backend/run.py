import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    # Run the FastAPI app via Uvicorn
    uvicorn.run("app.main:create_app", host="0.0.0.0", port=port, reload=True, factory=True)
