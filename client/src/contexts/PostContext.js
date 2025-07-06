import React, { createContext, useContext } from 'react';
import { usePosts as usePostsHook } from '../hooks/usePosts';

const PostContext = createContext();

export function PostProvider({ children }) {
  const posts = usePostsHook();

  return (
    <PostContext.Provider value={posts}>
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
} 