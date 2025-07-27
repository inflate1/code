import { useState, useEffect, useCallback } from 'react';
import { mockDocumentService } from '../services/mockService';
import { useToast } from './use-toast';

export const useMockDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchDocuments = useCallback(async (category = null, tags = null, limit = 50) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await mockDocumentService.list(category, tags, limit);
      setDocuments(data);
      
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch documents';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const uploadDocument = useCallback(async (file, category = 'general', tags = [], autoCategories = true) => {
    try {
      setLoading(true);
      setError(null);
      
      const uploadedDoc = await mockDocumentService.upload(file, category, tags, autoCategories);
      
      // Add to documents list
      setDocuments(prev => [uploadedDoc, ...prev]);
      
      toast({
        title: "Success",
        description: `Document "${file.name}" uploaded successfully`,
      });
      
      return uploadedDoc;
    } catch (err) {
      const errorMessage = err.message || 'Failed to upload document';
      setError(errorMessage);
      toast({
        title: "Upload Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const searchDocuments = useCallback(async (query, categories = null, tags = null, limit = 10, includeContent = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await mockDocumentService.search(query, categories, tags, limit);
      
      return results;
    } catch (err) {
      const errorMessage = err.message || 'Failed to search documents';
      setError(errorMessage);
      toast({
        title: "Search Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const performDocumentAction = useCallback(async (action, documentIds, parameters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await mockDocumentService.performAction(action, documentIds, parameters);
      
      toast({
        title: "Action Started",
        description: `${action} action started for ${documentIds.length} document(s)`,
      });
      
      return result;
    } catch (err) {
      const errorMessage = err.message || `Failed to perform ${action} action`;
      setError(errorMessage);
      toast({
        title: "Action Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteDocument = useCallback(async (documentId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock delete - just remove from local state
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete document';
      setError(errorMessage);
      toast({
        title: "Delete Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getDocumentById = useCallback(async (documentId) => {
    try {
      setLoading(true);
      setError(null);
      
      const document = documents.find(doc => doc.id === documentId);
      
      if (!document) {
        throw new Error('Document not found');
      }
      
      return document;
    } catch (err) {
      const errorMessage = err.message || 'Failed to get document';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [documents, toast]);

  // Load documents on mount
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    uploadDocument,
    searchDocuments,
    performDocumentAction,
    deleteDocument,
    getDocumentById,
    refetch: fetchDocuments
  };
};