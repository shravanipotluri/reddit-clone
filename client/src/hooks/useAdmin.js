import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

export const useAdmin = () => {
  const [adminPosts, setAdminPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user } = useAuth();

  const fetchAdminPosts = useCallback(async () => {
    if (!user?.isAdmin) {
      setError('Admin access required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAdminPosts(token);
      setAdminPosts(data.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch admin posts');
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  const deletePost = useCallback(async (postId) => {
    if (!user?.isAdmin) {
      return { success: false, error: 'Admin access required' };
    }

    try {
      await apiService.deletePost(postId, token);
      setAdminPosts(prev => prev.filter(post => post._id !== postId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to delete post' };
    }
  }, [token, user]);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchAdminPosts();
    }
  }, [fetchAdminPosts, user]);

  return {
    adminPosts,
    loading,
    error,
    deletePost,
    refetchPosts: fetchAdminPosts,
    isAdmin: user?.isAdmin || false,
  };
}; 