from datetime import datetime
from typing import List, Dict, Any, Optional
from motor.motor_asyncio import AsyncIOMotorClient

from models.document import ActivityLog, MemoryEntry
from utils.json_encoder import serialize_document, serialize_documents

class ActivityService:
    """Service for managing user activities and memories"""
    
    def __init__(self, db: AsyncIOMotorClient):
        self.db = db
    
    async def log_activity(self, user_id: str, action: str, description: str,
                          activity_type: str, actor: str = "user",
                          file_type: str = None, files: List[str] = None,
                          user_confirmation: str = None,
                          metadata: Dict[str, Any] = None) -> ActivityLog:
        """Log a user activity"""
        activity = ActivityLog(
            user_id=user_id,
            action=action,
            description=description,
            activity_type=activity_type,
            actor=actor,
            file_type=file_type,
            files=files or [],
            user_confirmation=user_confirmation,
            metadata=metadata or {}
        )
        
        # Store in database
        activity_dict = activity.dict()
        await self.db.activities.insert_one(activity_dict)
        
        return activity
    
    async def get_user_activities(self, user_id: str, limit: int = 50,
                                activity_type: str = None) -> List[ActivityLog]:
        """Get user activities"""
        query = {"user_id": user_id}
        
        if activity_type:
            query["activity_type"] = activity_type
        
        activities = await self.db.activities.find(query).sort("created_at", -1).limit(limit).to_list(limit)
        activities = serialize_documents(activities)
        
        return [ActivityLog(**activity) for activity in activities]
    
    async def create_memory(self, user_id: str, title: str, content: str,
                          memory_type: str, tags: List[str] = None,
                          starred: bool = False,
                          metadata: Dict[str, Any] = None) -> MemoryEntry:
        """Create a memory entry"""
        memory = MemoryEntry(
            user_id=user_id,
            title=title,
            content=content,
            memory_type=memory_type,
            tags=tags or [],
            starred=starred,
            metadata=metadata or {}
        )
        
        # Store in database
        memory_dict = memory.dict()
        await self.db.memories.insert_one(memory_dict)
        
        return memory
    
    async def get_user_memories(self, user_id: str, limit: int = 50,
                              memory_type: str = None, starred: bool = None) -> List[MemoryEntry]:
        """Get user memories"""
        query = {"user_id": user_id}
        
        if memory_type:
            query["memory_type"] = memory_type
        
        if starred is not None:
            query["starred"] = starred
        
        memories = await self.db.memories.find(query).sort("created_at", -1).limit(limit).to_list(limit)
        memories = serialize_documents(memories)
        
        return [MemoryEntry(**memory) for memory in memories]
    
    async def update_memory(self, memory_id: str, user_id: str,
                          updates: Dict[str, Any]) -> bool:
        """Update memory entry"""
        updates["updated_at"] = datetime.utcnow()
        
        result = await self.db.memories.update_one(
            {"id": memory_id, "user_id": user_id},
            {"$set": updates}
        )
        
        return result.modified_count > 0
    
    async def delete_memory(self, memory_id: str, user_id: str) -> bool:
        """Delete memory entry"""
        result = await self.db.memories.delete_one({"id": memory_id, "user_id": user_id})
        return result.deleted_count > 0
    
    async def search_memories(self, user_id: str, query: str, limit: int = 20) -> List[MemoryEntry]:
        """Search memories by content"""
        search_query = {
            "user_id": user_id,
            "$or": [
                {"title": {"$regex": query, "$options": "i"}},
                {"content": {"$regex": query, "$options": "i"}},
                {"tags": {"$regex": query, "$options": "i"}}
            ]
        }
        
        memories = await self.db.memories.find(search_query).limit(limit).to_list(limit)
        memories = serialize_documents(memories)
        
        return [MemoryEntry(**memory) for memory in memories]
    
    async def get_memory_by_id(self, memory_id: str, user_id: str) -> Optional[MemoryEntry]:
        """Get memory by ID"""
        memory = await self.db.memories.find_one({"id": memory_id, "user_id": user_id})
        
        if memory:
            memory = serialize_document(memory)
            return MemoryEntry(**memory)
        
        return None
    
    async def create_routine_memory(self, user_id: str, title: str, steps: List[str],
                                  tags: List[str] = None) -> MemoryEntry:
        """Create a routine memory"""
        content = "Steps:\n" + "\n".join(f"{i+1}. {step}" for i, step in enumerate(steps))
        
        return await self.create_memory(
            user_id=user_id,
            title=title,
            content=content,
            memory_type="routine",
            tags=tags or ["routine", "workflow"],
            metadata={"steps": steps}
        )
    
    async def create_summary_memory(self, user_id: str, title: str, summary: str,
                                  document_ids: List[str] = None,
                                  tags: List[str] = None) -> MemoryEntry:
        """Create a summary memory"""
        return await self.create_memory(
            user_id=user_id,
            title=title,
            content=summary,
            memory_type="summary",
            tags=tags or ["summary"],
            metadata={"document_ids": document_ids or []}
        )
    
    async def create_bookmark_memory(self, user_id: str, title: str, content: str,
                                   reference_id: str = None,
                                   tags: List[str] = None) -> MemoryEntry:
        """Create a bookmark memory"""
        return await self.create_memory(
            user_id=user_id,
            title=title,
            content=content,
            memory_type="bookmark",
            tags=tags or ["bookmark"],
            metadata={"reference_id": reference_id}
        )
    
    async def get_recent_activities_summary(self, user_id: str, days: int = 7) -> Dict[str, Any]:
        """Get summary of recent activities"""
        # Get activities from the last N days
        from datetime import timedelta
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        activities = await self.db.activities.find({
            "user_id": user_id,
            "created_at": {"$gte": cutoff_date}
        }).to_list(1000)
        
        # Calculate summary statistics
        total_activities = len(activities)
        activity_types = {}
        actors = {"ai": 0, "user": 0}
        
        for activity in activities:
            activity_type = activity.get("activity_type", "unknown")
            activity_types[activity_type] = activity_types.get(activity_type, 0) + 1
            
            actor = activity.get("actor", "user")
            actors[actor] = actors.get(actor, 0) + 1
        
        return {
            "total_activities": total_activities,
            "activity_types": activity_types,
            "actors": actors,
            "days": days,
            "period": f"{cutoff_date.strftime('%Y-%m-%d')} to {datetime.utcnow().strftime('%Y-%m-%d')}"
        }