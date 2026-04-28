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
  const [loading, setLoading] = useState(true);

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
        message: `Repair completed: ${resolutionNote}`,
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

  const formatImageUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `http://localhost:8081${url}`;
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Technician Ticket Details
            </h1>
            <p className="text-slate-600 mt-1">
              Review assigned incident, add notes, and resolve the ticket
            </p>
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

      <div className="p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-slate-900 to-slate-700">
            <h2 className="text-2xl font-bold text-white">Ticket Overview</h2>
            <p className="text-sm text-slate-300 mt-1">
              Ticket details, status, evidence, comments, and resolution action
            </p>
          </div>

          <div className="p-8 space-y-8">
            {/* Ticket Details */}
            <section>
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">
                Ticket Details
              </h3>

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
                  <p className="text-xs font-medium text-slate-500">
                    Preferred Contact
                  </p>
                  <p className="text-base font-bold text-slate-900 mt-1">
                    {ticket.preferredContact || "N/A"}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-500">Reported By</p>
                  <p className="text-base font-bold text-slate-900 mt-1">
                    {ticket.createdByName || "N/A"}
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
            </section>

            {/* Status Summary */}
            <section>
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">
                Status Summary
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

                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-sm font-medium text-slate-500">
                    Assigned Technician
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {ticket.assignedTechnicianName || TECHNICIAN_NAME}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    Evidence Count
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {ticket.attachmentUrls?.length || 0}/3
                  </span>
                </div>

                {ticket.resolutionNotes && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <p className="text-sm font-bold text-emerald-700">
                      Resolution Notes
                    </p>
                    <p className="text-sm text-emerald-800 mt-1 whitespace-pre-wrap">
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

            {/* Comments */}
            <section>
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">
                Comments & Notes
              </h3>

              <CommentsSection
                ticketId={ticketId}
                comments={comments}
                currentUserName={TECHNICIAN_NAME}
                currentUserRole={TECHNICIAN_ROLE}
                onRefresh={load}
              />
            </section>

            {/* Resolve */}
            {!isResolved && (
              <section className="border-t border-slate-200 pt-6">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">
                  Resolution Action
                </h3>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                  <label className="block text-sm font-semibold text-emerald-900 mb-2">
                    Repair notes
                  </label>

                  <textarea
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    rows="4"
                    placeholder="e.g., Replaced damaged cable, system is now working normally..."
                  />

                  <button
                    onClick={resolveTicket}
                    className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-lg font-semibold text-sm transition"
                  >
                    Mark as Resolved
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianTicketDetail;