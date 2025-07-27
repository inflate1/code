from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional

from services.task_service import TaskService
from models.document import TaskStatus
from dependencies import get_task_service, get_current_user

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/", response_model=List[TaskStatus])
async def get_tasks(
    limit: int = Query(50, le=100),
    status: Optional[str] = Query(None),
    task_service: TaskService = Depends(get_task_service),
    current_user: str = Depends(get_current_user)
):
    """Get user tasks"""
    try:
        tasks = await task_service.get_user_tasks(current_user, limit)
        
        # Filter by status if provided
        if status:
            tasks = [task for task in tasks if task.status == status]
        
        return tasks
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{task_id}", response_model=TaskStatus)
async def get_task(
    task_id: str,
    task_service: TaskService = Depends(get_task_service),
    current_user: str = Depends(get_current_user)
):
    """Get task by ID"""
    try:
        task = await task_service.get_task_status(task_id, current_user)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        return task
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{task_id}/cancel")
async def cancel_task(
    task_id: str,
    task_service: TaskService = Depends(get_task_service),
    current_user: str = Depends(get_current_user)
):
    """Cancel a task"""
    try:
        success = await task_service.cancel_task(task_id, current_user)
        if not success:
            raise HTTPException(status_code=404, detail="Task not found or cannot be cancelled")
        
        return {"message": "Task cancelled successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/cleanup")
async def cleanup_old_tasks(
    days: int = Query(7, ge=1, le=30),
    task_service: TaskService = Depends(get_task_service),
    current_user: str = Depends(get_current_user)
):
    """Clean up old tasks (admin function)"""
    try:
        # Simple authorization check - in production, use proper admin roles
        if current_user != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
        
        deleted_count = await task_service.cleanup_old_tasks(days)
        
        return {
            "message": f"Cleaned up {deleted_count} old tasks",
            "deleted_count": deleted_count,
            "days_old": days
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats/summary")
async def get_task_stats(
    task_service: TaskService = Depends(get_task_service),
    current_user: str = Depends(get_current_user)
):
    """Get task statistics"""
    try:
        # Get all user tasks
        tasks = await task_service.get_user_tasks(current_user, 1000)
        
        # Calculate statistics
        total_tasks = len(tasks)
        status_counts = {}
        type_counts = {}
        
        for task in tasks:
            # Count by status
            status = task.status
            status_counts[status] = status_counts.get(status, 0) + 1
            
            # Count by type
            task_type = task.task_type
            type_counts[task_type] = type_counts.get(task_type, 0) + 1
        
        # Calculate completion rate
        completed = status_counts.get("completed", 0)
        completion_rate = (completed / total_tasks * 100) if total_tasks > 0 else 0
        
        return {
            "total_tasks": total_tasks,
            "completion_rate": round(completion_rate, 1),
            "status_breakdown": status_counts,
            "type_breakdown": type_counts,
            "active_tasks": status_counts.get("processing", 0) + status_counts.get("pending", 0)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))