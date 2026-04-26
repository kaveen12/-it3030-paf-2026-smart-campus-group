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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ticket #{ticket.id?.substring(0, 8)}</h1>
            <p className="text-gray-500 mt-1">Status: {ticket.status}</p>
          </div>
          <button
            onClick={() => navigate('/admin/tickets')}
            className="text-gray-600 hover:text-gray-900 font-medium"
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
        <div className="bg-white border-b border-gray-200 mb-6">
          <div className="flex gap-4">
            {['details', 'comments', 'activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium transition border-b-2 ${
                  activeTab === tab
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-4xl">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Ticket Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Resource Name</p>
                    <p className="font-medium text-gray-900">{ticket.resourceName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Resource Code</p>
                    <p className="font-medium text-gray-900">{ticket.resourceCode || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{ticket.location || ticket.resourceOrLocation || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium text-gray-900">{ticket.category}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
              </div>

              {/* Status & Assignment */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Assignment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium text-gray-900 mt-1">{ticket.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Assigned Technician</p>
                    <p className="font-medium text-gray-900 mt-1">{ticket.assignedTechnicianName || 'Unassigned'}</p>
                  </div>
                </div>

                {ticket.rejectionReason && (
                  <div className="bg-red-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-600">Rejection Reason</p>
                    <p className="text-gray-900 mt-1">{ticket.rejectionReason}</p>
                  </div>
                )}

                {ticket.resolutionNotes && (
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-600">Resolution Notes</p>
                    <p className="text-gray-900 mt-1">{ticket.resolutionNotes}</p>
                  </div>
                )}
              </div>

              {/* Creator Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Creator Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">{ticket.createdByName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="font-medium text-gray-900">{ticket.createdByRole}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Preferred Contact</p>
                    <p className="font-medium text-gray-900">{ticket.preferredContact}</p>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
                {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 ? (
                  <ul className="space-y-2">
                    {ticket.attachmentUrls.map((url, idx) => (
                      <li key={idx} className="text-blue-600 hover:underline">
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          Attachment {idx + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No attachments</p>
                )}
              </div>

              {/* Timestamps */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timestamps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Created At</p>
                    <p className="font-medium text-gray-900">{formatDate(ticket.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Updated At</p>
                    <p className="font-medium text-gray-900">{formatDate(ticket.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => setAssignModalOpen(true)}
                    className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Assign Technician
                  </button>
                  <button
                    onClick={() => setStatusModalOpen(true)}
                    className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={() => setRejectModalOpen(true)}
                    className="bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setResolveModalOpen(true)}
                    className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => setAttachmentsModalOpen(true)}
                    className="bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition font-medium disabled:bg-gray-400"
                    disabled={(ticket.attachmentUrls?.length || 0) >= 3}
                  >
                    Add Attachment
                  </button>
                  <button
                    onClick={handleDeleteTicket}
                    className="bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition font-medium"
                  >
                    Delete Ticket
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
  <CommentsSection
    ticketId={ticketId}
    comments={comments}
    currentUserName="Admin"
    currentUserRole="ADMIN"
  />
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
        title="Assign Technician"
        footer={
          <>
            <button
              onClick={() => setAssignModalOpen(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAssignTechnician}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Assign
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Technician ID</label>
            <input
              type="text"
              value={assignData.assignedTechnicianId}
              onChange={(e) => setAssignData({ ...assignData, assignedTechnicianId: e.target.value })}
              placeholder="Enter technician ID (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Technician Name</label>
            <input
              type="text"
              value={assignData.assignedTechnicianName}
              onChange={(e) => setAssignData({ ...assignData, assignedTechnicianName: e.target.value })}
              placeholder="Enter technician name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </Modal>

      {/* Update Status Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Status"
        footer={
          <>
            <button
              onClick={() => setStatusModalOpen(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateStatus}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Update
            </button>
          </>
        }
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
          <select
            value={statusData.status}
            onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        title="Reject Ticket"
        footer={
          <>
            <button
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Reject
            </button>
          </>
        }
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason</label>
          <textarea
            value={rejectData.rejectionReason}
            onChange={(e) => setRejectData({ ...rejectData, rejectionReason: e.target.value })}
            placeholder="Enter reason for rejection"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Modal>

      {/* Resolve Modal */}
      <Modal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title="Resolve Ticket"
        footer={
          <>
            <button
              onClick={() => setResolveModalOpen(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleResolve}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Resolve
            </button>
          </>
        }
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Resolution Notes</label>
          <textarea
            value={resolveData.resolutionNotes}
            onChange={(e) => setResolveData({ ...resolveData, resolutionNotes: e.target.value })}
            placeholder="Enter resolution details"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Modal>

      {/* Add Attachment Modal */}
      <Modal
        isOpen={attachmentsModalOpen}
        onClose={() => setAttachmentsModalOpen(false)}
        title="Add Attachment"
        footer={
          <>
            <button
              onClick={() => setAttachmentsModalOpen(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAddAttachment}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Add
            </button>
          </>
        }
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attachment URL ({(ticket.attachmentUrls?.length || 0)}/3)
          </label>
          <input
            type="text"
            value={attachmentUrl}
            onChange={(e) => setAttachmentUrl(e.target.value)}
            placeholder="Enter attachment URL"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-2">Maximum 3 attachments per ticket</p>
        </div>
      </Modal>
    </div>
  );
};
