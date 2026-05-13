import { apiClient } from '../../../apis';
import { API_ROUTES } from '../../../apis/apiRoutes';

class SupervisorApprovalService {
  // Get pending supervisors with pagination
  async getPendingSupervisors(params = {}) {
    try {
      const {
        page = 1,
        limit = 20
      } = params;

      const queryParams = new URLSearchParams();
      
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);

      const endpoint = queryParams.toString() 
        ? `${API_ROUTES.users.pendingSupervisors}?${queryParams.toString()}`
        : API_ROUTES.users.pendingSupervisors;

      const data = await apiClient.get(endpoint);
      
      return {
        ...data,
        supervisors: data.supervisors || [],
        pagination: data.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0
        }
      };
    } catch (error) {
      console.error('Error fetching pending supervisors:', error);
      throw this.transformError(error);
    }
  }

  // Approve a supervisor
  async approveSupervisor(id) {
    try {
      const data = await apiClient.put(API_ROUTES.users.approve(id));
      return data;
    } catch (error) {
      console.error('Error approving supervisor:', error);
      throw this.transformError(error);
    }
  }

  // Reject a supervisor
  async rejectSupervisor(id) {
    try {
      const data = await apiClient.put(API_ROUTES.users.reject(id));
      return data;
    } catch (error) {
      console.error('Error rejecting supervisor:', error);
      throw this.transformError(error);
    }
  }

  // Transform API error to user-friendly message
  transformError(error) {
    // Handle common error scenarios
    if (error.message.includes('404')) {
      return new Error('Pending supervisor not found');
    }
    
    if (error.message.includes('401')) {
      return new Error('You are not authorized to perform this action');
    }
    
    if (error.message.includes('403')) {
      return new Error('Access denied. Admin privileges required.');
    }
    
    // Return original error if no specific handling
    return error;
  }

  // Format supervisor data for display
  formatSupervisorForDisplay(supervisor) {
    return {
      id: supervisor.id,
      name: supervisor.name,
      email: supervisor.email,
      department: supervisor.department || 'Not specified',
      registeredDate: this.formatDate(supervisor.created_at),
      waitingDays: this.calculateWaitingDays(supervisor.created_at),
      staffId: supervisor.staffId || supervisor.staff_id || 'Not provided'
    };
  }

  // Format date to readable format
  formatDate(dateString) {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    return date.toLocaleDateString('en-US', options);
  }

  // Calculate waiting days since registration
  calculateWaitingDays(createdDate) {
    if (!createdDate) return 0;
    
    const created = new Date(createdDate);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  // Format history entry for display
  formatHistoryEntry(supervisor, action,actionDate = new Date()) {
    return {
      name: supervisor.name,
      email: supervisor.email,
      department: supervisor.department || 'Not specified',
      actionedDate: this.formatDate(actionDate),
      decision: action.charAt(0).toUpperCase() + action.slice(1) // Capitalize first letter
    };
  }
}

const supervisorApprovalService = new SupervisorApprovalService();
export { supervisorApprovalService };
export default supervisorApprovalService;
