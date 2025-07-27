from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import Dict, Any
import json

from services.llm_service import LLMService
from services.document_service import DocumentService
from services.activity_service import ActivityService
from models.document import VoiceCommand, VoiceCommandResult
from dependencies import get_llm_service, get_document_service, get_activity_service, get_current_user

router = APIRouter(prefix="/voice", tags=["voice"])

@router.post("/command", response_model=VoiceCommandResult)
async def process_voice_command(
    command: VoiceCommand,
    llm_service: LLMService = Depends(get_llm_service),
    document_service: DocumentService = Depends(get_document_service),
    activity_service: ActivityService = Depends(get_activity_service),
    current_user: str = Depends(get_current_user)
):
    """Process a voice command"""
    try:
        # Process command with LLM
        llm_result = await llm_service.process_voice_command(command.command, command.context)
        
        # Execute the command based on intent
        documents = []
        actions = []
        
        if llm_result["intent"] == "search_documents":
            # Search for documents
            from ..models.document import DocumentSearch
            search = DocumentSearch(
                query=llm_result["parameters"].get("query", ""),
                categories=[llm_result["parameters"].get("category")] if llm_result["parameters"].get("category") else None,
                limit=10
            )
            
            search_results = await document_service.search_documents(search, current_user)
            documents = [result.document for result in search_results]
            
        elif llm_result["intent"] == "merge_documents":
            # Find documents to merge
            category = llm_result["parameters"].get("category")
            if category:
                from ..models.document import DocumentSearch
                search = DocumentSearch(
                    query="",
                    categories=[category],
                    limit=10
                )
                search_results = await document_service.search_documents(search, current_user)
                documents = [result.document for result in search_results[:3]]  # Take first 3 for merge
                actions = ["merge"]
        
        elif llm_result["intent"] == "summarize_documents":
            # Find documents to summarize
            category = llm_result["parameters"].get("category")
            if category:
                from ..models.document import DocumentSearch
                search = DocumentSearch(
                    query="",
                    categories=[category],
                    limit=10
                )
                search_results = await document_service.search_documents(search, current_user)
                documents = [result.document for result in search_results]
                actions = ["summarize"]
        
        # Create result
        result = VoiceCommandResult(
            intent=llm_result["intent"],
            parameters=llm_result["parameters"],
            response=llm_result["response"],
            documents=documents,
            actions=actions
        )
        
        # Log activity
        await activity_service.log_activity(
            user_id=current_user,
            action="Voice Command Processed",
            description=f"Processed voice command: {command.command}",
            activity_type="voice_command",
            actor="ai",
            metadata={
                "intent": llm_result["intent"],
                "confidence": llm_result.get("confidence", 0.0),
                "documents_found": len(documents)
            }
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...),
    current_user: str = Depends(get_current_user)
):
    """Transcribe audio to text (mock implementation)"""
    try:
        # Mock transcription - in reality, this would use Whisper API
        import random
        
        # Simulate processing time
        import asyncio
        await asyncio.sleep(1.0)
        
        # Mock transcription results
        mock_transcriptions = [
            "Find the signed contract from last October for ACME Corp",
            "Merge the three most recent invoices from Vendor A into one PDF",
            "Summarize all HR onboarding forms signed this month",
            "Show me all compliance documents that need review",
            "Convert this document to PDF format",
            "Send the quarterly report to the team"
        ]
        
        transcription = random.choice(mock_transcriptions)
        
        return {
            "transcription": transcription,
            "confidence": round(random.uniform(0.85, 0.98), 2),
            "language": "en",
            "duration": round(random.uniform(2.5, 8.0), 1),
            "processing_time": 1.0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/text-to-speech")
async def text_to_speech(
    data: Dict[str, Any],
    current_user: str = Depends(get_current_user)
):
    """Convert text to speech (mock implementation)"""
    try:
        text = data.get("text", "")
        voice = data.get("voice", "default")
        
        if not text:
            raise HTTPException(status_code=400, detail="Text is required")
        
        # Mock TTS processing
        import asyncio
        await asyncio.sleep(0.5)
        
        return {
            "audio_url": f"/api/voice/audio/{hash(text) % 10000}",
            "text": text,
            "voice": voice,
            "duration": len(text) * 0.05,  # Rough estimate
            "format": "mp3"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/audio/{audio_id}")
async def get_audio(
    audio_id: str,
    current_user: str = Depends(get_current_user)
):
    """Get synthesized audio (mock implementation)"""
    try:
        # Mock audio response
        return {
            "audio_id": audio_id,
            "message": "Audio file would be served here",
            "format": "mp3",
            "status": "ready"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/supported-languages")
async def get_supported_languages():
    """Get supported languages for voice processing"""
    return {
        "transcription": [
            {"code": "en", "name": "English"},
            {"code": "es", "name": "Spanish"},
            {"code": "fr", "name": "French"},
            {"code": "de", "name": "German"},
            {"code": "it", "name": "Italian"},
            {"code": "pt", "name": "Portuguese"},
            {"code": "nl", "name": "Dutch"},
            {"code": "pl", "name": "Polish"}
        ],
        "synthesis": [
            {"code": "en", "name": "English", "voices": ["default", "professional", "friendly"]},
            {"code": "es", "name": "Spanish", "voices": ["default", "professional"]},
            {"code": "fr", "name": "French", "voices": ["default", "professional"]},
            {"code": "de", "name": "German", "voices": ["default", "professional"]}
        ]
    }