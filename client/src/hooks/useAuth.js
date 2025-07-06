import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';
import { storage } from '../utils/helpers';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(storage.get('token'));
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (credentials) => {
    try {
      const data = await apiService.login(credentials);
      
      if (data.success) {
        const { token: authToken, user: userData } = data.data;
        storage.set('token', authToken);
        setToken(authToken);
        setUser(userData);
        return { success: true };
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const data = await apiService.register(userData);
      
      if (data.success) {
        const { token: authToken, user: newUser } = data.data;
        storage.set('token', authToken);
        setToken(authToken);
        setUser(newUser);
        return { success: true };
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    storage.remove('token');
    setToken(null);
    setUser(null);
  }, []);

  const verifyToken = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await apiService.getCurrentUser(token);
      if (data.success) {
        setUser(data.data);
      } else {
        throw new Error('Token verification failed');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  return {
    user,
    token,
    loading,
    login,
    register,
    logout,
  };
}; 