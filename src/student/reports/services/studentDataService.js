import { apiClient } from '../../../apis';
import { API_ROUTES } from '../../../apis/apiRoutes';

class StudentDataService {
  // Get student by ID
  async getStudentById(id) {
    try {
      const data = await apiClient.get(API_ROUTES.students.byId(id));
      return data;
    } catch (error) {
      console.error('Error fetching student:', error);
      throw this.transformError(error);
    }
  }

  // Get student profile (current user)
  async getMyProfile() {
    try {
      const data = await apiClient.get(API_ROUTES.students.profile);
      return data;
    } catch (error) {
      console.error('Error fetching student profile:', error);
      throw this.transformError(error);
    }
  }

  // Get attachments by student ID
  async getStudentAttachments(studentId, params = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        status,
        organization
      } = params;

      const queryParams = new URLSearchParams();
      
      if (studentId) queryParams.append('student_id', studentId);
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (search) queryParams.append('search', search);
      if (status) queryParams.append('status', status);
      if (organization) queryParams.append('organization', organization);

      const endpoint = queryParams.toString() 
        ? `${API_ROUTES.attachments.list}?${queryParams.toString()}`
        : API_ROUTES.attachments.list;

      const data = await apiClient.get(endpoint);
      return data;
    } catch (error) {
      console.error('Error fetching student attachments:', error);
      throw this.transformError(error);
    }
  }

  // Get daily logs by student ID (for staff/admin) or own logs (for student)
  async getDailyLogs(params = {}) {
    try {
      const {
        attachmentId,
        page = 1,
        limit = 20,
        status,
        startDate,
        endDate,
        isOwnLogs = false // Use my-logs endpoint if true
      } = params;

      const queryParams = new URLSearchParams();
      
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (status) queryParams.append('status', status);
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      let endpoint;
      if (isOwnLogs) {
        endpoint = queryParams.toString() 
          ? `${API_ROUTES.dailyLogs.myLogs}?${queryParams.toString()}`
          : API_ROUTES.dailyLogs.myLogs;
      } else if (attachmentId) {
        endpoint = queryParams.toString() 
          ? `${API_ROUTES.dailyLogs.byAttachment(attachmentId)}?${queryParams.toString()}`
          : API_ROUTES.dailyLogs.byAttachment(attachmentId);
      } else {
        endpoint = queryParams.toString() 
          ? `${API_ROUTES.dailyLogs.list}?${queryParams.toString()}`
          : API_ROUTES.dailyLogs.list;
      }

      const data = await apiClient.get(endpoint);
      return data;
    } catch (error) {
      console.error('Error fetching daily logs:', error);
      throw this.transformError(error);
    }
  }

  // Get weekly reviews by student ID (for staff/admin) or own reviews (for student)
  async getWeeklyReviews(params = {}) {
    try {
      const {
        attachmentId,
        page = 1,
        limit = 20,
        status,
        isOwnReviews = false // Use my-reviews endpoint if true
      } = params;

      const queryParams = new URLSearchParams();
      
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (status) queryParams.append('status', status);

      let endpoint;
      if (isOwnReviews) {
        endpoint = queryParams.toString() 
          ? `${API_ROUTES.weeklyReviews.myReviews}?${queryParams.toString()}`
          : API_ROUTES.weeklyReviews.myReviews;
      } else if (attachmentId) {
        endpoint = queryParams.toString() 
          ? `${API_ROUTES.weeklyReviews.byAttachment(attachmentId)}?${queryParams.toString()}`
          : API_ROUTES.weeklyReviews.byAttachment(attachmentId);
      } else {
        endpoint = queryParams.toString() 
          ? `${API_ROUTES.weeklyReviews.list}?${queryParams.toString()}`
          : API_ROUTES.weeklyReviews.list;
      }

      const data = await apiClient.get(endpoint);
      return data;
    } catch (error) {
      console.error('Error fetching weekly reviews:', error);
      throw this.transformError(error);
    }
  }

  // Submit end of attachment report (text)
  async submitEndOfAttachmentReportText(reportData) {
    try {
      const data = await apiClient.post(API_ROUTES.endOfAttachmentReports.submitText, reportData);
      return data;
    } catch (error) {
      console.error('Error submitting text report:', error);
      throw this.transformError(error);
    }
  }

  // Submit end of attachment report (PDF)
  async submitEndOfAttachmentReportPdf(formData) {
    try {
      // For file uploads, we need to use fetch directly instead of apiClient
      const token = sessionStorage.getItem('iams_token') || localStorage.getItem('iams_token');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}${API_ROUTES.endOfAttachmentReports.submitPdf}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error submitting PDF report:', error);
      throw this.transformError(error);
    }
  }

  // Get my end of attachment reports
  async getMyEndOfAttachmentReports(params = {}) {
    try {
      const {
        page = 1,
        limit = 20
      } = params;

      const queryParams = new URLSearchParams();
      
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);

      const endpoint = queryParams.toString() 
        ? `${API_ROUTES.endOfAttachmentReports.myReports}?${queryParams.toString()}`
        : API_ROUTES.endOfAttachmentReports.myReports;

      const data = await apiClient.get(endpoint);
      return data;
    } catch (error) {
      console.error('Error fetching my end of attachment reports:', error);
      throw this.transformError(error);
    }
  }

  // Format student data for display
  formatStudentForDisplay(student) {
    return {
      id: student.id,
      regNumber: student.reg_number,
      program: student.program,
      yearOfStudy: student.year_of_study,
      studentName: student.student_name,
      studentEmail: student.student_email,
      supervisorName: student.supervisor_name,
      supervisorEmail: student.supervisor_email,
      uniSupervisorId: student.uni_supervisor_id,
      createdAt: student.created_at,
      updatedAt: student.updated_at
    };
  }

  // Format attachment data for display
  formatAttachmentForDisplay(attachment) {
    return {
      id: attachment.id,
      studentId: attachment.student_id,
      organizationName: attachment.organization_name,
      industrySupervisorName: attachment.industry_supervisor_name,
      industrySupervisorEmail: attachment.industry_supervisor_email,
      startDate: attachment.start_date,
      endDate: attachment.end_date,
      status: attachment.status,
      createdAt: attachment.created_at,
      updatedAt: attachment.updated_at
    };
  }

  // Format daily log data for display
  formatDailyLogForDisplay(log) {
    return {
      id: log.id,
      attachmentId: log.attachment_id,
      logDate: log.log_date,
      tasksPerformed: log.tasks_performed,
      skillsAcquired: log.skills_acquired,
      observations: log.observations,
      status: log.status,
      submittedAt: log.submitted_at,
      createdAt: log.created_at,
      updatedAt: log.updated_at,
      organizationName: log.organization_name
    };
  }

  // Format weekly review data for display
  formatWeeklyReviewForDisplay(review) {
    return {
      id: review.id,
      attachmentId: review.attachment_id,
      weekNumber: review.week_number,
      weekStartDate: review.week_start_date,
      weekEndDate: review.week_end_date,
      status: review.status,
      createdAt: review.created_at,
      updatedAt: review.updated_at,
      organizationName: review.organization_name,
      studentName: review.student_name,
      studentEmail: review.student_email,
      regNumber: review.reg_number,
      program: review.program,
      industryApproval: review.industry_approval,
      industryComments: review.industry_comments,
      industryImprovements: review.industry_improvements,
      industryFeedbackDate: review.industry_feedback_date,
      uniRating: review.uni_rating,
      uniComments: review.uni_comments,
      uniImprovements: review.uni_improvements,
      uniFeedbackDate: review.uni_feedback_date,
      uniSupervisorName: review.uni_supervisor_name
    };
  }

  // Calculate submission checklist items
  calculateSubmissionChecklist(student, attachments, dailyLogs, weeklyReviews) {
    const activeAttachment = attachments.find(att => att.status === 'active');
    const totalDailyLogs = dailyLogs.length;
    const submittedDailyLogs = dailyLogs.filter(log => log.status === 'submitted').length;
    const completedWeeklyReviews = weeklyReviews.filter(review => review.status === 'complete').length;
    const totalWeeklyReviews = weeklyReviews.length;

    return [
      {
        id: 1,
        label: 'Attachment registered and activated',
        meta: activeAttachment ? `${activeAttachment.organizationName} · ${this.formatDate(activeAttachment.startDate)}` : 'No active attachment',
        status: activeAttachment ? 'done' : 'pending'
      },
      {
        id: 2,
        label: 'All daily logs submitted',
        meta: `${submittedDailyLogs} of ${totalDailyLogs} working days`,
        status: totalDailyLogs > 0 && submittedDailyLogs === totalDailyLogs ? 'done' : 'pending'
      },
      {
        id: 3,
        label: 'All weekly reviews complete',
        meta: `${completedWeeklyReviews} of ${totalWeeklyReviews} complete`,
        status: totalWeeklyReviews > 0 && completedWeeklyReviews === totalWeeklyReviews ? 'done' : 'pending'
      },
      {
        id: 4,
        label: 'Attachment marked as complete by admin',
        meta: activeAttachment ? `Ends ${this.formatDate(activeAttachment.endDate)}` : 'No active attachment',
        status: activeAttachment && activeAttachment.status === 'completed' ? 'done' : 'pending'
      }
    ];
  }

  // Determine report submission mode
  getReportSubmissionMode(attachments, dailyLogs, weeklyReviews) {
    const activeAttachment = attachments.find(att => att.status === 'active');
    
    if (!activeAttachment) {
      return 'locked'; // No active attachment
    }

    const totalDailyLogs = dailyLogs.length;
    const submittedDailyLogs = dailyLogs.filter(log => log.status === 'submitted').length;
    const completedWeeklyReviews = weeklyReviews.filter(review => review.status === 'complete').length;
    const totalWeeklyReviews = weeklyReviews.length;

    // Check if all requirements are met
    const hasAllDailyLogs = totalDailyLogs > 0 && submittedDailyLogs === totalDailyLogs;
    const hasAllWeeklyReviews = totalWeeklyReviews > 0 && completedWeeklyReviews === totalWeeklyReviews;
    const attachmentCompleted = activeAttachment.status === 'completed';

    if (hasAllDailyLogs && hasAllWeeklyReviews && attachmentCompleted) {
      return 'active'; // Can submit report
    }

    return 'locked'; // Not yet available
  }

  // Format date for display
  formatDate(dateString) {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  }

  // Format date with time for display
  formatDateTime(dateString) {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Export data to CSV
  exportToCSV(data, type) {
    let headers, rows;
    
    switch (type) {
      case 'attachments':
        headers = ['Organization', 'Industry Supervisor', 'Start Date', 'End Date', 'Status'];
        rows = data.map(attachment => [
          attachment.organization_name || '',
          attachment.industry_supervisor_name || '',
          attachment.start_date || '',
          attachment.end_date || '',
          attachment.status || ''
        ]);
        break;
        
      case 'daily-logs':
        headers = ['Date', 'Tasks Performed', 'Skills Acquired', 'Observations', 'Status', 'Submitted At'];
        rows = data.map(log => [
          log.log_date || '',
          log.tasks_performed || '',
          log.skills_acquired || '',
          log.observations || '',
          log.status || '',
          log.submitted_at || ''
        ]);
        break;
        
      case 'weekly-reviews':
        headers = ['Week', 'Start Date', 'End Date', 'Status', 'Industry Approval', 'Uni Rating', 'Industry Comments', 'Uni Comments'];
        rows = data.map(review => [
          `Week ${review.week_number || ''}`,
          review.week_start_date || '',
          review.week_end_date || '',
          review.status || '',
          review.industry_approval || '',
          review.uni_rating || '',
          review.industry_comments || '',
          review.uni_comments || ''
        ]);
        break;
        
      default:
        return '';
    }
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  // Download CSV file
  downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return { success: true, filename };
  }

  // Transform API error to user-friendly message
  transformError(error) {
    // Handle common error scenarios
    if (error.message.includes('401')) {
      return new Error('Authentication required. Please login again.');
    }
    
    if (error.message.includes('403')) {
      return new Error('Access denied. You do not have permission to perform this action.');
    }
    
    if (error.message.includes('404')) {
      return new Error('Student data not found.');
    }
    
    if (error.message.includes('413')) {
      return new Error('File too large. Please upload a smaller file.');
    }
    
    // Return original error if no specific handling
    return error;
  }
}

const studentDataService = new StudentDataService();
export { studentDataService };
export default studentDataService;
