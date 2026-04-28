import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketAPI, commentAPI, activityLogAPI } from '../api/ticketService';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { Modal } from '../components/Modal';
import { CommentsSection } from '../components/CommentsSection';
import { ActivityLogTimeline } from '../components/ActivityLogTimeline';

export const TicketDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  // Modal states
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [attachmentsModalOpen, setAttachmentsModalOpen] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  // Form data
  const [assignData, setAssignData] = useState({ assignedTechnicianId: '', assignedTechnicianName: '' });
  const [statusData, setStatusData] = useState({ status: '' });
  const [rejectData, setRejectData] = useState({ rejectionReason: '' });
  const [resolveData, setResolveData] = useState({ resolutionNotes: '' });
  const [attachmentUrl, setAttachmentUrl] = useState('');

  const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

  const fetchTechnicians = async () => {
  try {
    const res = await fetch("http://localhost:8081/api/users");
    const data = await res.json();

    const techs = Array.isArray(data)
      ? data.filter((user) => user.role === "TECHNICIAN")
      : [];

    setTechnicians(techs);
  } catch (err) {
    console.log("Failed to load technicians", err);

    // fallback (optional)
    setTechnicians([]);
  }
};

  useEffect(() => {
    fetchTicketDetails();
    fetchTechnicians();
  }, [ticketId]);

  const fetchTicketDetails = async () => {
  setLoading(true);
  setError('');

  try {
    // 1. Get ticket (MAIN)
    const ticketData = await ticketAPI.getTicketById(ticketId);
    setTicket(ticketData);
    setStatusData({ status: ticketData?.status || '' });

    // 2. Try comments (optional)
    try {
      const commentsData = await commentAPI.getComments(ticketId);
      setComments(Array.isArray(commentsData) ? commentsData : []);
    } catch (e) {
      console.log("Comments not available yet");
      setComments([]);
    }

    // 3. Try logs (optional)
    try {
      const logsData = await activityLogAPI.getActivityLogs(ticketId);
      setLogs(Array.isArray(logsData) ? logsData : []);
    } catch (e) {
      console.log("Logs not available yet");
      setLogs([]);
    }

  } catch (err) {
    setError("Failed to load ticket");
  } finally {
    setLoading(false);
  }
};

  const handleAssignTechnician = async () => {
  if (!assignData.assignedTechnicianId || !assignData.assignedTechnicianName) {
    alert("Please select a technician");
    return;
  }

  console.log("Assign technician payload:", assignData);

  try {
    const updated = await ticketAPI.assignTechnician(ticketId, {
      assignedTechnicianId: assignData.assignedTechnicianId,
      assignedTechnicianName: assignData.assignedTechnicianName,
    });

    setTicket(updated);
    setAssignModalOpen(false);
    setAssignData({ assignedTechnicianId: "", assignedTechnicianName: "" });
    fetchTicketDetails();
  } catch (err) {
    console.error("Assign technician error:", err);
    alert(err.message || "Failed to assign technician");
  }
};

  const handleUpdateStatus = async () => {
    if (!statusData.status) {
      alert('Please select a status');
      return;
    }

    try {
      const updated = await ticketAPI.updateTicketStatus(ticketId, statusData);
      setTicket(updated);
      setStatusModalOpen(false);
      fetchTicketDetails();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleReject = async () => {
    if (!rejectData.rejectionReason.trim()) {
      alert('Please enter rejection reason');
      return;
    }

    try {
      const updated = await ticketAPI.rejectTicket(ticketId, rejectData);
      setTicket(updated);
      setRejectModalOpen(false);
      setRejectData({ rejectionReason: '' });
      fetchTicketDetails();
    } catch (err) {
      alert(err.message || 'Failed to reject ticket');
    }
  };

  const handleResolve = async () => {
    if (!resolveData.resolutionNotes.trim()) {
      alert('Please enter resolution notes');
      return;
    }

    try {
      const updated = await ticketAPI.resolveTicket(ticketId, resolveData);
      setTicket(updated);
      setResolveModalOpen(false);
      setResolveData({ resolutionNotes: '' });
      fetchTicketDetails();
    } catch (err) {
      alert(err.message || 'Failed to resolve ticket');
    }
  };

  const handleAddAttachment = async () => {
    if (!attachmentUrl.trim()) {
      alert('Please enter attachment URL');
      return;
    }

    try {
      const attachments = ticket.attachmentUrls || [];
      if (attachments.length >= 3) {
        alert('Maximum 3 attachments allowed');
        return;
      }

      const updated = await ticketAPI.addAttachments(ticketId, {
        attachmentUrls: [...attachments, attachmentUrl],
      });
      setTicket(updated);
      setAttachmentsModalOpen(false);
      setAttachmentUrl('');
      fetchTicketDetails();
    } catch (err) {
      alert(err.message || 'Failed to add attachment');
    }
  };

  const handleDeleteTicket = async () => {
    if (!window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      return;
    }

    try {
      await ticketAPI.deleteTicket(ticketId);
      alert('Ticket deleted successfully');
      navigate('/admin/tickets')
    } catch (err) {
      alert(err.message || 'Failed to delete ticket');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading ticket details...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="bg-red-100 text-red-700 p-6 rounded-lg max-w-2xl">
          <p className="font-medium mb-4">{error || 'Ticket not found'}</p>
          <button
            onClick={() => navigate('/admin/tickets')}
            className="text-blue-600 underline font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
  Incident Ticket Details
</h1>
<p className="text-slate-600 mt-1">
  Review, assign, and manage this incident report
</p>
          </div>
          <button
            onClick={() => navigate('/admin/tickets')}
            className="text-slate-600 hover:text-slate-900 font-medium transition"
          >
            ← Back
          </button>
        </div>

        {/* Status and Priority Badges */}
        <div className="flex gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Tabs */}
        <div className="bg-white border-b border-slate-200 mb-6 rounded-t-2xl">
          <div className="flex gap-4 px-6">
            {['details', 'comments', 'activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-4 font-medium transition border-b-2 ${ activeTab === tab
                    ? 'text-blue-600 border-blue-600'
                    : 'text-slate-600 border-transparent hover:text-slate-900'
                }`}
              >
                {tab === 'details' && '📋'}
                {tab === 'comments' && '💬'}
                {tab === 'activity' && '📊'}
                {' '}{tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-5xl">
          {/* Details Tab */}
          {activeTab === "details" && (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
    {/* Header */}
    <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-700">
      <h2 className="text-2xl font-bold text-white">Ticket Overview</h2>
      <p className="text-sm text-slate-300 mt-1">
        Complete incident details, assignment status, evidence, and timeline
      </p>
    </div>

    <div className="p-8 space-y-8">
      {/* Ticket Information */}
      <section>
        <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">
          Ticket Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-500">Resource Name</p>
            <p className="text-base font-bold text-slate-900 mt-1">
              {ticket.resourceName || "N/A"}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-500">Resource Code</p>
            <p className="text-base font-bold text-slate-900 mt-1">
              {ticket.resourceCode || "N/A"}
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
        </div>
      </section>

      {/* Description */}
      <section>
        <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">
          Description
        </h3>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <p className="text-base text-slate-800 leading-7 whitespace-pre-wrap">
            {ticket.description || "No description provided"}
          </p>
        </div>
      </section>

      {/* Status + Creator */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">
            Status & Assignment
          </h3>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-sm font-medium text-slate-500">Status</span>
              <StatusBadge status={ticket.status} />
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-sm font-medium text-slate-500">Priority</span>
              <PriorityBadge priority={ticket.priority} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Assigned Technician
              </span>
              <span className="text-sm font-bold text-slate-900">
                {ticket.assignedTechnicianName || "Unassigned"}
              </span>
            </div>

            {ticket.rejectionReason && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm font-bold text-red-700">Rejection Reason</p>
                <p className="text-sm text-red-800 mt-1">
                  {ticket.rejectionReason}
                </p>
              </div>
            )}

            {ticket.resolutionNotes && (
              <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <p className="text-sm font-bold text-emerald-700">
                  Resolution Notes
                </p>
                <p className="text-sm text-emerald-800 mt-1">
                  {ticket.resolutionNotes}
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">
            Creator Information
          </h3>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-sm font-medium text-slate-500">Name</span>
              <span className="text-sm font-bold text-slate-900">
                {ticket.createdByName || "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-sm font-medium text-slate-500">Role</span>
              <span className="text-sm font-bold text-slate-900">
                {ticket.createdByRole || "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Preferred Contact
              </span>
              <span className="text-sm font-bold text-slate-900">
                {ticket.preferredContact || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Evidence + Timeline */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">
            Evidence Photos
          </h3>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 min-h-[180px]">
            {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ticket.attachmentUrls.map((url, idx) => {
                  const imageUrl =
                    url && url.startsWith("http")
                      ? url
                      : `http://localhost:8081${url}`;

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
        </div>

        <div>
          <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">
            Timeline
          </h3>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-500">Created At</p>
              <p className="text-base font-bold text-slate-900 mt-1">
                {formatDate(ticket.createdAt)}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-sm font-medium text-slate-500">Updated At</p>
              <p className="text-base font-bold text-slate-900 mt-1">
                {formatDate(ticket.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Actions */}
      <section className="border-t border-slate-200 pt-6">
        <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">
          Admin Actions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setAssignModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-sm transition"
          >
            Assign Technician
          </button>

          <button
            onClick={() => setStatusModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold text-sm transition"
          >
            Update Status
          </button>

          <button
            onClick={() => setRejectModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold text-sm transition"
          >
            Reject Ticket
          </button>

          <button
            onClick={() => setResolveModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold text-sm transition"
          >
            Resolve Ticket
          </button>

          <button
            onClick={handleDeleteTicket}
            className="bg-slate-700 hover:bg-slate-800 text-white py-3 rounded-lg font-semibold text-sm transition md:col-span-2"
          >
            Delete Ticket
          </button>
        </div>
      </section>
    </div>
  </div>
)}
          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <CommentsSection
                ticketId={ticketId}
                comments={comments}
                currentUserName="Admin"
                currentUserRole="ADMIN"
              />
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && <ActivityLogTimeline logs={logs} />}
        </div>
      </div>

      {/* Modals */}

      {/* Assign Technician Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="👤 Assign Technician"
        footer={
          <>
            <button
              onClick={() => setAssignModalOpen(false)}
              className="px-4 py-2 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleAssignTechnician}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Assign
            </button>
          </>
        }
      >
        
          <select
  value={assignData.assignedTechnicianId}
  onChange={(e) => {
    const selected = technicians.find(
      (t) => String(t.userId || t.id) === String(e.target.value)
    );

    setAssignData({
      assignedTechnicianId: selected?.userId || selected?.id || "",
      assignedTechnicianName: selected?.userName || selected?.name || "",
    });
  }}
  className="w-full px-4 py-3 border border-slate-300 rounded-lg"
>
  <option value="">-- Select Technician --</option>

  {technicians.map((tech) => {
    const techId = tech.userId || tech.id;
    const techName = tech.userName || tech.name;

    return (
      <option key={techId} value={techId}>
        {techName}
      </option>
    );
  })}
</select>
      </Modal>

      {/* Update Status Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="⚙️ Update Status"
        footer={
          <>
            <button
              onClick={() => setStatusModalOpen(false)}
              className="px-4 py-2 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateStatus}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Update
            </button>
          </>
        }
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">New Status</label>
          <select
            value={statusData.status}
            onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="❌ Reject Ticket"
        footer={
          <>
            <button
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              Reject
            </button>
          </>
        }
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Rejection Reason</label>
          <textarea
            value={rejectData.rejectionReason}
            onChange={(e) => setRejectData({ ...rejectData, rejectionReason: e.target.value })}
            placeholder="Enter reason for rejection"
            rows="4"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>
      </Modal>

      {/* Resolve Modal */}
      <Modal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title="✓ Resolve Ticket"
        footer={
          <>
            <button
              onClick={() => setResolveModalOpen(false)}
              className="px-4 py-2 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleResolve}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
            >
              Resolve
            </button>
          </>
        }
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Resolution Notes</label>
          <textarea
            value={resolveData.resolutionNotes}
            onChange={(e) => setResolveData({ ...resolveData, resolutionNotes: e.target.value })}
            placeholder="Enter resolution details"
            rows="4"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>
      </Modal>

      {/* Add Attachment Modal */}
      <Modal
        isOpen={attachmentsModalOpen}
        onClose={() => setAttachmentsModalOpen(false)}
        title="📎 Add Attachment"
        footer={
          <>
            <button
              onClick={() => setAttachmentsModalOpen(false)}
              className="px-4 py-2 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleAddAttachment}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
            >
              Add
            </button>
          </>
        }
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Attachment URL ({(ticket.attachmentUrls?.length || 0)}/3)
          </label>
          <input
            type="text"
            value={attachmentUrl}
            onChange={(e) => setAttachmentUrl(e.target.value)}
            placeholder="Enter attachment URL"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
          <p className="text-xs text-slate-500 mt-2">Maximum 3 attachments per ticket</p>
        </div>
      </Modal>
    </div>
  );
}
