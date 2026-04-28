import { useState, useEffect } from "react";
import { commentAPI } from "../api/ticketService";

export const CommentsSection = ({
  ticketId,
  comments: initialComments = [],
  currentUserName,
  currentUserRole,
  onRefresh,
}) => {
  const [comments, setComments] = useState(initialComments);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleAdd = async () => {
    if (!message.trim()) return;
    setLoading(true);

    try {
      const newComment = {
        authorName: currentUserName,
        authorRole: currentUserRole,
        message,
      };

      const saved = await commentAPI.createComment(ticketId, newComment);
      setComments([...comments, saved]);
      setMessage("");
      if (onRefresh) onRefresh();
    } catch (err) {
      alert("Failed to add comment: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    setLoading(true);

    try {
      await commentAPI.deleteComment(ticketId, id);
      setComments(comments.filter((c) => c.id !== id));
      if (onRefresh) onRefresh();
    } catch (err) {
      alert("Failed to delete comment: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    if (!editText.trim()) {
      alert("Comment cannot be empty");
      return;
    }
    setLoading(true);

    try {
      const updated = await commentAPI.updateComment(ticketId, id, {
        message: editText,
      });

      setComments(comments.map((c) => (c.id === id ? updated : c)));
      setEditingId(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert("Failed to update comment: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const roleColor = (role) => {
    if (role === "ADMIN") return "bg-red-100 text-red-600 border border-red-200";
    if (role === "TECHNICIAN") return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    return "bg-blue-100 text-blue-600 border border-blue-200";
  };

  const getRoleIcon = (role) => {
    if (role === "ADMIN") return "👤";
    if (role === "TECHNICIAN") return "🔧";
    return "👤";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">💬</span>
        <h2 className="text-lg font-semibold text-slate-900">Comments & Notes</h2>
      </div>

      {/* ADD COMMENT */}
      <div className="mb-6 pb-6 border-b border-slate-200">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
            {currentUserName?.[0]?.toUpperCase()}
          </div>

          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a comment or note..."
              rows="3"
              disabled={loading}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
            />

            <div className="mt-3 flex justify-end">
              <button
                onClick={handleAdd}
                disabled={!message.trim() || loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
              >
                {loading ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* COMMENTS LIST */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 text-sm">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((c) => {
            const isOwner =
              c.authorName === currentUserName &&
              c.authorRole === currentUserRole;

            return (
              <div key={c.id} className="flex gap-3 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {c.authorName?.[0]?.toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name + Role */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm text-slate-900">
                      {c.authorName}
                    </span>

                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${roleColor(c.authorRole)}`}>
                      {getRoleIcon(c.authorRole)} {c.authorRole}
                    </span>
                  </div>

                  {/* Message */}
                  {editingId === c.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        disabled={loading}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        rows="3"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(c.id)}
                          disabled={loading}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:text-slate-400"
                        >
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          disabled={loading}
                          className="text-slate-500 hover:text-slate-700 text-sm font-medium disabled:text-slate-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-700 break-words">{c.message}</p>
                  )}

                  {/* Actions */}
                  <div className="text-xs text-slate-500 mt-2 flex gap-3">
                    <span>
                      {new Date(c.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    {isOwner && editingId !== c.id && (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(c.id);
                            setEditText(c.message);
                          }}
                          disabled={loading}
                          className="text-blue-600 hover:text-blue-700 font-medium disabled:text-slate-400"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-700 font-medium disabled:text-slate-400"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};