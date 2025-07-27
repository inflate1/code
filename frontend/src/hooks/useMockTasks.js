import { useState, useEffect, useCallback } from 'react';
import { mockTaskService } from '../services/mockService';
import { useToast } from './use-toast';

export const useMockTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchTasks = useCallback(async (limit = 50, status = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await mockTaskService.list(limit, status);
      setTasks(data);
      
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch tasks';
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
      
      const task = await mockTaskService.getById(taskId);
      
      return task;
    } catch (err) {
      const errorMessage = err.message || 'Failed to get task';
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
      
      // Mock cancel - just update status in local state
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: 'cancelled' } : task
      ));
      
      toast({
        title: "Success",
        description: "Task cancelled successfully",
      });
    } catch (err) {
      const errorMessage = err.message || 'Failed to cancel task';
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
      
      const allTasks = await mockTaskService.list(1000);
      
      const stats = {
        total_tasks: allTasks.length,
        completion_rate: allTasks.length > 0 ? Math.round((allTasks.filter(t => t.status === 'completed').length / allTasks.length) * 100) : 0,
        status_breakdown: allTasks.reduce((acc, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        }, {}),
        type_breakdown: allTasks.reduce((acc, task) => {
          acc[task.task_type] = (acc[task.task_type] || 0) + 1;
          return acc;
        }, {}),
        active_tasks: allTasks.filter(t => ['processing', 'pending'].includes(t.status)).length
      };
      
      return stats;
    } catch (err) {
      const errorMessage = err.message || 'Failed to get task statistics';
      setError(errorMessage);
      console.error('Task stats error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const pollTaskStatus = useCallback(async (taskId, onUpdate) => {
    // Mock polling - simulate task progress updates
    const pollInterval = setInterval(async () => {
      try {
        const task = await mockTaskService.getById(taskId);
        
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