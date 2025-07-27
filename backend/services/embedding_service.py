import asyncio
import hashlib
import json
import random
from typing import List, Optional, Dict, Any
import numpy as np

class EmbeddingService:
    """Mock embedding service - replace with real OpenAI/Sentence-Transformers integration"""
    
    def __init__(self, embedding_dim: int = 384):
        self.embedding_dim = embedding_dim
        self.cache = {}  # Simple in-memory cache
    
    async def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for text - currently using deterministic mock"""
        if not text:
            return [0.0] * self.embedding_dim
        
        # Use text hash for deterministic embeddings
        text_hash = hashlib.md5(text.encode()).hexdigest()
        
        if text_hash in self.cache:
            return self.cache[text_hash]
        
        # Simulate processing time
        await asyncio.sleep(0.1)
        
        # Generate deterministic "embedding" based on text content
        embedding = self._generate_deterministic_embedding(text)
        
        # Cache result
        self.cache[text_hash] = embedding
        
        return embedding
    
    def _generate_deterministic_embedding(self, text: str) -> List[float]:
        """Generate deterministic embedding based on text content"""
        # Use hash seed for reproducible results
        seed = hash(text) % (2**32)
        np.random.seed(seed)
        
        # Generate base embedding
        embedding = np.random.normal(0, 1, self.embedding_dim)
        
        # Add semantic-like features based on keywords
        keywords = {
            'contract': [0.8, 0.2, 0.1],
            'invoice': [0.1, 0.8, 0.2],
            'hr': [0.2, 0.1, 0.8],
            'compliance': [0.6, 0.4, 0.3],
            'urgent': [0.9, 0.1, 0.1],
            'signature': [0.7, 0.3, 0.2],
            'review': [0.4, 0.6, 0.4],
            'quarterly': [0.3, 0.7, 0.2]
        }
        
        text_lower = text.lower()
        for keyword, weights in keywords.items():
            if keyword in text_lower:
                # Boost certain dimensions for semantic similarity
                for i, weight in enumerate(weights):
                    if i < len(embedding):
                        embedding[i] += weight
        
        # Normalize embedding
        norm = np.linalg.norm(embedding)
        if norm > 0:
            embedding = embedding / norm
        
        return embedding.tolist()
    
    async def compute_similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """Compute cosine similarity between two embeddings"""
        if not embedding1 or not embedding2:
            return 0.0
        
        # Convert to numpy arrays
        vec1 = np.array(embedding1)
        vec2 = np.array(embedding2)
        
        # Compute cosine similarity
        dot_product = np.dot(vec1, vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return float(dot_product / (norm1 * norm2))
    
    async def find_similar_documents(self, query_embedding: List[float], 
                                   document_embeddings: List[Dict[str, Any]], 
                                   threshold: float = 0.5, 
                                   limit: int = 10) -> List[Dict[str, Any]]:
        """Find similar documents based on embeddings"""
        if not query_embedding or not document_embeddings:
            return []
        
        similarities = []
        
        for doc_data in document_embeddings:
            doc_embedding = doc_data.get('embedding', [])
            if not doc_embedding:
                continue
            
            similarity = await self.compute_similarity(query_embedding, doc_embedding)
            
            if similarity >= threshold:
                similarities.append({
                    'document': doc_data,
                    'similarity': similarity
                })
        
        # Sort by similarity score (descending)
        similarities.sort(key=lambda x: x['similarity'], reverse=True)
        
        # Return top results
        return similarities[:limit]
    
    async def generate_batch_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts"""
        embeddings = []
        
        for text in texts:
            embedding = await self.generate_embedding(text)
            embeddings.append(embedding)
        
        return embeddings
    
    async def update_embedding_cache(self, text: str, embedding: List[float]):
        """Update embedding cache with new embedding"""
        text_hash = hashlib.md5(text.encode()).hexdigest()
        self.cache[text_hash] = embedding
    
    def get_cache_size(self) -> int:
        """Get current cache size"""
        return len(self.cache)
    
    def clear_cache(self):
        """Clear embedding cache"""
        self.cache.clear()