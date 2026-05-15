import { apiClient } from '../../../apis';
import { API_ROUTES } from '../../../apis/apiRoutes';
import { EndOfAttachmentReport, transformToModel, transformToAPI, validateModel, transformError } from '../../../models';

class AdminEndOfAttachmentReportService {
  // Get all reports with filtering and pagination
  async getAllReports(params = {}) {
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
      
      return {
        ...data,
        data: transformToModel(data.data || data, EndOfAttachmentReport)
      };
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw transformError(error);
    }
  }

  // Get report by ID
  async getReportById(id) {
    try {
      const data = await apiClient.get(API_ROUTES.endOfAttachmentReports.byId(id));
      return transformToModel(data, EndOfAttachmentReport);
    } catch (error) {
      console.error('Error fetching report:', error);
      throw transformError(error);
    }
  }

  // Review report (approve/reject)
  async reviewReport(id, reviewData) {
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
      
      return transformToModel(data, EndOfAttachmentReport);
    } catch (error) {
      console.error('Error reviewing report:', error);
      throw transformError(error);
    }
  }

  // Download PDF report
  async downloadReport(id) {
    try {
      const token = localStorage.getItem('iams_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || "https://iams-backend.onrender.com/api"}${API_ROUTES.endOfAttachmentReports.staffDownload(id)}`, {
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
      let filename = 'report.pdf';
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
      console.error('Error downloading report:', error);
      throw transformError(error);
    }
  }

  // Get reports statistics
  async getReportsStatistics() {
    try {
      const data = await apiClient.get('/end-of-attachment-reports/statistics');
      return data;
    } catch (error) {
      console.error('Error fetching reports statistics:', error);
      throw transformError(error);
    }
  }

  // Bulk review reports
  async bulkReviewReports(reportIds, reviewData) {
    try {
      const { status, feedbackComments } = reviewData;
      
      // Validate status
      if (!['approved', 'rejected'].includes(status)) {
        throw new Error('Status must be either "approved" or "rejected"');
      }
      
      const data = await apiClient.post('/end-of-attachment-reports/bulk-review', {
        report_ids: reportIds,
        status,
        feedback_comments: feedbackComments
      });
      
      return {
        ...data,
        data: transformToModel(data.data || [], EndOfAttachmentReport)
      };
    } catch (error) {
      console.error('Error bulk reviewing reports:', error);
      throw transformError(error);
    }
  }

  // Export reports to CSV
  async exportReports(params = {}) {
    try {
      const {
        status,
        submissionType,
        startDate,
        endDate
      } = params;

      const queryParams = new URLSearchParams();
      
      if (status) queryParams.append('status', status);
      if (submissionType) queryParams.append('submission_type', submissionType);
      if (startDate) queryParams.append('start_date', startDate);
      if (endDate) queryParams.append('end_date', endDate);

      const endpoint = queryParams.toString() 
        ? `/end-of-attachment-reports/export?${queryParams.toString()}`
        : '/end-of-attachment-reports/export';

      const token = localStorage.getItem('iams_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || "https://iams-backend.onrender.com/api"}${endpoint}`, {
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
      let filename = 'reports.csv';
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
      console.error('Error exporting reports:', error);
      throw transformError(error);
    }
  }

  // Format report for display
  formatReportForDisplay(report) {
    const reportModel = new EndOfAttachmentReport(report);
    return {
      ...report,
      // Map API field names to frontend component prop names using model
      submissionTypeDisplay: reportModel.getSubmissionTypeDisplay(),
      statusDisplay: reportModel.getStatusDisplay(),
      hasFeedback: reportModel.hasFeedback(),
      isApproved: reportModel.isApproved(),
      isRejected: reportModel.isRejected(),
      isUnderReview: reportModel.isUnderReview(),
      canBeReviewed: reportModel.canBeReviewed(),
      submittedAt: reportModel.submittedAt,
      reviewedAt: reportModel.reviewedAt,
      reviewedBy: reportModel.reviewedBy,
      
      // Additional admin-specific formatting
      statusColor: this.getStatusColor(reportModel.status),
      submissionTypeIcon: this.getSubmissionTypeIcon(reportModel.submissionType)
    };
  }

  // Get status color for UI
  getStatusColor(status) {
    const colorMap = {
      'submitted': 'blue',
      'under_review': 'yellow',
      'approved': 'green',
      'rejected': 'red'
    };
    return colorMap[status] || 'gray';
  }

  // Get submission type icon
  getSubmissionTypeIcon(submissionType) {
    return submissionType === 'pdf' ? 'file-pdf' : 'file-text';
  }

  // Filter reports for display
  filterReports(reports, filters) {
    if (!reports || !Array.isArray(reports)) return [];
    
    return reports.filter(report => {
      const model = new EndOfAttachmentReport(report);
      
      // Status filter
      if (filters.status && model.status !== filters.status) {
        return false;
      }
      
      // Submission type filter
      if (filters.submissionType && model.submissionType !== filters.submissionType) {
        return false;
      }
      
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableFields = [
          model.studentId,
          model.textContent,
          model.pdfFilename,
          model.feedbackComments
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchableFields.includes(searchTerm)) {
          return false;
        }
      }
      
      return true;
    });
  }
}

const adminEndOfAttachmentReportService = new AdminEndOfAttachmentReportService();
export { adminEndOfAttachmentReportService };
export default adminEndOfAttachmentReportService;
