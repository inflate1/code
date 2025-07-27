from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
import logging
from pathlib import Path
import asyncio

# Import routes
from routes import documents, voice, tasks, activities, auth

# Import dependencies
from dependencies import cleanup_services

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(
    title="FileClerkAI API",
    description="AI-Powered Document Assistant Backend",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "FileClerkAI Backend API is running"}

@api_router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "FileClerkAI Backend",
        "version": "1.0.0"
    }

# Include all route modules
api_router.include_router(auth.router)
api_router.include_router(documents.router)
api_router.include_router(voice.router)
api_router.include_router(tasks.router)
api_router.include_router(activities.router)

# Include the API router in the main app
app.include_router(api_router)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("FileClerkAI Backend starting up...")
    
    # Create storage directory if it doesn't exist
    storage_dir = Path(__file__).parent / "storage"
    storage_dir.mkdir(exist_ok=True)
    
    logger.info("Storage directory created/verified")
    logger.info("FileClerkAI Backend startup complete")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("FileClerkAI Backend shutting down...")
    await cleanup_services()
    logger.info("FileClerkAI Backend shutdown complete")

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception handler caught: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# Custom error responses
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "Resource not found"}
    )

@app.exception_handler(422)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation error", "errors": exc.errors()}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)