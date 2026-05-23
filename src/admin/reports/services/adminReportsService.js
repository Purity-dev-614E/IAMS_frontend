import { apiClient } from '../../../apis';
import { API_ROUTES } from '../../../apis/apiRoutes';

class AdminReportsService {
  async getAdminReportsSummary() {
    try {
      const data = await apiClient.get(API_ROUTES.admin.reportsSummary);

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch reports summary');
      }

      return data.summary;
    } catch (error) {
      console.error('Error fetching admin reports summary:', error);
      throw this.transformError(error);
    }
  }

  async generateAdminReport(type) {
    try {
      const data = await apiClient.post(API_ROUTES.admin.reportsGenerate, { type });

      if (!data.success) {
        throw new Error(data.message || 'Failed to generate report');
      }

      return data.report;
    } catch (error) {
      console.error('Error generating admin report:', error);
      throw this.transformError(error);
    }
  }

  downloadTableReport(report) {
    const columns = report?.columns || [];
    const rows = report?.rows || [];
    const headers = columns.map(column => column.label || column.key);
    const body = rows.map(row => columns.map(column => row[column.key] ?? ''));
    const csv = [headers, ...body].map(items =>
      items.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    const filename = `${report?.type || 'admin-report'}_${new Date().toISOString().split('T')[0]}.csv`;

    return this.downloadReport(csv, filename);
  }

  // Generate Student Report
  async generateStudentReport(studentId, format = 'json') {
    try {
      const data = await apiClient.post(API_ROUTES.reports.generateStudent, {
        studentId,
        format
      });
      return data;
    } catch (error) {
      console.error('Error generating student report:', error);
      throw this.transformError(error);
    }
  }

  // Generate Cohort Report
  async generateCohortReport(params = {}) {
    try {
      const {
        program,
        year,
        startDate,
        endDate,
        format = 'json'
      } = params;

      const requestBody = {};
      if (program) requestBody.program = program;
      if (year) requestBody.year = year;
      if (startDate) requestBody.startDate = startDate;
      if (endDate) requestBody.endDate = endDate;
      requestBody.format = format;

      const data = await apiClient.post(API_ROUTES.reports.generateCohort, requestBody);
      return data;
    } catch (error) {
      console.error('Error generating cohort report:', error);
      throw this.transformError(error);
    }
  }

  // Generate Weekly Review Status Report
  async generateWeeklyReviewStatusReport(params = {}) {
    try {
      const {
        status,
        startDate,
        endDate,
        format = 'json'
      } = params;

      const requestBody = {};
      if (status) requestBody.status = status;
      if (startDate) requestBody.startDate = startDate;
      if (endDate) requestBody.endDate = endDate;
      requestBody.format = format;

      const data = await apiClient.post(API_ROUTES.reports.generateWeeklyReviewStatus, requestBody);
      return data;
    } catch (error) {
      console.error('Error generating weekly review status report:', error);
      throw this.transformError(error);
    }
  }

  // Get Report by ID
  async getReportById(id) {
    try {
      const data = await apiClient.get(API_ROUTES.reports.byId(id));
      return data;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw this.transformError(error);
    }
  }

  // Get All End of Attachment Reports
  async getEndOfAttachmentReports(params = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        submissionType,
        search
      } = params;

      const queryParams = new URLSearchParams();
      
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (status) queryParams.append('status', status);
      if (submissionType) queryParams.append('submission_type', submissionType);
      if (search) queryParams.append('search', search);

      const endpoint = queryParams.toString() 
        ? `${API_ROUTES.endOfAttachmentReports.list}?${queryParams.toString()}`
        : API_ROUTES.endOfAttachmentReports.list;

      const data = await apiClient.get(endpoint);
      return data;
    } catch (error) {
      console.error('Error fetching end of attachment reports:', error);
      throw this.transformError(error);
    }
  }

  // Get End of Attachment Report by ID
  async getEndOfAttachmentReportById(id) {
    try {
      const data = await apiClient.get(API_ROUTES.endOfAttachmentReports.byId(id));
      return data;
    } catch (error) {
      console.error('Error fetching end of attachment report:', error);
      throw this.transformError(error);
    }
  }

  // Review End of Attachment Report
  async reviewEndOfAttachmentReport(id, reviewData) {
    try {
      const { status, feedbackComments } = reviewData;
      
      // Validate status
      if (!['approved', 'rejected'].includes(status)) {
        throw new Error('Status must be either "approved" or "rejected"');
      }
      
      const data = await apiClient.put(API_ROUTES.endOfAttachmentReports.review(id), {
        status,
        feedback_comments: feedbackComments
      });
      
      return data;
    } catch (error) {
      console.error('Error reviewing end of attachment report:', error);
      throw this.transformError(error);
    }
  }

  // Download PDF Report (End of Attachment)
  async downloadEndOfAttachmentReport(id) {
    try {
      const token = sessionStorage.getItem('iams_token') || localStorage.getItem('iams_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || "https://iamsbackend-production.up.railway.app/api"}${API_ROUTES.endOfAttachmentReports.staffDownload(id)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `HTTP Error: ${response.status}`);
      }
      
      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'end-of-attachment-report.pdf';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true, filename };
    } catch (error) {
      console.error('Error downloading end of attachment report:', error);
      throw this.transformError(error);
    }
  }

  // Download generated report (CSV/PDF)
  async downloadReport(reportData, filename) {
    try {
      let blob;
      
      if (reportData instanceof Blob) {
        blob = reportData;
      } else if (typeof reportData === 'object') {
        // Convert JSON to CSV if needed
        const csvContent = this.convertToCSV(reportData);
        blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      } else {
        // Assume it's already text content
        blob = new Blob([reportData], { type: 'text/csv;charset=utf-8;' });
      }
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true, filename };
    } catch (error) {
      console.error('Error downloading report:', error);
      throw this.transformError(error);
    }
  }

  // Convert JSON data to CSV format
  convertToCSV(data) {
    if (!data) return '';
    
    // Handle different report structures
    if (data.students && Array.isArray(data.students)) {
      return this.convertCohortReportToCSV(data);
    } else if (data.reviews && Array.isArray(data.reviews)) {
      return this.convertWeeklyReviewReportToCSV(data);
    } else if (data.student) {
      return this.convertStudentReportToCSV(data);
    }
    
    return JSON.stringify(data, null, 2);
  }

  // Convert cohort report to CSV
  convertCohortReportToCSV(data) {
    const headers = [
      'Student ID', 'Registration Number', 'Name', 'Email', 'Program', 
      'Year of Study', 'Attachments', 'Daily Logs', 'Submitted Logs', 
      'Weekly Reviews', 'Completed Reviews'
    ];
    
    const rows = data.students.map(student => [
      student.id || '',
      student.reg_number || '',
      student.student_name || '',
      student.student_email || '',
      student.program || '',
      student.year_of_study || '',
      student.attachment_count || 0,
      student.daily_log_count || 0,
      student.submitted_log_count || 0,
      student.weekly_review_count || 0,
      student.completed_review_count || 0
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  // Convert weekly review report to CSV
  convertWeeklyReviewReportToCSV(data) {
    const headers = [
      'Review ID', 'Week Number', 'Week Start', 'Week End', 'Status',
      'Student Name', 'Registration Number', 'Program', 'Organization',
      'Industry Approval', 'Industry Feedback Date', 'Uni Rating', 'Uni Feedback Date'
    ];
    
    const rows = data.reviews.map(review => [
      review.id || '',
      review.week_number || '',
      review.week_start_date || '',
      review.week_end_date || '',
      review.status || '',
      review.student_name || '',
      review.reg_number || '',
      review.program || '',
      review.organization_name || '',
      review.industry_approval || '',
      review.industry_feedback_date || '',
      review.uni_rating || '',
      review.uni_feedback_date || ''
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  // Convert student report to CSV
  convertStudentReportToCSV(data) {
    const { student, summary } = data;
    
    let csv = 'Student Report\n\n';
    csv += 'Student Information\n';
    csv += `ID,${student.id || ''}\n`;
    csv += `Registration Number,${student.reg_number || ''}\n`;
    csv += `Name,${student.student_name || ''}\n`;
    csv += `Email,${student.student_email || ''}\n`;
    csv += `Program,${student.program || ''}\n`;
    csv += `Year of Study,${student.year_of_study || ''}\n`;
    csv += `Supervisor Name,${student.supervisor_name || ''}\n`;
    csv += `Supervisor Email,${student.supervisor_email || ''}\n\n`;
    
    csv += 'Summary\n';
    csv += `Total Attachments,${summary?.totalAttachments || 0}\n`;
    csv += `Total Daily Logs,${summary?.totalDailyLogs || 0}\n`;
    csv += `Total Weekly Reviews,${summary?.totalWeeklyReviews || 0}\n`;
    csv += `Completed Weekly Reviews,${summary?.completedWeeklyReviews || 0}\n`;
    csv += `Average Uni Rating,${summary?.averageUniRating || 0}\n`;
    
    return csv;
  }

  // Format report for display
  formatReportForDisplay(report, type) {
    const baseReport = {
      id: report.id || Date.now(),
      name: this.getReportName(report, type),
      description: this.getReportDescription(report, type),
      type,
      generated: this.formatDate(report.generatedAt || report.created_at),
      by: 'Admin'
    };

    return baseReport;
  }

  // Get report name based on type and data
  getReportName(report, type) {
    switch (type) {
      case 'cohort':
        const program = report.filters?.program || 'All Programs';
        const year = report.filters?.year || new Date().getFullYear();
        return `${year} ${program} Cohort Report`;
      case 'student':
        return `${report.student?.student_name || 'Student'} — Detail Report`;
      case 'weekly-review':
        return `Weekly Review Status — ${report.filters?.status || 'All'} Status`;
      case 'end-of-attachment':
        return `End of Attachment Reports`;
      default:
        return 'System Report';
    }
  }

  // Get report description
  getReportDescription(report, type) {
    switch (type) {
      case 'cohort':
        const summary = report.summary;
        return `${summary?.totalStudents || 0} students · ${summary?.submissionRate || 0}% submission rate`;
      case 'student':
        return `${report.summary?.totalDailyLogs || 0} logs · ${report.summary?.totalWeeklyReviews || 0} reviews`;
      case 'weekly-review':
        const reviewSummary = report.summary;
        return `${reviewSummary?.totalReviews || 0} reviews · ${reviewSummary?.pending || 0} pending`;
      case 'end-of-attachment':
        return `${report.pagination?.total || 0} reports`;
      default:
        return 'System generated report';
    }
  }

  // Format date for display
  formatDate(dateString) {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return diffMinutes === 0 ? 'Just now' : `${diffMinutes} minutes ago`;
      }
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }

  // Transform API error to user-friendly message
  transformError(error) {
    // Handle common error scenarios
    if (error.message.includes('401')) {
      return new Error('Authentication required. Please login again.');
    }
    
    if (error.message.includes('403')) {
      return new Error('Access denied. Admin privileges required.');
    }
    
    if (error.message.includes('404')) {
      return new Error('Report not found.');
    }
    
    if (error.message.includes('400')) {
      if (error.message.includes('Invalid status')) {
        return new Error('Invalid status. Must be approved or rejected.');
      }
      return new Error('Invalid request parameters.');
    }
    
    // Return original error if no specific handling
    return error;
  }
}

const adminReportsService = new AdminReportsService();
export { adminReportsService };
export default adminReportsService;
