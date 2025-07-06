import React, { useState } from 'react';
import { PostProvider } from '../contexts/PostContext';
import Header from '../components/Header';
import PostFeed from '../components/PostFeed';
import NewPostForm from '../components/NewPostForm';

const Dashboard = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleCreatePostClick = () => {
    setShowCreatePost(true);
  };

  const handleHomeClick = () => {
    setShowCreatePost(false);
  };

  const handlePostSuccess = () => {
    setShowCreatePost(false);
  };

  const handleCloseForm = () => {
    setShowCreatePost(false);
  };

  return (
    <PostProvider>
      <Header 
        onCreatePostClick={handleCreatePostClick} 
        onHomeClick={handleHomeClick} 
        showCreatePost={showCreatePost}
      />
      <div className="max-w-4xl mx-auto mt-4 sm:mt-6 lg:mt-10 px-4 sm:px-6 lg:px-8">
        {showCreatePost ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Create a Post</h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                aria-label="Close form"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <NewPostForm onSuccess={handlePostSuccess} />
          </div>
        ) : (
          <PostFeed />
        )}
      </div>
    </PostProvider>
  );
};

export default Dashboard; 