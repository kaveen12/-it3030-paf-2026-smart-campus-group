import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ticketAPI, commentAPI } from "../api/ticketService";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";
import { CommentsSection } from "../components/CommentsSection";

const TECHNICIAN_NAME = "Kasun Technician";
const TECHNICIAN_ROLE = "TECHNICIAN";

export const TechnicianTicketDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [resolutionNote, setResolutionNote] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    load();
  }, [ticketId]);

  const load = async () => {
    setLoading(true);

    try {
      const ticketData = await ticketAPI.getTicketById(ticketId);
      setTicket(ticketData);

      try {
        const commentData = await commentAPI.getComments(ticketId);
        setComments(Array.isArray(commentData) ? commentData : []);
      } catch {
        setComments([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const resolveTicket = async () => {
    if (!resolutionNote.trim()) {
      alert("Please enter a repair note before marking as resolved");
      return;
    }

    try {
      await commentAPI.createComment(ticketId, {
        authorName: TECHNICIAN_NAME,
        authorRole: TECHNICIAN_ROLE,
        message: `✓ Repair completed: ${resolutionNote}`,
      });

      await ticketAPI.resolveTicket(ticketId, {
        resolutionNotes: resolutionNote,
      });

      setResolutionNote("");
      alert("Ticket marked as resolved successfully");
      load();
    } catch (err) {
      alert("Failed to resolve ticket: " + err.message);
    }
  };

  const addAttachment = async () => {
    if (!attachmentUrl.trim()) {
      alert("Please enter attachment URL");
      return;
    }

    if ((ticket.attachmentUrls?.length || 0) >= 3) {
      alert("Maximum 3 attachments allowed");
      return;
    }

    try {
      await ticketAPI.addAttachments(ticketId, {
        attachmentUrls: [attachmentUrl],
      });

      setAttachmentUrl("");
      alert("Attachment added successfully");
      load();
    } catch (err) {
      alert("Failed to add attachment: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-700">Loading ticket...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-8 bg-slate-50 min-h-screen">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          Ticket not found
        </div>
      </div>
    );
  }

  const isResolved = ticket.status === "RESOLVED" || ticket.status === "CLOSED";
  const canAddAttachment = (ticket.attachmentUrls?.length || 0) < 3 && !isResolved;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">🔧 {ticket.category}</h1>
            <p className="text-slate-600 mt-1">Ticket #{ticket.id?.substring(0, 8)} • Assigned to you</p>
          </div>

          <button
            onClick={() => navigate("/technician/tickets")}
            className="text-slate-600 hover:text-slate-900 font-medium transition"
          >
            ← Back
          </button>
        </div>

        <div className="flex gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📋</span>
                <h2 className="text-lg font-semibold text-slate-900">Ticket Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Resource</p>
                  <p className="font-medium text-slate-900 mt-1">
                    {ticket.resourceName || ticket.resourceOrLocation || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 font-medium">Location</p>
                  <p className="font-medium text-slate-900 mt-1">
                    {ticket.location || ticket.resourceOrLocation || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 font-medium">Preferred Contact</p>
                  <p className="font-medium text-slate-900 mt-1">
                    {ticket.preferredContact || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 font-medium">Reported By</p>
                  <p className="font-medium text-slate-900 mt-1">
                    {ticket.createdByName || "N/A"}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm text-slate-500 font-medium">Description</p>
                  <p className="font-medium text-slate-900 mt-1 whitespace-pre-wrap leading-relaxed">
                    {ticket.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Attachments Card */}
            {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">📸</span>
                  <h2 className="text-lg font-semibold text-slate-900">Evidence Photos</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {ticket.attachmentUrls.map((url, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden bg-slate-100 border border-slate-200 aspect-square hover:shadow-md transition">
                      <img
                        src={url}
                        alt={`Evidence ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "flex";
                        }}
                      />
                      <div
                        style={{ display: "none" }}
                        className="absolute inset-0 bg-slate-50 flex items-center justify-center text-center p-2"
                      >
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                        >
                          View Image
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <CommentsSection
              ticketId={ticketId}
              comments={comments}
              currentUserName={TECHNICIAN_NAME}
              currentUserRole={TECHNICIAN_ROLE}
              onRefresh={load}
            />

            {/* Resolution Card */}
            {!isResolved && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">✅</span>
                  <h2 className="text-lg font-semibold text-slate-900">Mark as Resolved</h2>
                </div>

                <p className="text-sm text-slate-600 mb-3">Describe the repair work completed:</p>
                <textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="e.g., Replaced broken projector bulb, system now working normally..."
                />

                <button
                  onClick={resolveTicket}
                  className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-lg font-medium transition"
                >
                  ✓ Mark as Resolved
                </button>
              </div>
            )}

            {/* Add Evidence Card */}
            {canAddAttachment && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">📸</span>
                  <h2 className="text-lg font-semibold text-slate-900">Add Evidence Photo</h2>
                </div>

                <p className="text-sm text-slate-600 mb-3">
                  Attachments: <span className="font-semibold">{ticket.attachmentUrls?.length || 0}/3</span>
                </p>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={attachmentUrl}
                    onChange={(e) => setAttachmentUrl(e.target.value)}
                    placeholder="Paste image URL"
                    className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    onClick={addAttachment}
                    disabled={!attachmentUrl.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-5 py-3 rounded-lg font-medium transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📊</span>
                <h2 className="text-lg font-semibold text-slate-900">Status Summary</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Current Status</p>
                  <p className="font-semibold text-slate-900 mt-1">{ticket.status}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 font-medium">Priority</p>
                  <p className="font-semibold text-slate-900 mt-1">{ticket.priority}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 font-medium">Assigned Technician</p>
                  <p className="font-semibold text-slate-900 mt-1">
                    {ticket.assignedTechnicianName || TECHNICIAN_NAME}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 font-medium">Evidence Count</p>
                  <p className="font-semibold text-slate-900 mt-1">{ticket.attachmentUrls?.length || 0}/3</p>
                </div>
              </div>
            </div>

            {/* Resolution Notes Card */}
            {ticket.resolutionNotes && (
              <div className="bg-emerald-50 rounded-2xl shadow-sm border border-emerald-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">✓</span>
                  <h2 className="text-lg font-semibold text-emerald-900">Resolution Notes</h2>
                </div>
                <p className="text-emerald-700 whitespace-pre-wrap leading-relaxed">
                  {ticket.resolutionNotes}
                </p>
              </div>
            )}

            {/* Info Card */}
            <div className="bg-blue-50 rounded-2xl shadow-sm border border-blue-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">ℹ️</span>
                <h3 className="font-semibold text-blue-900">Tips</h3>
              </div>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>✓ Always add evidence photos</li>
                <li>✓ Write clear notes before resolving</li>
                <li>✓ Update status for tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianTicketDetail;