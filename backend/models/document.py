from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

class DocumentMetadata(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str
    original_filename: str
    file_path: str
    file_size: int
    file_type: str
    mime_type: str
    category: str
    status: str = "uploaded"
    tags: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    user_id: str
    content_summary: Optional[str] = None
    extracted_text: Optional[str] = None
    embedding: Optional[List[float]] = None
    metadata: Dict[str, Any] = {}

class DocumentUpload(BaseModel):
    category: str = "general"
    tags: List[str] = []
    auto_categorize: bool = True

class DocumentSearch(BaseModel):
    query: str
    categories: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    limit: int = 10
    include_content: bool = False

class DocumentAction(BaseModel):
    action: str
    document_ids: List[str]
    parameters: Dict[str, Any] = {}

class DocumentSearchResult(BaseModel):
    document: DocumentMetadata
    relevance_score: float
    matching_content: Optional[str] = None

class VoiceCommand(BaseModel):
    command: str
    session_id: Optional[str] = None
    context: Dict[str, Any] = {}

class VoiceCommandResult(BaseModel):
    intent: str
    parameters: Dict[str, Any]
    response: str
    documents: List[DocumentMetadata] = []
    actions: List[str] = []

class TaskStatus(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    task_type: str
    status: str = "pending"  # pending, processing, completed, failed
    progress: float = 0.0
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    user_id: str

class UserSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_data: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime

class MemoryEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    content: str
    memory_type: str  # summary, routine, bookmark, history
    tags: List[str] = []
    starred: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = {}

class ActivityLog(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    action: str
    description: str
    activity_type: str
    actor: str  # ai, user
    file_type: Optional[str] = None
    files: List[str] = []
    user_confirmation: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = {}