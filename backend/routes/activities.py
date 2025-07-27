from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional

from services.activity_service import ActivityService
from models.document import ActivityLog, MemoryEntry
from dependencies import get_activity_service, get_current_user

router = APIRouter(prefix="/activities", tags=["activities"])

@router.get("/", response_model=List[ActivityLog])
async def get_activities(
    limit: int = Query(50, le=100),
    activity_type: Optional[str] = Query(None),
    activity_service: ActivityService = Depends(get_activity_service),
    current_user: str = Depends(get_current_user)
):
    """Get user activities"""
    try:
        activities = await activity_service.get_user_activities(
            current_user, limit, activity_type
        )
        return activities
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/summary")
async def get_activity_summary(
    days: int = Query(7, ge=1, le=30),
    activity_service: ActivityService = Depends(get_activity_service),
    current_user: str = Depends(get_current_user)
):
    """Get activity summary"""
    try:
        summary = await activity_service.get_recent_activities_summary(current_user, days)
        return summary
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/memories", response_model=List[MemoryEntry])
async def get_memories(
    limit: int = Query(50, le=100),
    memory_type: Optional[str] = Query(None),
    starred: Optional[bool] = Query(None),
    activity_service: ActivityService = Depends(get_activity_service),
    current_user: str = Depends(get_current_user)
):
    """Get user memories"""
    try:
        memories = await activity_service.get_user_memories(
            current_user, limit, memory_type, starred
        )
        return memories
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/memories", response_model=MemoryEntry)
async def create_memory(
    memory_data: dict,
    activity_service: ActivityService = Depends(get_activity_service),
    current_user: str = Depends(get_current_user)
):
    """Create a new memory"""
    try:
        memory = await activity_service.create_memory(
            user_id=current_user,
            title=memory_data.get("title", ""),
            content=memory_data.get("content", ""),
            memory_type=memory_data.get("memory_type", "general"),
            tags=memory_data.get("tags", []),
            starred=memory_data.get("starred", False),
            metadata=memory_data.get("metadata", {})
        )
        
        return memory
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/memories/{memory_id}", response_model=MemoryEntry)
async def get_memory(
    memory_id: str,
    activity_service: ActivityService = Depends(get_activity_service),
    current_user: str = Depends(get_current_user)
):
    """Get memory by ID"""
    try:
        memory = await activity_service.get_memory_by_id(memory_id, current_user)
        if not memory:
            raise HTTPException(status_code=404, detail="Memory not found")
        
        return memory
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/memories/{memory_id}", response_model=MemoryEntry)
async def update_memory(
    memory_id: str,
    updates: dict,
    activity_service: ActivityService = Depends(get_activity_service),
    current_user: str = Depends(get_current_user)
):
    """Update memory"""
    try:
        success = await activity_service.update_memory(memory_id, current_user, updates)
        if not success:
            raise HTTPException(status_code=404, detail="Memory not found")
        
        # Get updated memory
        memory = await activity_service.get_memory_by_id(memory_id, current_user)
        return memory
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/memories/{memory_id}")
async def delete_memory(
    memory_id: str,
    activity_service: ActivityService = Depends(get_activity_service),
    current_user: str = Depends(get_current_user)
):
    """Delete memory"""
    try:
        success = await activity_service.delete_memory(memory_id, current_user)
        if not success:
            raise HTTPException(status_code=404, detail="Memory not found")
        
        return {"message": "Memory deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/memories/search/{query}", response_model=List[MemoryEntry])
async def search_memories(
    query: str,
    limit: int = Query(20, le=50),
    activity_service: ActivityService = Depends(get_activity_service),
    current_user: str = Depends(get_current_user)
):
    """Search memories"""
    try:
        memories = await activity_service.search_memories(current_user, query, limit)
        return memories
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/memories/routine", response_model=MemoryEntry)
async def create_routine_memory(
    routine_data: dict,
    activity_service: ActivityService = Depends(get_activity_service),
    current_user: str = Depends(get_current_user)
):
    """Create a routine memory"""
    try:
        memory = await activity_service.create_routine_memory(
            user_id=current_user,
            title=routine_data.get("title", ""),
            steps=routine_data.get("steps", []),
            tags=routine_data.get("tags", [])
        )
        
        return memory
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/memories/summary", response_model=MemoryEntry)
async def create_summary_memory(
    summary_data: dict,
    activity_service: ActivityService = Depends(get_activity_service),
    current_user: str = Depends(get_current_user)
):
    """Create a summary memory"""
    try:
        memory = await activity_service.create_summary_memory(
            user_id=current_user,
            title=summary_data.get("title", ""),
            summary=summary_data.get("summary", ""),
            document_ids=summary_data.get("document_ids", []),
            tags=summary_data.get("tags", [])
        )
        
        return memory
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/memories/bookmark", response_model=MemoryEntry)
async def create_bookmark_memory(
    bookmark_data: dict,
    activity_service: ActivityService = Depends(get_activity_service),
    current_user: str = Depends(get_current_user)
):
    """Create a bookmark memory"""
    try:
        memory = await activity_service.create_bookmark_memory(
            user_id=current_user,
            title=bookmark_data.get("title", ""),
            content=bookmark_data.get("content", ""),
            reference_id=bookmark_data.get("reference_id"),
            tags=bookmark_data.get("tags", [])
        )
        
        return memory
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))