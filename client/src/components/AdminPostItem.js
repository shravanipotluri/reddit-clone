import React, { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function AdminPostItem({ post, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await onDelete(post._id);
      if (!result.success) {
        alert(result.error || 'Failed to delete post');
      }
    } catch (error) {
      alert('Error deleting post');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow border p-4 ${!post.isActive ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">u/{post.author?.username || 'unknown'}</span>
          <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</span>
          {!post.isActive && (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">DELETED</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-700">
            Score: {post.score || 0}
          </span>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={deleting || !post.isActive}
            className={`p-2 rounded-full transition-colors ${
              deleting || !post.isActive
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-red-100 text-red-600 hover:bg-red-200'
            }`}
            title="Delete post"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {post.content && (
        <div className="mb-2 text-gray-900">{post.content}</div>
      )}
      
      {post.link && (
        <a 
          href={post.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline text-sm"
        >
          {post.link}
        </a>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Post</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`px-4 py-2 rounded ${
                  deleting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 