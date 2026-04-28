import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ticketAPI, commentAPI } from "../api/ticketService";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";
import { CommentsSection } from "../components/CommentsSection";

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
    attachmentUrls: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [newImageUrls, setNewImageUrls] = useState(["", "", ""]);

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
        attachmentUrls: ticketData.attachmentUrls || [],
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
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;

    try {
      await ticketAPI.deleteTicket(ticketId);
      alert("Ticket deleted successfully");
      navigate("/user/tickets/list");
    } catch (err) {
      alert(err.message || "Failed to delete ticket");
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-700">Loading ticket...</div>;
  }

  if (error || !ticket) {
    return (
      <div className="p-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error || "Ticket not found"}
        </div>
        <button
          onClick={() => navigate("/user/tickets/list")}
          className="mt-4 text-blue-600 underline font-medium"
        >
          Back to My Tickets
        </button>
      </div>
    );
  }

  const canEditOrDelete = ticket.status === "OPEN";

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow p-6 mb-6 border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Ticket #{ticket.id?.substring(0, 8)}
            </h1>
            <p className="text-gray-600 mt-1">
              Track your submitted incident ticket
            </p>
          </div>

          <button
            onClick={() => navigate("/user/tickets/list")}
            className="text-[#1e3a5f] font-medium hover:underline"
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
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ticket Details
            </h2>

            {!editMode ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <p className="text-sm text-gray-600">Resource</p>
                  <p className="font-medium text-gray-900">
                    {ticket.resourceName || ticket.resourceOrLocation || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">
                    {ticket.location || ticket.resourceOrLocation || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium text-gray-900">{ticket.category}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Preferred Contact</p>
                  <p className="font-medium text-gray-900">
                    {ticket.preferredContact}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-medium text-gray-900 whitespace-pre-wrap">
                    {ticket.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={editData.category}
                      onChange={(e) =>
                        setEditData({ ...editData, category: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={editData.priority}
                      onChange={(e) =>
                        setEditData({ ...editData, priority: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Attachments Section */}
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              📎 Attachments
            </h2>

            {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ticket.attachmentUrls.map((url, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden bg-gray-100 border border-gray-200 aspect-square">
                    <img
                      src={url}
                      alt={`Attachment ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "flex";
                      }}
                    />
                    <div
                      style={{ display: "none" }}
                      className="absolute inset-0 bg-gray-50 flex items-center justify-center text-center p-2"
                    >
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                      >
                        Open Image
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No attachments yet</p>
            )}
          </div>

          <CommentsSection
            ticketId={ticketId}
            comments={comments}
            currentUserName="User"
            currentUserRole="USER"
          />
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Status
            </h2>

            <p className="text-sm text-gray-600">Current Status</p>
            <p className="font-semibold text-gray-900 mb-4">{ticket.status}</p>

            <p className="text-sm text-gray-600">Assigned Technician</p>
            <p className="font-semibold text-gray-900 mb-4">
              {ticket.assignedTechnicianName || "Not assigned yet"}
            </p>

            {ticket.rejectionReason && (
              <>
                <p className="text-sm text-gray-600">Rejection Reason</p>
                <p className="font-semibold text-red-600 mb-4">
                  {ticket.rejectionReason}
                </p>
              </>
            )}

            {ticket.resolutionNotes && (
              <>
                <p className="text-sm text-gray-600">Resolution Notes</p>
                <p className="font-semibold text-green-600">
                  {ticket.resolutionNotes}
                </p>
              </>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              User Actions
            </h2>

            {!canEditOrDelete && (
              <p className="text-sm text-gray-600 mb-4">
                This ticket can no longer be edited or deleted because its
                status is {ticket.status}.
              </p>
            )}

            {!editMode ? (
              <button
                disabled={!canEditOrDelete}
                onClick={() => setEditMode(true)}
                className="w-full bg-[#2563eb] hover:bg-[#1e40af] disabled:bg-gray-400 text-white py-2 rounded-lg mb-3 font-medium transition"
              >
                Edit Ticket
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleUpdateTicket}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            )}

            <button
              disabled={!canEditOrDelete}
              onClick={handleDeleteTicket}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 rounded-lg mt-3 font-medium"
            >
              Delete Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTicketDetail;