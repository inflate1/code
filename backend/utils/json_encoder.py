import json
from datetime import datetime
from bson import ObjectId
from typing import Any

class CustomJSONEncoder(json.JSONEncoder):
    """Custom JSON encoder that handles MongoDB ObjectId and datetime objects"""
    
    def default(self, obj: Any) -> Any:
        if isinstance(obj, ObjectId):
            return str(obj)
        elif isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

def serialize_document(document: dict) -> dict:
    """Serialize a MongoDB document by converting ObjectId to string"""
    if not document:
        return document
    
    # Convert _id to id and make it a string
    if '_id' in document:
        document['id'] = str(document['_id'])
        del document['_id']
    
    # Convert any other ObjectId fields
    for key, value in document.items():
        if isinstance(value, ObjectId):
            document[key] = str(value)
        elif isinstance(value, datetime):
            document[key] = value.isoformat()
        elif isinstance(value, dict):
            document[key] = serialize_document(value)
        elif isinstance(value, list):
            document[key] = [serialize_document(item) if isinstance(item, dict) else 
                           str(item) if isinstance(item, ObjectId) else item for item in value]
    
    return document

def serialize_documents(documents: list) -> list:
    """Serialize a list of MongoDB documents"""
    return [serialize_document(doc) for doc in documents]