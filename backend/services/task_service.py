import asyncio
import json
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import uuid

from models.document import TaskStatus, DocumentMetadata
from services.llm_service import LLMService
from utils.json_encoder import serialize_document, serialize_documents

class TaskService:
    """Service for managing asynchronous tasks and background processing"""
    
    def __init__(self, db: AsyncIOMotorClient):
        self.db = db
        self.llm_service = LLMService()
        self.active_tasks = {}  # In-memory task tracking
    
    async def create_task(self, task_type: str, user_id: str, 
                         parameters: Dict[str, Any] = None) -> TaskStatus:
        """Create a new background task"""
        task = TaskStatus(
            task_type=task_type,
            user_id=user_id,
            status="pending"
        )
        
        # Store task in database
        task_dict = task.dict()
        await self.db.tasks.insert_one(task_dict)
        
        # Add to active tasks
        self.active_tasks[task.id] = task
        
        # Start task processing in background
        asyncio.create_task(self._process_task(task.id, parameters or {}))
        
        return task
    
    async def _process_task(self, task_id: str, parameters: Dict[str, Any]):
        """Process a task in the background"""
        try:
            task = self.active_tasks.get(task_id)
            if not task:
                return
            
            # Update task status
            task.status = "processing"
            task.updated_at = datetime.utcnow()
            await self._update_task_in_db(task)
            
            # Process based on task type
            if task.task_type == "document_summarization":
                result = await self._process_document_summarization(parameters)
            elif task.task_type == "document_merge":
                result = await self._process_document_merge(parameters)
            elif task.task_type == "document_translation":
                result = await self._process_document_translation(parameters)
            elif task.task_type == "document_analysis":
                result = await self._process_document_analysis(parameters)
            elif task.task_type == "batch_document_processing":
                result = await self._process_batch_documents(parameters)
            else:
                result = await self._process_generic_task(parameters)
            
            # Update task as completed
            task.status = "completed"
            task.progress = 100.0
            task.result = result
            task.updated_at = datetime.utcnow()
            
        except Exception as e:
            # Update task as failed
            task.status = "failed"
            task.error = str(e)
            task.updated_at = datetime.utcnow()
        
        finally:
            # Update in database
            await self._update_task_in_db(task)
            
            # Remove from active tasks after delay
            await asyncio.sleep(300)  # Keep for 5 minutes
            self.active_tasks.pop(task_id, None)
    
    async def _process_document_summarization(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Process document summarization task"""
        document_id = parameters.get("document_id")
        user_id = parameters.get("user_id")
        
        if not document_id or not user_id:
            raise ValueError("Missing document_id or user_id")
        
        # Get document from database
        doc = await self.db.documents.find_one({"id": document_id, "user_id": user_id})
        if not doc:
            raise ValueError("Document not found")
        
        doc = serialize_document(doc)
        
        # Generate summary using LLM service
        summary_result = await self.llm_service.process_document_action(
            "summarize", 
            doc.get("extracted_text", ""),
            parameters
        )
        
        # Update document with summary
        await self.db.documents.update_one(
            {"id": document_id},
            {"$set": {"content_summary": summary_result["result"]}}
        )
        
        return {
            "document_id": document_id,
            "summary": summary_result["result"],
            "word_count": len(doc.get("extracted_text", "").split())
        }
    
    async def _process_document_merge(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Process document merge task"""
        document_ids = parameters.get("document_ids", [])
        user_id = parameters.get("user_id")
        
        if not document_ids or not user_id:
            raise ValueError("Missing document_ids or user_id")
        
        # Get documents from database
        docs = await self.db.documents.find({
            "id": {"$in": document_ids},
            "user_id": user_id
        }).to_list(len(document_ids))
        
        if len(docs) != len(document_ids):
            raise ValueError("Some documents not found")
        
        docs = serialize_documents(docs)
        
        # Simulate merge processing
        await asyncio.sleep(2.0)
        
        # Generate merge result
        merge_result = await self.llm_service.process_document_action(
            "merge",
            "",
            {"count": len(docs), "filenames": [doc["original_filename"] for doc in docs]}
        )
        
        return {
            "merged_documents": len(docs),
            "output_file": merge_result.get("output_file"),
            "original_files": [doc["original_filename"] for doc in docs]
        }
    
    async def _process_document_translation(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Process document translation task"""
        document_id = parameters.get("document_id")
        user_id = parameters.get("user_id")
        target_language = parameters.get("target_language", "Spanish")
        
        if not document_id or not user_id:
            raise ValueError("Missing document_id or user_id")
        
        # Get document from database
        doc = await self.db.documents.find_one({"id": document_id, "user_id": user_id})
        if not doc:
            raise ValueError("Document not found")
        
        doc = serialize_document(doc)
        
        # Simulate translation processing
        await asyncio.sleep(3.0)
        
        # Generate translation result
        translation_result = await self.llm_service.process_document_action(
            "translate",
            doc.get("extracted_text", ""),
            {"language": target_language}
        )
        
        return {
            "document_id": document_id,
            "target_language": target_language,
            "original_length": len(doc.get("extracted_text", "")),
            "translated_length": len(doc.get("extracted_text", ""))  # Mock same length
        }
    
    async def _process_document_analysis(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Process document analysis task"""
        document_id = parameters.get("document_id")
        user_id = parameters.get("user_id")
        analysis_type = parameters.get("analysis_type", "general")
        
        if not document_id or not user_id:
            raise ValueError("Missing document_id or user_id")
        
        # Get document from database
        doc = await self.db.documents.find_one({"id": document_id, "user_id": user_id})
        if not doc:
            raise ValueError("Document not found")
        
        doc = serialize_document(doc)
        
        # Simulate analysis processing
        await asyncio.sleep(2.5)
        
        # Generate analysis result
        analysis_result = await self.llm_service.process_document_action(
            "extract",
            doc.get("extracted_text", ""),
            {"analysis_type": analysis_type}
        )
        
        return {
            "document_id": document_id,
            "analysis_type": analysis_type,
            "extracted_data": analysis_result.get("extracted_data", {}),
            "insights": f"Analysis completed for {analysis_type} type"
        }
    
    async def _process_batch_documents(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Process multiple documents in batch"""
        document_ids = parameters.get("document_ids", [])
        user_id = parameters.get("user_id")
        operation = parameters.get("operation", "summarize")
        
        if not document_ids or not user_id:
            raise ValueError("Missing document_ids or user_id")
        
        results = []
        
        for doc_id in document_ids:
            try:
                # Process each document
                if operation == "summarize":
                    result = await self._process_document_summarization({
                        "document_id": doc_id,
                        "user_id": user_id
                    })
                elif operation == "analyze":
                    result = await self._process_document_analysis({
                        "document_id": doc_id,
                        "user_id": user_id
                    })
                else:
                    result = {"document_id": doc_id, "status": "processed"}
                
                results.append(result)
                
            except Exception as e:
                results.append({
                    "document_id": doc_id,
                    "error": str(e),
                    "status": "failed"
                })
        
        return {
            "operation": operation,
            "total_documents": len(document_ids),
            "successful": len([r for r in results if "error" not in r]),
            "failed": len([r for r in results if "error" in r]),
            "results": results
        }
    
    async def _process_generic_task(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Process generic task"""
        await asyncio.sleep(1.0)
        
        return {
            "message": "Task completed successfully",
            "parameters": parameters,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    async def _update_task_in_db(self, task: TaskStatus):
        """Update task in database"""
        task_dict = task.dict()
        await self.db.tasks.update_one(
            {"id": task.id},
            {"$set": task_dict}
        )
    
    async def get_task_status(self, task_id: str, user_id: str) -> Optional[TaskStatus]:
        """Get task status"""
        task_data = await self.db.tasks.find_one({"id": task_id, "user_id": user_id})
        if task_data:
            task_data = serialize_document(task_data)
            return TaskStatus(**task_data)
        return None
    
    async def get_user_tasks(self, user_id: str, limit: int = 50) -> List[TaskStatus]:
        """Get all tasks for a user"""
        tasks = await self.db.tasks.find({"user_id": user_id}).limit(limit).to_list(limit)
        tasks = serialize_documents(tasks)
        return [TaskStatus(**task) for task in tasks]
    
    async def cancel_task(self, task_id: str, user_id: str) -> bool:
        """Cancel a task"""
        task = self.active_tasks.get(task_id)
        if task and task.user_id == user_id:
            task.status = "cancelled"
            task.updated_at = datetime.utcnow()
            await self._update_task_in_db(task)
            return True
        return False
    
    async def cleanup_old_tasks(self, days_old: int = 7):
        """Clean up old completed tasks"""
        cutoff_date = datetime.utcnow() - timedelta(days=days_old)
        
        result = await self.db.tasks.delete_many({
            "status": {"$in": ["completed", "failed", "cancelled"]},
            "updated_at": {"$lt": cutoff_date}
        })
        
        return result.deleted_count