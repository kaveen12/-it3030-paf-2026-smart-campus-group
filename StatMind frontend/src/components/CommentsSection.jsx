import { useState } from 'react';
import { commentAPI } from '../api/ticketService';

export const CommentsSection = ({ ticketId, comments: initialComments, onCommentAdded }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState({
    authorName: '',
    authorRole: 'USER',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleAddComment = async () => {
    if (!newComment.authorName.trim() || !newComment.message.trim()) {
      setError('Author name and message are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const createdComment = await commentAPI.createComment(ticketId, newComment);
      setComments([...comments, createdComment]);
      setNewComment({ authorName: '', authorRole: 'USER', message: '' });
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      setError(err.message || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentAPI.deleteComment(ticketId, commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      setError(err.message || 'Failed to delete comment');
    }
  };

  const handleEditComment = async (commentId) => {
    setLoading(true);
    setError('');

    try {
      const updatedComment = await commentAPI.updateComment(ticketId, commentId, editData);
      setComments(comments.map((c) => (c.id === commentId ? updatedComment : c)));
      setEditingId(null);
      setEditData({});
    } catch (err) {
      setError(err.message || 'Failed to update comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Comments</h3>

      {/* Add Comment Form */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-4">Add Comment</h4>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Your name"
            value={newComment.authorName}
            onChange={(e) => setNewComment({ ...newComment, authorName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={newComment.authorRole}
            onChange={(e) => setNewComment({ ...newComment, authorRole: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USER">User</option>
            <option value="TECHNICIAN">Technician</option>
            <option value="ADMIN">Admin</option>
          </select>

          <textarea
            placeholder="Your comment..."
            value={newComment.message}
            onChange={(e) => setNewComment({ ...newComment, message: e.target.value })}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleAddComment}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Adding...' : 'Add Comment'}
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
              {editingId === comment.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editData.message || comment.message}
                    onChange={(e) => setEditData({ ...editData, message: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditComment(comment.id)}
                      disabled={loading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditData({});
                      }}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{comment.authorName}</p>
                      <p className="text-xs text-gray-500">{comment.authorRole}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{comment.message}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditData({ message: comment.message });
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
