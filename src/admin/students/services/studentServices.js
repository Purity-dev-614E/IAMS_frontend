import { apiClient } from '../../../apis/index';
import { API_ROUTES } from '../../../apis/apiRoutes';

const WORKING_DAYS_PER_WEEK = 5;

const getDateOnly = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getCurrentWorkWeekRange = () => {
  const today = new Date();
  const day = today.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;

  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  friday.setHours(23, 59, 59, 999);

  return {
    startDate: getDateOnly(monday),
    endDate: getDateOnly(friday)
  };
};

const getArrayPayload = (response, key) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.[key])) return response[key];
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.[key])) return response.data[key];
  return [];
};

const getStudentId = (student) => student.student_id || student.studentId || student.id;

const normalizeStatus = (status, fallback = 'pending') => (
  String(status || fallback).trim().toLowerCase()
);

const pickPrimaryAttachment = (attachments = []) => {
  if (!attachments.length) return null;

  return (
    attachments.find(attachment => normalizeStatus(attachment.status) === 'active') ||
    attachments.find(attachment => normalizeStatus(attachment.status) === 'pending') ||
    attachments[0]
  );
};

const isSubmittedLog = (log) => ['submitted', 'reviewed'].includes(normalizeStatus(log.status, ''));

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

  // Get attachments belonging to one student
  getAttachmentsByStudent: async (studentId) => {
    try {
      const params = new URLSearchParams({
        student_id: studentId,
        limit: '5'
      });
      const response = await apiClient.get(`${API_ROUTES.attachments.list}?${params.toString()}`);
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to fetch student attachments');
    }
  },

  getPrimaryAttachmentForStudent: async (student) => {
    const studentId = getStudentId(student);
    if (!studentId) return null;

    const attachmentsResponse = await studentApi.getAttachmentsByStudent(studentId);
    const attachments = getArrayPayload(attachmentsResponse, 'attachments');
    return pickPrimaryAttachment(attachments);
  },

  // Get this week's logs for a specific attachment
  getCurrentWeekLogsByAttachment: async (attachmentId) => {
    try {
      const { startDate, endDate } = getCurrentWorkWeekRange();
      const params = new URLSearchParams({
        startDate,
        endDate,
        limit: String(WORKING_DAYS_PER_WEEK)
      });
      const response = await apiClient.get(`${API_ROUTES.dailyLogs.byAttachment(attachmentId)}?${params.toString()}`);
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to fetch current week logs');
    }
  },

  // Add attachment status and current-week log counts to base student rows
  enrichStudentTableRows: async (students = []) => {
    return Promise.all(students.map(async (student) => {
      const studentId = getStudentId(student);

      if (!studentId) {
        return {
          ...student,
          attachmentStatus: normalizeStatus(student.attachment_status || student.attachmentStatus, 'none'),
          logsThisWeek: 0,
          totalLogs: 0
        };
      }

      try {
        const attachmentsResponse = await studentApi.getAttachmentsByStudent(studentId);
        const attachments = getArrayPayload(attachmentsResponse, 'attachments');
        const attachment = pickPrimaryAttachment(attachments);

        if (!attachment) {
          return {
            ...student,
            attachmentStatus: normalizeStatus(student.attachment_status || student.attachmentStatus, 'none'),
            logsThisWeek: 0,
            totalLogs: 0
          };
        }

        const logsResponse = await studentApi.getCurrentWeekLogsByAttachment(attachment.id);
        const logs = getArrayPayload(logsResponse, 'logs');

        return {
          ...student,
          currentAttachment: {
            ...attachment,
            logs: logs.filter(isSubmittedLog).length
          },
          attachmentStatus: normalizeStatus(attachment.status),
          logsThisWeek: logs.filter(isSubmittedLog).length,
          totalLogs: WORKING_DAYS_PER_WEEK
        };
      } catch (error) {
        console.error(`Failed to enrich student ${studentId}:`, error);
        return {
          ...student,
          attachmentStatus: normalizeStatus(student.attachment_status || student.attachmentStatus),
          logsThisWeek: student.logs_this_week || student.logsThisWeek || 0,
          totalLogs: student.total_logs || student.totalLogs || 0
        };
      }
    }));
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
  assignSupervisor: async (studentId, uni_supervisor_id) => {
    try {
      const response = await apiClient.put(API_ROUTES.students.assignSupervisor(studentId), {
        uni_supervisor_id
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
  getStudentsBySupervisor: async (uni_supervisor_id) => {
    try {
      const response = await apiClient.get(API_ROUTES.students.bySupervisor(uni_supervisor_id));
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to fetch students by supervisor');
    }
  }
};

export default studentApi;
