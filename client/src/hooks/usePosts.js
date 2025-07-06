import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  


  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getPosts();
      setPosts(data.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch posts');
      console.error('Fetch posts error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addPost = useCallback(async (postData) => {
    if (!token) {
      return { success: false, error: 'No authentication token available' };
    }
    
    try {
      const data = await apiService.createPost(postData, token);
      
      if (data.error) {
        return { success: false, error: data.message };
      }
      
      setPosts(prev => {
        const updated = [data.data, ...prev];
        return updated.sort((a, b) => b.score - a.score || new Date(b.createdAt) - new Date(a.createdAt));
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }, [token]);

  const upvotePost = useCallback(async (postId) => {
    if (!token) {
      return { success: false, error: 'No authentication token available' };
    }
    
    try {
      const data = await apiService.upvotePost(postId, token);
      
      if (data.error) {
        return { success: false, error: data.message };
      }
      
      setPosts(prev => {
        const updated = prev.map(post => 
          post._id === postId ? data.data : post
        );
        return updated.sort((a, b) => b.score - a.score || new Date(b.createdAt) - new Date(a.createdAt));
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }, [token]);

  const downvotePost = useCallback(async (postId) => {
    if (!token) {
      return { success: false, error: 'No authentication token available' };
    }
    
    try {
      const data = await apiService.downvotePost(postId, token);
      
      if (data.error) {
        return { success: false, error: data.message };
      }
      
      setPosts(prev => {
        const updated = prev.map(post => 
          post._id === postId ? data.data : post
        );
        return updated.sort((a, b) => b.score - a.score || new Date(b.createdAt) - new Date(a.createdAt));
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }, [token]);



  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    addPost,
    upvotePost,
    downvotePost,
    refetchPosts: fetchPosts,
  };
}; 