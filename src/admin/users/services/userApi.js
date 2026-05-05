import { apiClient } from '../../../apis/index';
import { API_ROUTES } from '../../../apis/apiRoutes';

// Error handling helper
const handleApiError = (error, defaultMessage) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || error.response.statusText;
    throw new Error(message || defaultMessage);
  } else if (error.request) {
    // Network error
    throw new Error('Network error. Please check your connection.');
  } else {
    // Other error
    throw new Error(error.message || defaultMessage);
  }
};

export const userApi = {
  // Get all users with optional filtering
  getUsers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.role && filters.role !== 'all') {
        params.append('role', filters.role);
      }
      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      const endpoint = params.toString() 
        ? `${API_ROUTES.users.list}?${params.toString()}`
        : API_ROUTES.users.list;
      
      const response = await apiClient.get(endpoint);
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to fetch users');
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await apiClient.get(API_ROUTES.users.byId(id));
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to fetch user details');
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const response = await apiClient.post(API_ROUTES.users.create, userData);
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to create user');
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await apiClient.put(API_ROUTES.users.update(id), userData);
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to update user');
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const response = await apiClient.delete(API_ROUTES.users.delete(id));
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to delete user');
    }
  },

  // Get users by role
  getUsersByRole: async (role) => {
    try {
      const response = await apiClient.get(API_ROUTES.users.byRole(role));
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to fetch users by role');
    }
  },

  // Get pending supervisors
  getPendingSupervisors: async () => {
    try {
      const response = await apiClient.get(API_ROUTES.users.pendingSupervisors);
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to fetch pending supervisors');
    }
  },

  // Approve supervisor
  approveSupervisor: async (id) => {
    try {
      const response = await apiClient.post(API_ROUTES.users.approve(id));
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to approve supervisor');
    }
  },

  // Reject supervisor
  rejectSupervisor: async (id) => {
    try {
      const response = await apiClient.post(API_ROUTES.users.reject(id));
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to reject supervisor');
    }
  },

  // Deactivate user
  deactivateUser: async (id) => {
    try {
      const response = await apiClient.put(API_ROUTES.users.update(id), { status: 'inactive' });
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to deactivate user');
    }
  },

  // Reactivate user
  reactivateUser: async (id) => {
    try {
      const response = await apiClient.put(API_ROUTES.users.update(id), { status: 'active' });
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to reactivate user');
    }
  },

  // Reset user password
  resetPassword: async (id, tempPassword) => {
    try {
      const response = await apiClient.put(API_ROUTES.users.update(id), { 
        tempPassword,
        requirePasswordChange: true 
      });
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to reset password');
    }
  }
};

export default userApi;
