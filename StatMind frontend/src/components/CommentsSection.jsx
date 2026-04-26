import { useState, useEffect } from "react";
import { commentAPI } from "../api/ticketService";

export const CommentsSection = ({
  ticketId,
  comments: initialComments = [],
  currentUserName,
  currentUserRole,
}) => {
  const [comments, setComments] = useState(initialComments);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleAdd = async () => {
    if (!message.trim()) return;

    const newComment = {
      authorName: currentUserName,
      authorRole: currentUserRole,
      message,
    };

    const saved = await commentAPI.createComment(ticketId, newComment);
    setComments([...comments, saved]);
    setMessage("");
  };

  const handleDelete = async (id) => {
    await commentAPI.deleteComment(ticketId, id);
    setComments(comments.filter((c) => c.id !== id));
  };

  const handleUpdate = async (id) => {
    const updated = await commentAPI.updateComment(ticketId, id, {
      message: editText,
    });

    setComments(comments.map((c) => (c.id === id ? updated : c)));
    setEditingId(null);
  };

  const roleColor = (role) => {
    if (role === "ADMIN") return "bg-red-100 text-red-600";
    if (role === "TECHNICIAN") return "bg-green-100 text-green-600";
    return "bg-blue-100 text-blue-600";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Comments</h2>

      {/* ADD COMMENT */}
      <div className="flex gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
          {currentUserName[0]}
        </div>

        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a comment..."
            className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={handleAdd}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            Post
          </button>
        </div>
      </div>

      {/* COMMENTS LIST */}
      <div className="space-y-4">
        {comments.map((c) => {
          const isOwner =
            c.authorName === currentUserName &&
            c.authorRole === currentUserRole;

          return (
            <div key={c.id} className="flex gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm">
                {c.authorName[0]}
              </div>

              <div className="flex-1">
                <div className="bg-gray-100 p-3 rounded-lg">
                  {/* Name + Role */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      {c.authorName}
                    </span>

                    <span
                      className={`text-xs px-2 py-0.5 rounded ${roleColor(
                        c.authorRole
                      )}`}
                    >
                      {c.authorRole}
                    </span>
                  </div>

                  {/* Message */}
                  {editingId === c.id ? (
                    <>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full border rounded p-2 text-sm"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleUpdate(c.id)}
                          className="text-blue-600 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-500 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-700">{c.message}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="text-xs text-gray-400 mt-1 flex gap-3">
                  <span>
                    {new Date(c.createdAt).toLocaleString()}
                  </span>

                  {isOwner && editingId !== c.id && (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(c.id);
                          setEditText(c.message);
                        }}
                        className="text-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};