import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ticketAPI, commentAPI } from "../api/ticketService";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";

export const UserTicketDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    resourceOrLocation: "",
    category: "",
    description: "",
    priority: "",
    preferredContact: "",
  });

  const [commentData, setCommentData] = useState({
    authorName: "User",
    authorRole: "USER",
    message: "",
  });

  const categories = [
    "Equipment Failure",
    "Network Issue",
    "Electrical Issue",
    "Room Damage",
    "Cleaning Issue",
    "Safety Hazard",
    "Other",
  ];

  const priorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    setLoading(true);
    setError("");

    try {
      const ticketData = await ticketAPI.getTicketById(ticketId);
      setTicket(ticketData);

      setEditData({
        resourceOrLocation: ticketData.resourceOrLocation || "",
        category: ticketData.category || "",
        description: ticketData.description || "",
        priority: ticketData.priority || "MEDIUM",
        preferredContact: ticketData.preferredContact || "",
      });

      try {
        const commentsData = await commentAPI.getComments(ticketId);
        setComments(Array.isArray(commentsData) ? commentsData : []);
      } catch {
        setComments([]);
      }
    } catch (err) {
      setError(err.message || "Failed to load ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTicket = async () => {
    try {
      const payload = {
        ...ticket,
        resourceOrLocation: editData.resourceOrLocation,
        category: editData.category,
        description: editData.description,
        priority: editData.priority,
        preferredContact: editData.preferredContact,
      };

      const updated = await ticketAPI.updateTicket(ticketId, payload);
      setTicket(updated);
      setEditMode(false);
      alert("Ticket updated successfully");
    } catch (err) {
      alert(err.message || "Failed to update ticket");
    }
  };

  const handleDeleteTicket = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmDelete) return;

    try {
      await ticketAPI.deleteTicket(ticketId);
      alert("Ticket deleted successfully");
      navigate("/user/tickets/list");
    } catch (err) {
      alert(err.message || "Failed to delete ticket");
    }
  };

  const handleAddComment = async () => {
    if (!commentData.authorName.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!commentData.message.trim()) {
      alert("Please enter a comment");
      return;
    }

    try {
      await commentAPI.createComment(ticketId, commentData);

      setCommentData({
        authorName: commentData.authorName,
        authorRole: "USER",
        message: "",
      });

      fetchTicketDetails();
    } catch (err) {
      alert(err.message || "Failed to add comment");
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Loading ticket...</div>;
  }

  if (error || !ticket) {
    return (
      <div className="p-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error || "Ticket not found"}
        </div>
        <button
          onClick={() => navigate("/user/tickets/list")}
          className="mt-4 text-blue-600 underline"
        >
          Back to My Tickets
        </button>
      </div>
    );
  }

  const canEditOrDelete = ticket.status === "OPEN";

  return (
    <div className="p-8">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Ticket #{ticket.id?.substring(0, 8)}
            </h1>
            <p className="text-gray-500 mt-1">
              Track your submitted incident ticket
            </p>
          </div>

          <button
            onClick={() => navigate("/user/tickets/list")}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
        </div>

        <div className="flex gap-2 mt-4">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Ticket Details</h2>

            {!editMode ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <p className="text-sm text-gray-500">Resource</p>
                  <p className="font-medium">
                    {ticket.resourceName || ticket.resourceOrLocation || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">
                    {ticket.location || ticket.resourceOrLocation || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{ticket.category}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Preferred Contact</p>
                  <p className="font-medium">{ticket.preferredContact}</p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-medium whitespace-pre-wrap">
                    {ticket.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location / Resource
                  </label>
                  <input
                    type="text"
                    value={editData.resourceOrLocation}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        resourceOrLocation: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Category
                    </label>
                    <select
                      value={editData.category}
                      onChange={(e) =>
                        setEditData({ ...editData, category: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Priority
                    </label>
                    <select
                      value={editData.priority}
                      onChange={(e) =>
                        setEditData({ ...editData, priority: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      {priorities.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        description: e.target.value,
                      })
                    }
                    rows="4"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Preferred Contact
                  </label>
                  <input
                    type="text"
                    value={editData.preferredContact}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        preferredContact: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Comments</h2>

            <div className="space-y-3 mb-6">
              {comments.length === 0 ? (
                <p className="text-gray-500">No comments yet.</p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-900">
                        {comment.authorName}
                        <span className="ml-2 text-xs text-gray-500">
                          {comment.authorRole}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {comment.createdAt
                          ? new Date(comment.createdAt).toLocaleString()
                          : ""}
                      </p>
                    </div>
                    <p className="mt-2 text-gray-700">{comment.message}</p>
                  </div>
                ))
              )}
            </div>

            <div className="border-t pt-4 space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={commentData.authorName}
                onChange={(e) =>
                  setCommentData({
                    ...commentData,
                    authorName: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <textarea
                placeholder="Write a comment..."
                value={commentData.message}
                onChange={(e) =>
                  setCommentData({
                    ...commentData,
                    message: e.target.value,
                  })
                }
                rows="3"
                className="w-full border rounded-lg px-3 py-2"
              />

              <button
                onClick={handleAddComment}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Status</h2>

            <p className="text-sm text-gray-500">Current Status</p>
            <p className="font-semibold mb-4">{ticket.status}</p>

            <p className="text-sm text-gray-500">Assigned Technician</p>
            <p className="font-semibold mb-4">
              {ticket.assignedTechnicianName || "Not assigned yet"}
            </p>

            {ticket.rejectionReason && (
              <>
                <p className="text-sm text-gray-500">Rejection Reason</p>
                <p className="font-semibold text-red-600 mb-4">
                  {ticket.rejectionReason}
                </p>
              </>
            )}

            {ticket.resolutionNotes && (
              <>
                <p className="text-sm text-gray-500">Resolution Notes</p>
                <p className="font-semibold text-green-600">
                  {ticket.resolutionNotes}
                </p>
              </>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">User Actions</h2>

            {!canEditOrDelete && (
              <p className="text-sm text-gray-500 mb-4">
                This ticket can no longer be edited or deleted because its
                status is {ticket.status}.
              </p>
            )}

            {!editMode ? (
              <button
                disabled={!canEditOrDelete}
                onClick={() => setEditMode(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg mb-3"
              >
                Edit Ticket
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleUpdateTicket}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}

            <button
              disabled={!canEditOrDelete}
              onClick={handleDeleteTicket}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 rounded-lg mt-3"
            >
              Delete Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};