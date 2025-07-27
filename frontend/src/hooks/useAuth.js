import { useState, useEffect, useContext, createContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
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

      const sessionData = await authAPI.getCurrentSession();
      setSession(sessionData);
      setUser(sessionData.user);
      setError(null);
    } catch (err) {
      console.error('Auth check failed:', err);
      setError(err.response?.data?.detail || 'Authentication failed');
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
      
      const response = await authAPI.login(credentials);
      
      setSession(response);
      setUser(response.user);
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Login failed';
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
      
      const response = await authAPI.createSession();
      
      setSession(response);
      setUser(response.user);
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Session creation failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setSession(null);
      setError(null);
    }
  };

  const value = {
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};