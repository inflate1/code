import { useState, useEffect, useCallback } from 'react';
import { tasksAPI } from '../services/api';
import { useToast } from './use-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchTasks = useCallback(async (limit = 50, status = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await tasksAPI.list(limit, status);
      setTasks(data);
      
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch tasks';
      setError(errorMessage);
      console.error('Fetch tasks error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTaskById = useCallback(async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      
      const task = await tasksAPI.getById(taskId);
      
      return task;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to get task';
      setError(errorMessage);
      console.error('Get task error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelTask = useCallback(async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      
      await tasksAPI.cancel(taskId);
      
      // Update task status in list
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: 'cancelled' } : task
      ));
      
      toast({
        title: "Success",
        description: "Task cancelled successfully",
      });
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to cancel task';
      setError(errorMessage);
      toast({
        title: "Cancel Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getTaskStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const stats = await tasksAPI.getStats();
      
      return stats;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to get task statistics';
      setError(errorMessage);
      console.error('Task stats error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const pollTaskStatus = useCallback(async (taskId, onUpdate) => {
    const pollInterval = setInterval(async () => {
      try {
        const task = await tasksAPI.getById(taskId);
        
        onUpdate(task);
        
        // Stop polling if task is completed, failed, or cancelled
        if (['completed', 'failed', 'cancelled'].includes(task.status)) {
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.error('Poll task error:', err);
        clearInterval(pollInterval);
      }
    }, 2000); // Poll every 2 seconds
    
    return pollInterval;
  }, []);

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    getTaskById,
    cancelTask,
    getTaskStats,
    pollTaskStatus,
    refetch: fetchTasks
  };
};