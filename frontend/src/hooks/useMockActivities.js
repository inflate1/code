import { useState, useEffect, useCallback } from 'react';
import { mockActivityService } from '../services/mockService';
import { useToast } from './use-toast';

export const useMockActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchActivities = useCallback(async (limit = 50, activityType = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await mockActivityService.list(limit, activityType);
      setActivities(data);
      
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch activities';
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
      
      // Mock activity summary
      const activities = await mockActivityService.list(1000);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const recentActivities = activities.filter(activity => 
        new Date(activity.created_at) >= cutoffDate
      );
      
      const summary = {
        total_activities: recentActivities.length,
        activity_types: recentActivities.reduce((acc, activity) => {
          acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1;
          return acc;
        }, {}),
        actors: recentActivities.reduce((acc, activity) => {
          acc[activity.actor] = (acc[activity.actor] || 0) + 1;
          return acc;
        }, {}),
        days,
        period: `${cutoffDate.toISOString().split('T')[0]} to ${new Date().toISOString().split('T')[0]}`
      };
      
      return summary;
    } catch (err) {
      const errorMessage = err.message || 'Failed to get activity summary';
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

export const useMockMemories = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchMemories = useCallback(async (limit = 50, memoryType = null, starred = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await mockActivityService.getMemories(limit, memoryType, starred);
      setMemories(data);
      
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch memories';
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
      
      const memory = await mockActivityService.createMemory(title, content, memoryType, tags, starred);
      
      // Add to memories list
      setMemories(prev => [memory, ...prev]);
      
      toast({
        title: "Success",
        description: "Memory created successfully",
      });
      
      return memory;
    } catch (err) {
      const errorMessage = err.message || 'Failed to create memory';
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
      
      // Mock update - just update in local state
      setMemories(prev => prev.map(memory => 
        memory.id === memoryId ? { ...memory, ...updates, updated_at: new Date().toISOString() } : memory
      ));
      
      toast({
        title: "Success",
        description: "Memory updated successfully",
      });
      
      return memories.find(m => m.id === memoryId);
    } catch (err) {
      const errorMessage = err.message || 'Failed to update memory';
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
  }, [memories, toast]);

  const deleteMemory = useCallback(async (memoryId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock delete - just remove from local state
      setMemories(prev => prev.filter(memory => memory.id !== memoryId));
      
      toast({
        title: "Success",
        description: "Memory deleted successfully",
      });
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete memory';
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
      
      const results = memories.filter(memory =>
        memory.title.toLowerCase().includes(query.toLowerCase()) ||
        memory.content.toLowerCase().includes(query.toLowerCase()) ||
        memory.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, limit);
      
      return results;
    } catch (err) {
      const errorMessage = err.message || 'Failed to search memories';
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
  }, [memories, toast]);

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
    refetch: fetchMemories
  };
};