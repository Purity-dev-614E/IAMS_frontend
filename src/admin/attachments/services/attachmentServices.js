import { apiClient } from '../../../apis/index';
import { API_ROUTES } from '../../../apis/apiRoutes';

// Error handling helper
const handleApiError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  throw new Error(error.response?.data?.message || error.message || defaultMessage);
};

const attachmentApi = {
  // Get all attachments (admin view)
  getAttachments: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      const response = await apiClient.get(`${API_ROUTES.attachments.list}?${params}`);
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to fetch attachments');
    }
  },

  // Get attachment by ID
  getAttachmentById: async (id) => {
    try {
      const response = await apiClient.get(API_ROUTES.attachments.byId(id));
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to fetch attachment');
    }
  },

  // Update attachment status
  updateAttachmentStatus: async (id, status) => {
    try {
      const response = await apiClient.put(API_ROUTES.attachments.updateStatus(id), {
        status
      });
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to update attachment status');
    }
  },

  // Activate attachment
  activateAttachment: async (id) => {
    try {
      const response = await apiClient.put(API_ROUTES.attachments.updateStatus(id), {
        status: 'active'
      });
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to activate attachment');
    }
  },

  // Resend review email to industry supervisor
  resendReviewEmail: async (id) => {
    try {
      const response = await apiClient.post(`${API_ROUTES.attachments.byId(id)}/resend-email`);
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to resend review email');
    }
  },

  // Delete attachment
  deleteAttachment: async (id) => {
    try {
      const response = await apiClient.delete(API_ROUTES.attachments.delete(id));
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to delete attachment');
    }
  },

  // Get attachment statistics
  getAttachmentStats: async () => {
    try {
      const response = await apiClient.get(`${API_ROUTES.attachments.list}/stats`);
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to fetch attachment statistics');
    }
  }
};


export default attachmentApi;
