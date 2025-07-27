from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from typing import List, Optional
import json

from services.document_service import DocumentService
from services.task_service import TaskService
from services.activity_service import ActivityService
from services.auth_service import AuthService
from models.document import DocumentMetadata, DocumentSearch, DocumentAction, DocumentSearchResult
from dependencies import get_document_service, get_task_service, get_activity_service, get_current_user

router = APIRouter(prefix="/documents", tags=["documents"])

@router.post("/upload", response_model=DocumentMetadata)
async def upload_document(
    file: UploadFile = File(...),
    category: str = Form("general"),
    tags: str = Form("[]"),
    auto_categorize: bool = Form(True),
    document_service: DocumentService = Depends(get_document_service),
    activity_service: ActivityService = Depends(get_activity_service),
    current_user: str = Depends(get_current_user)
):
    """Upload a document"""
    try:
        # Parse tags
        tags_list = json.loads(tags) if tags else []
        
        # Read file content
        file_content = await file.read()
        
        # Upload document
        document = await document_service.upload_document(
            file_data=file_content,
            filename=file.filename,
            user_id=current_user,
            category=category,
            tags=tags_list,
            auto_categorize=auto_categorize
        )
        
        # Log activity
        await activity_service.log_activity(
            user_id=current_user,
            action="Document Uploaded",
            description=f"Uploaded document: {file.filename}",
            activity_type="upload",
            actor="user",
            file_type=document.file_type.upper(),
            files=[document.original_filename]
        )
        
        return document
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[DocumentMetadata])
async def get_documents(
    category: Optional[str] = Query(None),
    tags: Optional[str] = Query(None),
    limit: int = Query(50, le=100),
    document_service: DocumentService = Depends(get_document_service),
    current_user: str = Depends(get_current_user)
):
    """Get user documents"""
    try:
        if category or tags:
            # Use search if filters are provided
            search_tags = tags.split(',') if tags else None
            search = DocumentSearch(
                query="",
                categories=[category] if category else None,
                tags=search_tags,
                limit=limit
            )
            results = await document_service.search_documents(search, current_user)
            return [result.document for result in results]
        else:
            # Get all documents
            return await document_service.get_user_documents(current_user, limit)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{document_id}", response_model=DocumentMetadata)
async def get_document(
    document_id: str,
    document_service: DocumentService = Depends(get_document_service),
    current_user: str = Depends(get_current_user)
):
    """Get document by ID"""
    try:
        document = await document_service.get_document_by_id(document_id, current_user)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        return document
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/search", response_model=List[DocumentSearchResult])
async def search_documents(
    search: DocumentSearch,
    document_service: DocumentService = Depends(get_document_service),
    current_user: str = Depends(get_current_user)
):
    """Search documents"""
    try:
        results = await document_service.search_documents(search, current_user)
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/action")
async def document_action(
    action: DocumentAction,
    document_service: DocumentService = Depends(get_document_service),
    task_service: TaskService = Depends(get_task_service),
    activity_service: ActivityService = Depends(get_activity_service),
    current_user: str = Depends(get_current_user)
):
    """Perform action on documents"""
    try:
        # Validate documents belong to user
        documents = []
        for doc_id in action.document_ids:
            doc = await document_service.get_document_by_id(doc_id, current_user)
            if not doc:
                raise HTTPException(status_code=404, detail=f"Document {doc_id} not found")
            documents.append(doc)
        
        # Create background task for processing
        task_params = {
            "user_id": current_user,
            "action": action.action,
            "document_ids": action.document_ids,
            "parameters": action.parameters
        }
        
        if action.action == "summarize":
            task = await task_service.create_task("document_summarization", current_user, task_params)
        elif action.action == "merge":
            task = await task_service.create_task("document_merge", current_user, task_params)
        elif action.action == "translate":
            task = await task_service.create_task("document_translation", current_user, task_params)
        elif action.action == "analyze":
            task = await task_service.create_task("document_analysis", current_user, task_params)
        else:
            task = await task_service.create_task("document_processing", current_user, task_params)
        
        # Log activity
        await activity_service.log_activity(
            user_id=current_user,
            action=f"Document {action.action.title()}",
            description=f"Started {action.action} for {len(documents)} document(s)",
            activity_type=action.action,
            actor="ai",
            files=[doc.original_filename for doc in documents]
        )
        
        return {
            "task_id": task.id,
            "status": task.status,
            "message": f"Started {action.action} for {len(documents)} document(s)"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    document_service: DocumentService = Depends(get_document_service),
    activity_service: ActivityService = Depends(get_activity_service),
    current_user: str = Depends(get_current_user)
):
    """Delete a document"""
    try:
        # Get document info for logging
        document = await document_service.get_document_by_id(document_id, current_user)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Delete document
        success = await document_service.delete_document(document_id, current_user)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to delete document")
        
        # Log activity
        await activity_service.log_activity(
            user_id=current_user,
            action="Document Deleted",
            description=f"Deleted document: {document.original_filename}",
            activity_type="delete",
            actor="user",
            file_type=document.file_type.upper(),
            files=[document.original_filename]
        )
        
        return {"message": "Document deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{document_id}/download")
async def download_document(
    document_id: str,
    document_service: DocumentService = Depends(get_document_service),
    current_user: str = Depends(get_current_user)
):
    """Download a document"""
    try:
        document = await document_service.get_document_by_id(document_id, current_user)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Return file info for frontend to handle download
        return {
            "document_id": document_id,
            "filename": document.original_filename,
            "file_type": document.file_type,
            "file_size": document.file_size,
            "download_url": f"/api/documents/{document_id}/file"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{document_id}/file")
async def get_document_file(
    document_id: str,
    document_service: DocumentService = Depends(get_document_service),
    current_user: str = Depends(get_current_user)
):
    """Get document file content"""
    try:
        from fastapi.responses import FileResponse
        import os
        
        document = await document_service.get_document_by_id(document_id, current_user)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        if not os.path.exists(document.file_path):
            raise HTTPException(status_code=404, detail="File not found")
        
        return FileResponse(
            path=document.file_path,
            filename=document.original_filename,
            media_type=document.mime_type
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))