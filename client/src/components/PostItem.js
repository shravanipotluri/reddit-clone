import React, { useState } from 'react';
import { usePosts } from '../contexts/PostContext';
import { ArrowUpIcon, ArrowDownIcon, LinkIcon } from '@heroicons/react/24/outline';

export default function PostItem({ post: initialPost }) {
  const { posts, upvotePost, downvotePost } = usePosts();
  const [voting, setVoting] = useState(false);
  
  const post = posts.find(p => p._id === initialPost._id) || initialPost;
  


  const handleUpvote = async () => {
    if (voting) return;
    setVoting(true);
    try {
      const result = await upvotePost(post._id);
      if (!result.success) {
        console.error('Upvote failed:', result.error);
      }
    } catch (error) {
      console.error('Unexpected upvote error:', error);
    } finally {
      setVoting(false);
    }
  };

  const handleDownvote = async () => {
    if (voting) return;
    setVoting(true);
    try {
      const result = await downvotePost(post._id);
      if (!result.success) {
        console.error('Downvote failed:', result.error);
      }
    } catch (error) {
      console.error('Unexpected downvote error:', error);
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="flex bg-white rounded-lg shadow border border-gray-200 p-3 sm:p-4 items-start">
      <div className="flex flex-col items-center mr-3 sm:mr-4 flex-shrink-0">
        <button
          className={`text-gray-400 hover:text-orange-500 p-1 ${voting ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleUpvote}
          disabled={voting}
          aria-label="Upvote"
        >
          <ArrowUpIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <span className="font-bold text-gray-700 text-sm sm:text-base">{post.score || 0}</span>
        <button
          className={`text-gray-400 hover:text-blue-500 p-1 ${voting ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleDownvote}
          disabled={voting}
          aria-label="Downvote"
        >
          <ArrowDownIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center mb-2 text-xs text-gray-500">
          <span className="font-semibold mr-0 sm:mr-2 mb-1 sm:mb-0">u/{post.author?.username || 'unknown'}</span>
          <span className="text-gray-400">{new Date(post.createdAt).toLocaleString()}</span>
        </div>
        
        {post.content && (
          <div className="mb-2 text-gray-900 text-sm sm:text-base break-words">
            {post.content}
          </div>
        )}
        
        {post.link && (
          <a 
            href={post.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-blue-600 hover:underline text-sm break-all"
          >
            <LinkIcon className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{post.link}</span>
          </a>
        )}
      </div>
    </div>
  );
} 