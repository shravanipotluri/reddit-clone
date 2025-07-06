import React from 'react';
import { usePosts } from '../contexts/PostContext';
import PostItem from './PostItem';

export default function PostFeed() {
  const { posts, loading, error } = usePosts();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-2 text-gray-600">Loading posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p className="text-lg mb-2">No posts yet.</p>
        <p className="text-sm">Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => <PostItem key={post._id} post={post} />)}
    </div>
  );
} 