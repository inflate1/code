import jwt
import hashlib
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from motor.motor_asyncio import AsyncIOMotorClient
import uuid

from models.document import UserSession

class AuthService:
    """Simple authentication service - enhance with proper auth later"""
    
    def __init__(self, db: AsyncIOMotorClient, secret_key: str = "your-secret-key"):
        self.db = db
        self.secret_key = secret_key
        self.algorithm = "HS256"
    
    async def create_session(self, user_id: str, session_data: Dict[str, Any] = None) -> UserSession:
        """Create a new user session"""
        session = UserSession(
            user_id=user_id,
            session_data=session_data or {},
            expires_at=datetime.utcnow() + timedelta(hours=24)
        )
        
        # Store session in database
        await self.db.sessions.insert_one(session.dict())
        
        return session
    
    async def get_session(self, session_id: str) -> Optional[UserSession]:
        """Get session by ID"""
        session_data = await self.db.sessions.find_one({"id": session_id})
        if session_data:
            session = UserSession(**session_data)
            
            # Check if session is expired
            if session.expires_at < datetime.utcnow():
                await self.delete_session(session_id)
                return None
            
            # Update last activity
            session.last_activity = datetime.utcnow()
            await self.db.sessions.update_one(
                {"id": session_id},
                {"$set": {"last_activity": session.last_activity}}
            )
            
            return session
        
        return None
    
    async def update_session(self, session_id: str, session_data: Dict[str, Any]) -> bool:
        """Update session data"""
        result = await self.db.sessions.update_one(
            {"id": session_id},
            {
                "$set": {
                    "session_data": session_data,
                    "last_activity": datetime.utcnow()
                }
            }
        )
        
        return result.modified_count > 0
    
    async def delete_session(self, session_id: str) -> bool:
        """Delete a session"""
        result = await self.db.sessions.delete_one({"id": session_id})
        return result.deleted_count > 0
    
    async def cleanup_expired_sessions(self):
        """Clean up expired sessions"""
        result = await self.db.sessions.delete_many({
            "expires_at": {"$lt": datetime.utcnow()}
        })
        return result.deleted_count
    
    def generate_token(self, user_id: str, session_id: str) -> str:
        """Generate JWT token"""
        payload = {
            "user_id": user_id,
            "session_id": session_id,
            "exp": datetime.utcnow() + timedelta(hours=24),
            "iat": datetime.utcnow()
        }
        
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
    
    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    async def get_or_create_user(self, user_id: str) -> Dict[str, Any]:
        """Get or create user (simple implementation)"""
        user = await self.db.users.find_one({"id": user_id})
        
        if not user:
            # Create new user
            user = {
                "id": user_id,
                "created_at": datetime.utcnow(),
                "last_login": datetime.utcnow(),
                "settings": {
                    "theme": "light",
                    "notifications": True,
                    "auto_categorize": True
                }
            }
            await self.db.users.insert_one(user)
        else:
            # Update last login
            await self.db.users.update_one(
                {"id": user_id},
                {"$set": {"last_login": datetime.utcnow()}}
            )
        
        return user
    
    async def update_user_settings(self, user_id: str, settings: Dict[str, Any]) -> bool:
        """Update user settings"""
        result = await self.db.users.update_one(
            {"id": user_id},
            {"$set": {"settings": settings}}
        )
        
        return result.modified_count > 0
    
    async def get_user_settings(self, user_id: str) -> Dict[str, Any]:
        """Get user settings"""
        user = await self.db.users.find_one({"id": user_id})
        return user.get("settings", {}) if user else {}
    
    def hash_password(self, password: str) -> str:
        """Hash password (simple implementation)"""
        return hashlib.sha256(password.encode()).hexdigest()
    
    def verify_password(self, password: str, hashed_password: str) -> bool:
        """Verify password"""
        return self.hash_password(password) == hashed_password