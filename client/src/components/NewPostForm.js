import React, { useState } from 'react';
import { usePosts } from '../contexts/PostContext';

export default function NewPostForm({ onSuccess }) {
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { addPost } = usePosts();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && !link.trim()) {
      setError('Please provide either content or a link');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const result = await addPost({
        content: content.trim() || '',
        link: link.trim() || ''
      });

      if (result.error) {
        setError(result.error || 'Failed to create post');
      } else {
        setContent('');
        setLink('');
        setError('');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          rows="3"
          maxLength="1000"
        />
        <div className="text-xs text-gray-500 mt-1 text-right">
          {content.length}/1000
        </div>
      </div>

      <div>
        <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
          Link (optional)
        </label>
        <input
          id="link"
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          type="submit"
          disabled={submitting || (!content.trim() && !link.trim())}
          className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Posting...' : 'Post'}
        </button>
        
        <button
          type="button"
          onClick={() => {
            setContent('');
            setLink('');
            setError('');
          }}
          className="flex-1 sm:flex-none bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Clear
        </button>
      </div>
    </form>
  );
} 