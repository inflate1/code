import { useState, useEffect, useCallback } from 'react';
import { activitiesAPI } from '../services/api';
import { useToast } from './use-toast';

export const useActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchActivities = useCallback(async (limit = 50, activityType = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await activitiesAPI.list(limit, activityType);
      setActivities(data);
      
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch activities';
      setError(errorMessage);
      console.error('Fetch activities error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getActivitySummary = useCallback(async (days = 7) => {
    try {
      setLoading(true);
      setError(null);
      
      const summary = await activitiesAPI.getSummary(days);
      
      return summary;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to get activity summary';
      setError(errorMessage);
      console.error('Activity summary error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load activities on mount
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    loading,
    error,
    fetchActivities,
    getActivitySummary,
    refetch: fetchActivities
  };
};

export const useMemories = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchMemories = useCallback(async (limit = 50, memoryType = null, starred = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await activitiesAPI.getMemories(limit, memoryType, starred);
      setMemories(data);
      
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch memories';
      setError(errorMessage);
      console.error('Fetch memories error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createMemory = useCallback(async (title, content, memoryType, tags = [], starred = false, metadata = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const memory = await activitiesAPI.createMemory(title, content, memoryType, tags, starred, metadata);
      
      // Add to memories list
      setMemories(prev => [memory, ...prev]);
      
      toast({
        title: "Success",
        description: "Memory created successfully",
      });
      
      return memory;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to create memory';
      setError(errorMessage);
      toast({
        title: "Create Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateMemory = useCallback(async (memoryId, updates) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedMemory = await activitiesAPI.updateMemory(memoryId, updates);
      
      // Update in memories list
      setMemories(prev => prev.map(memory => 
        memory.id === memoryId ? updatedMemory : memory
      ));
      
      toast({
        title: "Success",
        description: "Memory updated successfully",
      });
      
      return updatedMemory;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to update memory';
      setError(errorMessage);
      toast({
        title: "Update Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteMemory = useCallback(async (memoryId) => {
    try {
      setLoading(true);
      setError(null);
      
      await activitiesAPI.deleteMemory(memoryId);
      
      // Remove from memories list
      setMemories(prev => prev.filter(memory => memory.id !== memoryId));
      
      toast({
        title: "Success",
        description: "Memory deleted successfully",
      });
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete memory';
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

  const searchMemories = useCallback(async (query, limit = 20) => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await activitiesAPI.searchMemories(query, limit);
      
      return results;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to search memories';
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

  const createRoutineMemory = useCallback(async (title, steps, tags = []) => {
    try {
      setLoading(true);
      setError(null);
      
      const memory = await activitiesAPI.createRoutineMemory(title, steps, tags);
      
      // Add to memories list
      setMemories(prev => [memory, ...prev]);
      
      toast({
        title: "Success",
        description: "Routine memory created successfully",
      });
      
      return memory;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to create routine memory';
      setError(errorMessage);
      toast({
        title: "Create Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createSummaryMemory = useCallback(async (title, summary, documentIds = [], tags = []) => {
    try {
      setLoading(true);
      setError(null);
      
      const memory = await activitiesAPI.createSummaryMemory(title, summary, documentIds, tags);
      
      // Add to memories list
      setMemories(prev => [memory, ...prev]);
      
      toast({
        title: "Success",
        description: "Summary memory created successfully",
      });
      
      return memory;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to create summary memory';
      setError(errorMessage);
      toast({
        title: "Create Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createBookmarkMemory = useCallback(async (title, content, referenceId = null, tags = []) => {
    try {
      setLoading(true);
      setError(null);
      
      const memory = await activitiesAPI.createBookmarkMemory(title, content, referenceId, tags);
      
      // Add to memories list
      setMemories(prev => [memory, ...prev]);
      
      toast({
        title: "Success",
        description: "Bookmark memory created successfully",
      });
      
      return memory;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to create bookmark memory';
      setError(errorMessage);
      toast({
        title: "Create Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load memories on mount
  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  return {
    memories,
    loading,
    error,
    fetchMemories,
    createMemory,
    updateMemory,
    deleteMemory,
    searchMemories,
    createRoutineMemory,
    createSummaryMemory,
    createBookmarkMemory,
    refetch: fetchMemories
  };
};