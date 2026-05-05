import { apiClient } from '../../../apis/index';
import { API_ROUTES } from '../../../apis/apiRoutes';

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

export const studentApi = {
  // Get all students with optional filtering
  getStudents: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.supervisor && filters.supervisor !== 'all') {
        params.append('supervisor', filters.supervisor);
      }
      if (filters.program && filters.program !== 'all') {
        params.append('program', filters.program);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.unassignedOnly) {
        params.append('unassigned', 'true');
      }
      
      const endpoint = params.toString() 
        ? `${API_ROUTES.students.list}?${params.toString()}`
        : API_ROUTES.students.list;
      
      const response = await apiClient.get(endpoint);
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to fetch students');
    }
  },

  // Get student by ID
  getStudentById: async (id) => {
    try {
      const response = await apiClient.get(API_ROUTES.students.byId(id));
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to fetch student details');
    }
  },

  // Create new student
  createStudent: async (studentData) => {
    try {
      const response = await apiClient.post(API_ROUTES.students.create, studentData);
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to create student');
    }
  },

  // Update student
  updateStudent: async (id, studentData) => {
    try {
      const response = await apiClient.put(API_ROUTES.students.update(id), studentData);
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to update student');
    }
  },

  // Delete student
  deleteStudent: async (id) => {
    try {
      const response = await apiClient.delete(API_ROUTES.students.delete(id));
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to delete student');
    }
  },

  // Assign supervisor to student
  assignSupervisor: async (studentId, supervisorId) => {
    try {
      const response = await apiClient.put(API_ROUTES.students.assignSupervisor(studentId), {
        supervisorId
      });
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to assign supervisor');
    }
  },

  // Bulk assign supervisors
  bulkAssignSupervisors: async (assignments) => {
    try {
      const response = await apiClient.post(API_ROUTES.students.bulkAssign, {
        assignments
      });
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to assign supervisors');
    }
  },

  // Get available supervisors
  getAvailableSupervisors: async () => {
    try {
      const response = await apiClient.get(API_ROUTES.students.availableSupervisors);
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to fetch available supervisors');
    }
  },

  // Get unassigned students
  getUnassignedStudents: async () => {
    try {
      const response = await apiClient.get(API_ROUTES.students.unassigned);
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to fetch unassigned students');
    }
  },

  // Get students by supervisor
  getStudentsBySupervisor: async (supervisorId) => {
    try {
      const response = await apiClient.get(API_ROUTES.students.bySupervisor(supervisorId));
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to fetch students by supervisor');
    }
  }
};

export default studentApi;