import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const ticketAPI = {
  getAllTickets: async () => {
    try {
      const response = await apiClient.get("/tickets");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getTicketById: async (id) => {
    try {
      const response = await apiClient.get(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createTicket: async (ticketData) => {
    try {
      const response = await apiClient.post("/tickets", ticketData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  analyzePriority: async (description) => {
    try {
      const response = await apiClient.post(
        "/tickets/analyze-priority",
        description,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateTicket: async (id, ticketData) => {
    try {
      const response = await apiClient.put(`/tickets/${id}`, ticketData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteTicket: async (id) => {
    try {
      const response = await apiClient.delete(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  assignTechnician: async (id, assignData) => {
    try {
      const response = await apiClient.patch(`/tickets/${id}/assign`, assignData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateTicketStatus: async (id, statusData) => {
    try {
      const response = await apiClient.patch(`/tickets/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  rejectTicket: async (id, rejectData) => {
    try {
      const response = await apiClient.patch(`/tickets/${id}/reject`, rejectData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  resolveTicket: async (id, resolveData) => {
    try {
      const response = await apiClient.patch(`/tickets/${id}/resolve`, resolveData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  closeTicket: async (id) => {
    try {
      const response = await apiClient.patch(`/tickets/${id}/close`, {});
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  addAttachments: async (id, attachmentData) => {
    try {
      const response = await apiClient.patch(`/tickets/${id}/attachments`, attachmentData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  uploadTicketImages: async (ticketId, files) => {
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await apiClient.post(
        `/tickets/${ticketId}/attachments/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export const commentAPI = {
  getComments: async (ticketId) => {
    try {
      const response = await apiClient.get(`/tickets/${ticketId}/comments`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createComment: async (ticketId, commentData) => {
    try {
      const response = await apiClient.post(
        `/tickets/${ticketId}/comments`,
        commentData
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateComment: async (ticketId, commentId, commentData) => {
    try {
      const response = await apiClient.put(
        `/tickets/${ticketId}/comments/${commentId}`,
        commentData
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteComment: async (ticketId, commentId, authorName) => {
    try {
      const response = await apiClient.delete(
        `/tickets/${ticketId}/comments/${commentId}`,
        {
          data: { authorName },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

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

export const resourceAPI = {
  getResources: async () => {
    try {
      const response = await apiClient.get("/resources");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

const handleApiError = (error) => {
  if (error.response) {
    const errorMessage =
      error.response.data?.message ||
      error.response.data?.error ||
      error.response.data ||
      "An error occurred";

    return new Error(errorMessage);
  }

  if (error.request) {
    return new Error("No response from server. Please check if backend is running.");
  }

  return error;
};