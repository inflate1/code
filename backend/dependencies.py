from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorClient
import os
from pathlib import Path

# Import services
from .services.document_service import DocumentService
from .services.llm_service import LLMService
from .services.embedding_service import EmbeddingService
from .services.task_service import TaskService
from .services.auth_service import AuthService
from .services.activity_service import ActivityService

# Global dependencies
security = HTTPBearer()

# Database connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'fileclerk_ai')

# Initialize MongoDB client
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Service instances
_document_service = None
_llm_service = None
_embedding_service = None
_task_service = None
_auth_service = None
_activity_service = None

def get_database():
    """Get database instance"""
    return db

def get_document_service():
    """Get document service instance"""
    global _document_service
    if _document_service is None:
        storage_path = Path(__file__).parent / "storage"
        _document_service = DocumentService(db, str(storage_path))
    return _document_service

def get_llm_service():
    """Get LLM service instance"""
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service

def get_embedding_service():
    """Get embedding service instance"""
    global _embedding_service
    if _embedding_service is None:
        _embedding_service = EmbeddingService()
    return _embedding_service

def get_task_service():
    """Get task service instance"""
    global _task_service
    if _task_service is None:
        _task_service = TaskService(db)
    return _task_service

def get_auth_service():
    """Get auth service instance"""
    global _auth_service
    if _auth_service is None:
        secret_key = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
        _auth_service = AuthService(db, secret_key)
    return _auth_service

def get_activity_service():
    """Get activity service instance"""
    global _activity_service
    if _activity_service is None:
        _activity_service = ActivityService(db)
    return _activity_service

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
) -> str:
    """Get current user from token"""
    try:
        # Verify token
        payload = auth_service.verify_token(credentials.credentials)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Check if session exists
        session = await auth_service.get_session(payload["session_id"])
        if not session:
            raise HTTPException(status_code=401, detail="Session not found")
        
        return payload["user_id"]
        
    except Exception as e:
        raise HTTPException(status_code=401, detail="Authentication failed")

async def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
) -> str:
    """Get current user from token (optional)"""
    try:
        return await get_current_user(credentials, auth_service)
    except:
        return "anonymous"

# Cleanup function for application shutdown
async def cleanup_services():
    """Cleanup services on application shutdown"""
    global client
    if client:
        client.close()