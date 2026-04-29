import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ticketAPI, commentAPI } from "../api/ticketService";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";
import { CommentsSection } from "../components/CommentsSection";

const UserTicketDetail = () => {
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

  if (loading) return <div className="p-8 text-gray-700">Loading ticket...</div>;

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

  const InfoCard = ({ label, value }) => (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value || "N/A"}</p>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-6 mb-8">
  <div className="flex justify-between items-center">

    {/* LEFT SIDE */}
    <div>
      <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
        My Tickets
      </h1>

      <p className="text-slate-500 mt-1 text-sm">
        Track and manage your submitted incident request
      </p>

      <div className="flex gap-2 mt-4">
        <StatusBadge status={ticket.status} />
        <PriorityBadge priority={ticket.priority} />
      </div>
    </div>

    {/* RIGHT SIDE */}
    <button
      onClick={() => navigate("/user/tickets/list")}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-slate-700 hover:bg-gray-100 transition font-medium"
    >
      ← Back
    </button>

  </div>
</div>

      <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Ticket Overview</h2>
          <p className="text-xs text-gray-300 mt-1">
            View all ticket details, status, evidence, and actions
          </p>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <h3 className="text-xs font-semibold text-blue-600 uppercase mb-3 text-center">
              Ticket Details
            </h3>

            {!editMode ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <InfoCard label="Resource" value={ticket.resourceName || ticket.resourceOrLocation} />
                  <InfoCard label="Location" value={ticket.location || ticket.resourceOrLocation} />
                  <InfoCard label="Category" value={ticket.category} />
                  <InfoCard label="Contact" value={ticket.preferredContact} />
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Description</p>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-800">
                    {ticket.description}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editData.resourceOrLocation}
                  onChange={(e) =>
                    setEditData({ ...editData, resourceOrLocation: e.target.value })
                  }
                  className="w-full px-4 py-3 border rounded-lg"
                  placeholder="Location / Resource"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={editData.category}
                    onChange={(e) =>
                      setEditData({ ...editData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border rounded-lg"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <select
                    value={editData.priority}
                    onChange={(e) =>
                      setEditData({ ...editData, priority: e.target.value })
                    }
                    className="w-full px-4 py-3 border rounded-lg"
                  >
                    {priorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  rows="4"
                  className="w-full px-4 py-3 border rounded-lg"
                  placeholder="Description"
                />

                <input
                  type="text"
                  value={editData.preferredContact}
                  onChange={(e) =>
                    setEditData({ ...editData, preferredContact: e.target.value })
                  }
                  className="w-full px-4 py-3 border rounded-lg"
                  placeholder="Preferred Contact"
                />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xs font-semibold text-blue-600 uppercase mb-3 text-center">
              Status
            </h3>

            <div className="bg-gray-50 p-5 rounded-lg text-sm max-w-xl mx-auto">
              <div className="grid grid-cols-2 items-center gap-y-4">
                <span className="text-gray-500">Current</span>
                <div className="flex justify-center">
                  <StatusBadge status={ticket.status} />
                </div>

                <span className="text-gray-500">Priority</span>
                <div className="flex justify-center">
                  <PriorityBadge priority={ticket.priority} />
                </div>

                <span className="text-gray-500">Technician</span>
                <div className="text-center font-medium text-gray-700">
                  {ticket.assignedTechnicianName || "Not assigned"}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-blue-600 uppercase mb-3 text-center">
              Evidence Photos
            </h3>

            {ticket.attachmentUrls?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ticket.attachmentUrls.map((url, i) => (
                  <a
                    href={formatImageUrl(url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={i}
                  >
                    <img
                      src={formatImageUrl(url)}
                      className="rounded-lg object-cover h-28 w-full border"
                      alt={`Evidence ${i + 1}`}
                    />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center">No images</p>
            )}
          </div>

          <div>
            <h3 className="text-xs font-semibold text-blue-600 uppercase mb-3 text-center">
              Comments & Notes
            </h3>

            <CommentsSection
              ticketId={ticketId}
              comments={comments}
              currentUserName="User"
              currentUserRole="USER"
            />
          </div>

          <div>
            <h3 className="text-xs font-semibold text-blue-600 uppercase mb-3 text-center">
              User Actions
            </h3>

            {!canEditOrDelete && (
              <p className="text-sm text-gray-500 text-center mb-3">
                This ticket can no longer be edited or deleted because its status is {ticket.status}.
              </p>
            )}

            {!editMode ? (
              <div className="grid md:grid-cols-2 gap-3 max-w-xl mx-auto">
                <button
                  disabled={!canEditOrDelete}
                  onClick={() => setEditMode(true)}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg text-sm"
                >
                  Edit Ticket
                </button>

                <button
                  disabled={!canEditOrDelete}
                  onClick={handleDeleteTicket}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 rounded-lg text-sm"
                >
                  Delete Ticket
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-3 max-w-xl mx-auto">
                <button
                  onClick={handleUpdateTicket}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm"
                >
                  Save Changes
                </button>

                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTicketDetail;