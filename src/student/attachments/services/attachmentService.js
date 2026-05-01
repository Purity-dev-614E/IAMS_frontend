import { apiClient } from '../../../apis';
import { API_ROUTES } from '../../../apis/apiRoutes';

class StudentAttachmentService {
  // Get current student's attachments
  async getMyAttachments() {
    try {
      const data = await apiClient.get(API_ROUTES.attachments.myAttachments);
      return data;
    } catch (error) {
      console.error('Error fetching my attachments:', error);
      throw new Error('Failed to load your attachments. Please try again.');
    }
  }

  // Get attachment by ID
  async getAttachmentById(id) {
    try {
      const data = await apiClient.get(API_ROUTES.attachments.byId(id));
      return data;
    } catch (error) {
      console.error('Error fetching attachment:', error);
      if (error.message.includes('404') || error.message.includes('not found')) {
        throw new Error('Attachment not found');
      }
      throw error;
    }
  }

  // Create new attachment
  async createAttachment(attachmentData) {
    try {
      const sanitizedData = this.sanitizeAttachmentData(attachmentData);
      const data = await apiClient.post(API_ROUTES.attachments.create, sanitizedData);
      return data;
    } catch (error) {
      console.error('Error creating attachment:', error);
      throw new Error('Failed to submit attachment. Please check your information and try again.');
    }
  }

  // Update attachment
  async updateAttachment(id, attachmentData) {
    try {
      const sanitizedData = this.sanitizeAttachmentData(attachmentData);
      const data = await apiClient.put(API_ROUTES.attachments.update(id), sanitizedData);
      return data;
    } catch (error) {
      console.error('Error updating attachment:', error);
      throw new Error('Failed to update attachment. Please try again.');
    }
  }

  // Submit attachment for activation
  async submitForActivation(id) {
    try {
      const data = await apiClient.post(`/attachments/${id}/submit`);
      return data;
    } catch (error) {
      console.error('Error submitting attachment for activation:', error);
      throw new Error('Failed to submit attachment for activation. Please try again.');
    }
  }

  // Get attachment progress
  async getAttachmentProgress(id) {
    try {
      const data = await apiClient.get(`/attachments/${id}/progress`);
      return data;
    } catch (error) {
      console.error('Error fetching attachment progress:', error);
      throw new Error('Failed to load attachment progress.');
    }
  }

  // Get attachment logs
  async getAttachmentLogs(id) {
    try {
      const data = await apiClient.get(API_ROUTES.dailyLogs.byAttachment(id));
      return data;
    } catch (error) {
      console.error('Error fetching attachment logs:', error);
      throw new Error('Failed to load attachment logs.');
    }
  }

  // Get attachment weekly reviews
  async getAttachmentReviews(id) {
    try {
      const data = await apiClient.get(API_ROUTES.weeklyReviews.byAttachment(id));
      return data;
    } catch (error) {
      console.error('Error fetching attachment reviews:', error);
      throw new Error('Failed to load attachment reviews.');
    }
  }

  // Helper method to sanitize attachment data
  sanitizeAttachmentData(data) {
    const sanitized = { ...data };
    
    // Remove any unwanted fields
    delete sanitized.id;
    delete sanitized.createdAt;
    delete sanitized.updatedAt;
    delete sanitized.status;
    
    // Debug logging
    console.log('Sanitizing attachment data:', sanitized);
    
    // Map frontend field names to backend field names
    const mapped = {
      organization_name: sanitized.organization,
      department: sanitized.department,
      industry_supervisor_name: sanitized.industrySupervisor,
      industry_supervisor_email: sanitized.industrySupervisorEmail,
      start_date: sanitized.startDate,
      end_date: sanitized.endDate
    };
    
    console.log('Mapped attachment data:', mapped);
    
    // Ensure required fields are present
    if (!mapped.organization_name) {
      throw new Error('Organization name is required');
    }
    if (!mapped.department) {
      throw new Error('Department is required');
    }
    if (!mapped.start_date) {
      throw new Error('Start date is required');
    }
    if (!mapped.end_date) {
      throw new Error('End date is required');
    }
    
    return mapped;
  }

  // Validate attachment dates
  validateDates(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    
    if (start > end) {
      throw new Error('Start date cannot be after end date');
    }
    
    if (start < today.setHours(0, 0, 0, 0)) {
      throw new Error('Start date cannot be in the past');
    }
    
    return true;
  }

  // Calculate attachment duration in weeks
  calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
  }

  // Format attachment data for display
  formatAttachmentForDisplay(attachment) {
    return {
      ...attachment,
      duration: attachment.duration || this.calculateDuration(attachment.startDate, attachment.endDate),
      status: attachment.status || 'Draft',
      submissionDate: attachment.submissionDate || new Date().toISOString(),
    };
  }
}

const attachmentService = new StudentAttachmentService();
export { attachmentService };
export default attachmentService;
