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

  // Form data
  const [assignData, setAssignData] = useState({ assignedTechnicianId: '', assignedTechnicianName: '' });
  const [statusData, setStatusData] = useState({ status: '' });
  const [rejectData, setRejectData] = useState({ rejectionReason: '' });
  const [resolveData, setResolveData] = useState({ resolutionNotes: '' });
  const [attachmentUrl, setAttachmentUrl] = useState('');

  const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

  useEffect(() => {
    fetchTicketDetails();
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
    if (!assignData.assignedTechnicianName.trim()) {
      alert('Please enter technician name');
      return;
    }

    try {
      const updated = await ticketAPI.assignTechnician(ticketId, assignData);
      setTicket(updated);
      setAssignModalOpen(false);
      setAssignData({ assignedTechnicianId: '', assignedTechnicianName: '' });
      fetchTicketDetails();
    } catch (err) {
      alert(err.message || 'Failed to assign technician');
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
            <h1 className="text-3xl font-bold text-slate-900">🎫 Ticket #{ticket.id?.substring(0, 8)}</h1>
            <p className="text-slate-600 mt-1">Incident ticket management</p>
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
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Ticket Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📋</span>
                <h3 className="text-lg font-semibold text-slate-900">Ticket Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Resource Name</p>
                  <p className="font-medium text-slate-900 mt-1">{ticket.resourceName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Resource Code</p>
                  <p className="font-medium text-slate-900 mt-1">{ticket.resourceCode || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Location</p>
                  <p className="font-medium text-slate-900 mt-1">{ticket.location || ticket.resourceOrLocation || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Category</p>
                  <p className="font-medium text-slate-900 mt-1">{ticket.category}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📝</span>
                <h3 className="text-lg font-semibold text-slate-900">Description</h3>
              </div>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
            </div>

            {/* Status & Assignment */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚙️</span>
                <h3 className="text-lg font-semibold text-slate-900">Status & Assignment</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Status</p>
                  <p className="font-medium text-slate-900 mt-1">{ticket.status}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Assigned Technician</p>
                  <p className="font-medium text-slate-900 mt-1">{ticket.assignedTechnicianName || 'Unassigned'}</p>
                </div>
              </div>

              {ticket.rejectionReason && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
                  <p className="text-sm text-red-600 font-medium">Rejection Reason</p>
                  <p className="text-slate-900 mt-1">{ticket.rejectionReason}</p>
                </div>
              )}

              {ticket.resolutionNotes && (
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 mb-4">
                  <p className="text-sm text-emerald-600 font-medium">Resolution Notes</p>
                  <p className="text-slate-900 mt-1">{ticket.resolutionNotes}</p>
                </div>
              )}
            </div>

            {/* Creator Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">👤</span>
                <h3 className="text-lg font-semibold text-slate-900">Creator Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Name</p>
                  <p className="font-medium text-slate-900 mt-1">{ticket.createdByName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Role</p>
                  <p className="font-medium text-slate-900 mt-1">{ticket.createdByRole}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Preferred Contact</p>
                  <p className="font-medium text-slate-900 mt-1">{ticket.preferredContact}</p>
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">�</span>
                  <h3 className="text-lg font-semibold text-slate-900">Evidence Photos</h3>
                </div>
                {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {ticket.attachmentUrls.map((url, idx) => {
                      const imageUrl = url.startsWith('http') 
                        ? url 
                        : `http://localhost:8081${url}`;

                      return (
                        <div key={idx} className="relative group rounded-lg overflow-hidden bg-slate-100 border border-slate-200 aspect-square hover:shadow-md transition cursor-pointer">
                          <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                            <img
                              src={imageUrl}
                              alt={`Evidence ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:opacity-80 transition"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextElementSibling.style.display = "flex";
                              }}
                            />
                            <div
                              style={{ display: "none" }}
                              className="absolute inset-0 bg-slate-50 flex items-center justify-center text-center p-2"
                            >
                              <span className="text-blue-600 text-sm font-medium">View</span>
                            </div>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No photos attached</p>
                )}
            </div>

            {/* Timestamps */}
            {/* Timestamps */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🕐</span>
                  <h3 className="text-lg font-semibold text-slate-900">Timeline</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Created At</p>
                    <p className="font-medium text-slate-900 mt-1">{formatDate(ticket.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Updated At</p>
                    <p className="font-medium text-slate-900 mt-1">{formatDate(ticket.updatedAt)}</p>
                  </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🎯</span>
                  <h3 className="text-lg font-semibold text-slate-900">Admin Actions</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={() => setAssignModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium text-sm"
                  >
                    👤 Assign Tech
                  </button>
                  <button
                    onClick={() => setStatusModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition font-medium text-sm"
                  >
                    ⚙️ Update Status
                  </button>
                  <button
                    onClick={() => setRejectModalOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition font-medium text-sm"
                  >
                    ❌ Reject
                  </button>
                  <button
                    onClick={() => setResolveModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg transition font-medium text-sm"
                  >
                    ✓ Resolve
                  </button>
                  <button
                    onClick={() => setAttachmentsModalOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition font-medium text-sm disabled:bg-slate-400"
                    disabled={(ticket.attachmentUrls?.length || 0) >= 3}
                  >
                    📎 Add Image
                  </button>
                  <button
                    onClick={handleDeleteTicket}
                    className="bg-slate-600 hover:bg-slate-700 text-white py-2 rounded-lg transition font-medium text-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>
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
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Technician ID</label>
            <input
              type="text"
              value={assignData.assignedTechnicianId}
              onChange={(e) => setAssignData({ ...assignData, assignedTechnicianId: e.target.value })}
              placeholder="Enter technician ID (optional)"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Technician Name</label>
            <input
              type="text"
              value={assignData.assignedTechnicianName}
              onChange={(e) => setAssignData({ ...assignData, assignedTechnicianName: e.target.value })}
              placeholder="Enter technician name"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>
        </div>
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
};
