import { useState, useEffect, useCallback } from 'react';
import { documentsAPI } from '../services/api';
import { useToast } from './use-toast';

export const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchDocuments = useCallback(async (category = null, tags = null, limit = 50) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await documentsAPI.list(category, tags, limit);
      setDocuments(data);
      
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch documents';
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
      
      const uploadedDoc = await documentsAPI.upload(file, category, tags, autoCategories);
      
      // Add to documents list
      setDocuments(prev => [uploadedDoc, ...prev]);
      
      toast({
        title: "Success",
        description: `Document "${file.name}" uploaded successfully`,
      });
      
      return uploadedDoc;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to upload document';
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
      
      const results = await documentsAPI.search(query, categories, tags, limit, includeContent);
      
      return results;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to search documents';
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
      
      const result = await documentsAPI.performAction(action, documentIds, parameters);
      
      toast({
        title: "Action Started",
        description: `${action} action started for ${documentIds.length} document(s)`,
      });
      
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || `Failed to perform ${action} action`;
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
      
      await documentsAPI.delete(documentId);
      
      // Remove from documents list
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete document';
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
      
      const document = await documentsAPI.getById(documentId);
      
      return document;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to get document';
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