import { useState, useEffect } from 'react';
import { mockAuthService } from '../services/mockService';

export const useMockAuth = () => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('fileclerk_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const sessionData = await mockAuthService.getCurrentSession();
      setSession(sessionData);
      setUser(sessionData.user);
      setError(null);
    } catch (err) {
      console.error('Mock auth check failed:', err);
      setError(err.message || 'Authentication failed');
      // Clear invalid token
      localStorage.removeItem('fileclerk_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await mockAuthService.login(credentials);
      
      setSession(response);
      setUser(response.user);
      
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createSession = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await mockAuthService.createSession();
      
      setSession(response);
      setUser(response.user);
      
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Session creation failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await mockAuthService.logout();
    } catch (err) {
      console.error('Mock logout error:', err);
    } finally {
      setUser(null);
      setSession(null);
      setError(null);
    }
  };

  return {
    user,
    session,
    loading,
    error,
    login,
    logout,
    createSession,
    checkAuth,
    isAuthenticated: !!user
  };
};