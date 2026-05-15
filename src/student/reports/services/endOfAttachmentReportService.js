import { apiClient } from '../../../apis';
import { API_ROUTES } from '../../../apis/apiRoutes';
import { EndOfAttachmentReport, transformToModel, transformToAPI, validateModel, transformError } from '../../../models';

class EndOfAttachmentReportService {
  // Submit text report
  async submitTextReport(reportData) {
    try {
      const report = new EndOfAttachmentReport({
        ...reportData,
        submissionType: 'text',
        status: 'submitted',
        submittedAt: new Date().toISOString()
      });
      
      // Validate the model
      const validation = validateModel(report);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
      
      const apiData = transformToAPI(report);
      const data = await apiClient.post(API_ROUTES.endOfAttachmentReports.submitText, apiData);
      return transformToModel(data, EndOfAttachmentReport);
    } catch (error) {
      console.error('Error submitting text report:', error);
      throw transformError(error);
    }
  }

  // Submit PDF report
  async submitPdfReport(formData) {
    try {
      // Validate file before sending
      const file = formData.get('pdf_report');
      if (!file) {
        throw new Error('PDF file is required');
      }
      
      // Validate file type
      if (!EndOfAttachmentReport.isValidPdfFile(file.name)) {
        throw new Error('Only PDF files are allowed');
      }
      
      // Validate file size
      if (!EndOfAttachmentReport.validatePdfFileSize(file.size)) {
        throw new Error(`File size too large. Maximum size is ${Math.round(EndOfAttachmentReport.getMaxPdfFileSize() / (1024 * 1024))}MB`);
      }
      
      // Create multipart form data request
      const response = await fetch(`${import.meta.env.VITE_API_URL || "https://iams-backend.onrender.com/api"}${API_ROUTES.endOfAttachmentReports.submitPdf}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('iams_token')}`,
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data?.message || `HTTP Error: ${response.status}`);
      }
      
      return transformToModel(data, EndOfAttachmentReport);
    } catch (error) {
      console.error('Error submitting PDF report:', error);
      throw transformError(error);
    }
  }

  // Get current student's reports
  async getMyReports() {
    try {
      const data = await apiClient.get(API_ROUTES.endOfAttachmentReports.myReports);
      return {
        ...data,
        data: transformToModel(data.data || data, EndOfAttachmentReport)
      };
    } catch (error) {
      console.error('Error fetching my reports:', error);
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

  // Download PDF report
  async downloadReport(id) {
    try {
      const token = localStorage.getItem('iams_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || "https://iams-backend.onrender.com/api"}${API_ROUTES.endOfAttachmentReports.download(id)}`, {
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

  // Get all reports (Admin/University Supervisor)
  async getAllReports(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `${API_ROUTES.endOfAttachmentReports.list}?${queryString}` : API_ROUTES.endOfAttachmentReports.list;
      
      const data = await apiClient.get(endpoint);
      return {
        ...data,
        data: transformToModel(data.data || data, EndOfAttachmentReport)
      };
    } catch (error) {
      console.error('Error fetching all reports:', error);
      throw transformError(error);
    }
  }

  // Review report (Admin/University Supervisor)
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

  // Download PDF report (Admin/University Supervisor)
  async staffDownloadReport(id) {
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

  // Create FormData for PDF upload
  createPdfFormData(attachmentId, file) {
    const formData = new FormData();
    formData.append('attachment_id', attachmentId);
    formData.append('pdf_report', file);
    return formData;
  }

  // Validate report submission eligibility
  validateSubmissionEligibility(attachment) {
    if (!attachment) {
      throw new Error('Attachment is required');
    }
    
    const eligibleStatuses = ['active', 'completed'];
    if (!eligibleStatuses.includes(attachment.status)) {
      throw new Error('Attachment must be active or completed to submit a report');
    }
    
    return true;
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
      reviewedBy: reportModel.reviewedBy
    };
  }
}

const endOfAttachmentReportService = new EndOfAttachmentReportService();
export { endOfAttachmentReportService };
export default endOfAttachmentReportService;
