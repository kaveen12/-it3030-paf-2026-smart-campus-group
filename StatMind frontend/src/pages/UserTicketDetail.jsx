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

  const formatImageUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `http://localhost:8081${url}`;
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
      {/* Top Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              My Ticket Details
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              View and manage your submitted incident report
            </p>
          </div>

          <button
            onClick={() => navigate("/user/tickets/list")}
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
          >
            ← Back
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      {/* One Main Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-slate-900 to-slate-700">
          <h2 className="text-2xl font-bold text-white">Ticket Overview</h2>
          <p className="text-sm text-slate-300 mt-1">
            Ticket details, status, evidence, comments, and available actions
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Ticket Details */}
          <section>
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">
              Ticket Details
            </h3>

            {!editMode ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500">Resource</p>
                    <p className="text-base font-bold text-slate-900 mt-1">
                      {ticket.resourceName || ticket.resourceOrLocation || "N/A"}
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500">Location</p>
                    <p className="text-base font-bold text-slate-900 mt-1">
                      {ticket.location || ticket.resourceOrLocation || "N/A"}
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500">Category</p>
                    <p className="text-base font-bold text-slate-900 mt-1">
                      {ticket.category || "N/A"}
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500">
                      Preferred Contact
                    </p>
                    <p className="text-base font-bold text-slate-900 mt-1">
                      {ticket.preferredContact || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Description
                  </p>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <p className="text-base text-slate-800 leading-7 whitespace-pre-wrap">
                      {ticket.description || "No description provided"}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-xl p-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
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
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={editData.category}
                      onChange={(e) =>
                        setEditData({ ...editData, category: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={editData.priority}
                      onChange={(e) =>
                        setEditData({ ...editData, priority: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
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
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
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
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Status */}
          <section>
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">
              Status
            </h3>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm font-medium text-slate-500">
                  Current Status
                </span>
                <StatusBadge status={ticket.status} />
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm font-medium text-slate-500">
                  Priority
                </span>
                <PriorityBadge priority={ticket.priority} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">
                  Assigned Technician
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {ticket.assignedTechnicianName || "Not assigned yet"}
                </span>
              </div>

              {ticket.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm font-bold text-red-700">
                    Rejection Reason
                  </p>
                  <p className="text-sm text-red-800 mt-1">
                    {ticket.rejectionReason}
                  </p>
                </div>
              )}

              {ticket.resolutionNotes && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-sm font-bold text-emerald-700">
                    Resolution Notes
                  </p>
                  <p className="text-sm text-emerald-800 mt-1">
                    {ticket.resolutionNotes}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Evidence Photos */}
          <section>
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">
              Evidence Photos
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 min-h-[170px]">
              {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {ticket.attachmentUrls.map((url, idx) => {
                    const imageUrl = formatImageUrl(url);

                    return (
                      <a
                        key={idx}
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg overflow-hidden border border-slate-200 bg-white aspect-square hover:shadow-lg transition"
                      >
                        <img
                          src={imageUrl}
                          alt={`Evidence ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No photos attached</p>
              )}
            </div>
          </section>

          {/* Comments & Notes */}
          <section>
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">
              Comments & Notes
            </h3>

            <CommentsSection
              ticketId={ticketId}
              comments={comments}
              currentUserName="User"
              currentUserRole="USER"
              onRefresh={fetchTicketDetails}
            />
          </section>

          {/* User Actions */}
          <section className="border-t border-slate-200 pt-6">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">
              User Actions
            </h3>

            {!canEditOrDelete && (
              <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  This ticket can no longer be edited or deleted because its
                  status is <b>{ticket.status}</b>.
                </p>
              </div>
            )}

            {!editMode ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  disabled={!canEditOrDelete}
                  onClick={() => setEditMode(true)}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-3 rounded-lg font-semibold text-sm transition"
                >
                  Edit Ticket
                </button>

                <button
                  disabled={!canEditOrDelete}
                  onClick={handleDeleteTicket}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white py-3 rounded-lg font-semibold text-sm transition"
                >
                  Delete Ticket
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={handleUpdateTicket}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold text-sm transition"
                >
                  Save Changes
                </button>

                <button
                  onClick={() => setEditMode(false)}
                  className="bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-lg font-semibold text-sm transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};