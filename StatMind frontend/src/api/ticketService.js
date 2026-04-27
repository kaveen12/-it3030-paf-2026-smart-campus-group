import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Ticket endpoints
export const ticketAPI = {
  // Get all tickets
  getAllTickets: async () => {
    try {
      const response = await apiClient.get('/tickets');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get ticket by ID
  getTicketById: async (id) => {
    try {
      const response = await apiClient.get(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create new ticket
  createTicket: async (ticketData) => {
    try {
      const response = await apiClient.post('/tickets', ticketData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update ticket
  updateTicket: async (id, ticketData) => {
    try {
      const response = await apiClient.put(`/tickets/${id}`, ticketData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete ticket
  deleteTicket: async (id) => {
    try {
      const response = await apiClient.delete(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Assign technician
  assignTechnician: async (id, assignData) => {
    try {
      const response = await apiClient.patch(`/tickets/${id}/assign`, assignData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update ticket status
  updateTicketStatus: async (id, statusData) => {
    try {
      const response = await apiClient.patch(`/tickets/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Reject ticket
  rejectTicket: async (id, rejectData) => {
    try {
      const response = await apiClient.patch(`/tickets/${id}/reject`, rejectData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Resolve ticket
  resolveTicket: async (id, resolveData) => {
    try {
      const response = await apiClient.patch(`/tickets/${id}/resolve`, resolveData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Close ticket
  closeTicket: async (id) => {
    try {
      const response = await apiClient.patch(`/tickets/${id}/close`, {});
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Add attachments
  addAttachments: async (id, attachmentData) => {
    try {
      const response = await apiClient.patch(`/tickets/${id}/attachments`, attachmentData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Comment endpoints
export const commentAPI = {
  // Get comments for a ticket
  getComments: async (ticketId) => {
    try {
      const response = await apiClient.get(`/tickets/${ticketId}/comments`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create comment
  createComment: async (ticketId, commentData) => {
    try {
      const response = await apiClient.post(`/tickets/${ticketId}/comments`, commentData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update comment
  updateComment: async (ticketId, commentId, commentData) => {
    try {
      const response = await apiClient.put(`/tickets/${ticketId}/comments/${commentId}`, commentData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete comment
  deleteComment: async (ticketId, commentId) => {
    try {
      const response = await apiClient.delete(`/tickets/${ticketId}/comments/${commentId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Activity log endpoints
export const activityLogAPI = {
  getActivityLogs: async (ticketId) => {
    try {
      const response = await apiClient.get(`/tickets/${ticketId}/logs`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Resource endpoints
export const resourceAPI = {
  // Get all resources
  getResources: async () => {
    try {
      const response = await apiClient.get('/resources');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Error handling
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with an error status
    const errorMessage = error.response.data?.message || error.response.data?.error || 'An error occurred';
    return new Error(errorMessage);
  } else if (error.request) {
    // Request was made but no response was received
    return new Error('No response from server. Please check if backend is running.');
  } else {
    // Something else happened
    return error;
  }
};
