
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="NyayaVanni API", description="Legal Document Analyzer API")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "NyayaVanni Backend API is running."}

from api.routes import api_router, login_payload, register_payload
app.include_router(api_router, prefix="/api")


@app.post("/")
async def legacy_auth_fallback(request: Request):
    data = await request.json()

    if data.get("name"):
        return register_payload(data)

    return login_payload(data)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
