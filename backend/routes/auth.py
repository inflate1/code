from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Any, Optional

from ..services.auth_service import AuthService
from ..dependencies import get_auth_service

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()

@router.post("/session")
async def create_session(
    request: Request,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Create a new session (simple implementation)"""
    try:
        # Simple session creation - in production, integrate with proper auth
        client_ip = request.client.host
        user_agent = request.headers.get("user-agent", "")
        
        # For demo purposes, create a session with a default user
        user_id = "demo_user"
        
        # Get or create user
        user = await auth_service.get_or_create_user(user_id)
        
        # Create session
        session = await auth_service.create_session(
            user_id=user_id,
            session_data={
                "client_ip": client_ip,
                "user_agent": user_agent,
                "created_via": "web"
            }
        )
        
        # Generate token
        token = auth_service.generate_token(user_id, session.id)
        
        return {
            "session_id": session.id,
            "user_id": user_id,
            "token": token,
            "expires_at": session.expires_at.isoformat(),
            "user": user
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/session")
async def get_current_session(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Get current session info"""
    try:
        # Verify token
        payload = auth_service.verify_token(credentials.credentials)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Get session
        session = await auth_service.get_session(payload["session_id"])
        if not session:
            raise HTTPException(status_code=401, detail="Session not found")
        
        # Get user
        user = await auth_service.get_or_create_user(session.user_id)
        
        return {
            "session_id": session.id,
            "user_id": session.user_id,
            "last_activity": session.last_activity.isoformat(),
            "expires_at": session.expires_at.isoformat(),
            "user": user
        }
        
    except Exception as e:
        raise HTTPException(status_code=401, detail="Authentication failed")

@router.delete("/session")
async def delete_session(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Delete current session (logout)"""
    try:
        # Verify token
        payload = auth_service.verify_token(credentials.credentials)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Delete session
        success = await auth_service.delete_session(payload["session_id"])
        if not success:
            raise HTTPException(status_code=404, detail="Session not found")
        
        return {"message": "Session deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
async def login(
    login_data: dict,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Simple login endpoint (for demo purposes)"""
    try:
        username = login_data.get("username", "demo_user")
        password = login_data.get("password", "demo_password")
        
        # Simple credential check - in production, use proper auth
        if username == "demo_user" and password == "demo_password":
            user_id = "demo_user"
        elif username == "admin" and password == "admin_password":
            user_id = "admin"
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Get or create user
        user = await auth_service.get_or_create_user(user_id)
        
        # Create session
        session = await auth_service.create_session(
            user_id=user_id,
            session_data={
                "login_method": "username_password",
                "username": username
            }
        )
        
        # Generate token
        token = auth_service.generate_token(user_id, session.id)
        
        return {
            "session_id": session.id,
            "user_id": user_id,
            "token": token,
            "expires_at": session.expires_at.isoformat(),
            "user": user
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/settings")
async def get_user_settings(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Get user settings"""
    try:
        # Verify token
        payload = auth_service.verify_token(credentials.credentials)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Get settings
        settings = await auth_service.get_user_settings(payload["user_id"])
        
        return {"settings": settings}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/user/settings")
async def update_user_settings(
    settings_data: dict,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Update user settings"""
    try:
        # Verify token
        payload = auth_service.verify_token(credentials.credentials)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Update settings
        success = await auth_service.update_user_settings(
            payload["user_id"], 
            settings_data.get("settings", {})
        )
        
        if not success:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "Settings updated successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/cleanup")
async def cleanup_expired_sessions(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Clean up expired sessions (admin function)"""
    try:
        # Verify token
        payload = auth_service.verify_token(credentials.credentials)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Simple admin check
        if payload["user_id"] != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
        
        # Clean up expired sessions
        deleted_count = await auth_service.cleanup_expired_sessions()
        
        return {
            "message": f"Cleaned up {deleted_count} expired sessions",
            "deleted_count": deleted_count
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))