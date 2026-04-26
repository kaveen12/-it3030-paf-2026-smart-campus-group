import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ticketAPI, commentAPI } from "../api/ticketService";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";
import { CommentsSection } from "../components/CommentsSection";

const TECHNICIAN_NAME = "Kasun Technician";

export const TechnicianTicketDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [resolutionNote, setResolutionNote] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
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

    await commentAPI.createComment(ticketId, {
      authorName: TECHNICIAN_NAME,
      authorRole: "TECHNICIAN",
      message: `Repair completed: ${resolutionNote}`,
    });

    await ticketAPI.resolveTicket(ticketId, {
      resolutionNotes: resolutionNote,
    });

    setResolutionNote("");
    alert("Ticket marked as resolved");
    load();
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

    await ticketAPI.addAttachments(ticketId, {
      attachmentUrls: [attachmentUrl],
    });

    setAttachmentUrl("");
    alert("Attachment added");
    load();
  };

  if (loading) {
    return <div className="p-8 text-gray-700">Loading ticket...</div>;
  }

  if (!ticket) {
    return (
      <div className="p-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          Ticket not found
        </div>
      </div>
    );
  }

  const isResolved = ticket.status === "RESOLVED" || ticket.status === "CLOSED";

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {ticket.category}
            </h1>
            <p className="text-gray-600 mt-1">
              Ticket #{ticket.id?.substring(0, 8)} assigned to you
            </p>
          </div>

          <button
            onClick={() => navigate("/technician/tickets")}
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
          <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Ticket Details
            </h2>

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
                <p className="text-sm text-gray-600">Preferred Contact</p>
                <p className="font-medium text-gray-900">
                  {ticket.preferredContact || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Reported By</p>
                <p className="font-medium text-gray-900">
                  {ticket.createdByName || "N/A"}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Description</p>
                <p className="font-medium text-gray-900 whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </div>
            </div>
          </div>

          <CommentsSection
            ticketId={ticketId}
            comments={comments}
            currentUserName={TECHNICIAN_NAME}
            currentUserRole="TECHNICIAN"
          />

          <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Mark Work as Resolved
            </h2>

            <textarea
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              disabled={isResolved}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              rows="4"
              placeholder="Write repair note before resolving..."
            />

            <button
              onClick={resolveTicket}
              disabled={isResolved}
              className="mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg font-medium"
            >
              Mark as Resolved
            </button>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Add Attachment
            </h2>

            <p className="text-sm text-gray-600 mb-3">
              Attachments: {ticket.attachmentUrls?.length || 0}/3
            </p>

            <div className="flex gap-3">
              <input
                type="text"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                placeholder="Paste attachment URL"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={addAttachment}
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-medium"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Current Status
            </h2>

            <p className="text-sm text-gray-600">Status</p>
            <p className="font-semibold text-gray-900 mb-4">{ticket.status}</p>

            <p className="text-sm text-gray-600">Priority</p>
            <p className="font-semibold text-gray-900 mb-4">
              {ticket.priority}
            </p>

            <p className="text-sm text-gray-600">Assigned Technician</p>
            <p className="font-semibold text-gray-900">
              {ticket.assignedTechnicianName || TECHNICIAN_NAME}
            </p>
          </div>

          {ticket.resolutionNotes && (
            <div className="bg-green-50 rounded-xl shadow border border-green-200 p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-3">
                Resolution Note
              </h2>
              <p className="text-green-700 whitespace-pre-wrap">
                {ticket.resolutionNotes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};