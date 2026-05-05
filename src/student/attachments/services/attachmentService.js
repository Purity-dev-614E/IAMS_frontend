import { apiClient } from '../../../apis';
import { API_ROUTES } from '../../../apis/apiRoutes';
import { Attachment, transformToModel, transformToAPI, validateModel, transformError } from '../../../models';

class StudentAttachmentService {
  // Get current student's attachments
  async getMyAttachments() {
    try {
      const data = await apiClient.get(API_ROUTES.attachments.myAttachments);
      return {
        ...data,
        data: transformToModel(data.data || data, Attachment)
      };
    } catch (error) {
      console.error('Error fetching my attachments:', error);
      throw transformError(error);
    }
  }

  // Get attachment by ID
  async getAttachmentById(id) {
    try {
      const data = await apiClient.get(API_ROUTES.attachments.byId(id));
      return transformToModel(data, Attachment);
    } catch (error) {
      console.error('Error fetching attachment:', error);
      throw transformError(error);
    }
  }

  // Create new attachment
  async createAttachment(attachmentData) {
    try {
      const attachment = new Attachment(attachmentData);
      
      // Validate the model
      const validation = validateModel(attachment);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
      
      const apiData = transformToAPI(attachment);
      const data = await apiClient.post(API_ROUTES.attachments.create, apiData);
      return transformToModel(data, Attachment);
    } catch (error) {
      console.error('Error creating attachment:', error);
      throw transformError(error);
    }
  }

  // Update attachment
  async updateAttachment(id, attachmentData) {
    try {
      const attachment = new Attachment({ ...attachmentData, attachmentId: id });
      
      // Validate the model
      const validation = validateModel(attachment);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
      
      const apiData = transformToAPI(attachment);
      const data = await apiClient.put(API_ROUTES.attachments.update(id), apiData);
      return transformToModel(data, Attachment);
    } catch (error) {
      console.error('Error updating attachment:', error);
      throw transformError(error);
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
      return {
        ...data,
        data: data.data || data // Will be transformed by DailyLog service if needed
      };
    } catch (error) {
      console.error('Error fetching attachment logs:', error);
      throw transformError(error);
    }
  }

  // Get attachment weekly reviews
  async getAttachmentReviews(id) {
    try {
      const data = await apiClient.get(API_ROUTES.weeklyReviews.byAttachment(id));
      return {
        ...data,
        data: data.data || data // Will be transformed by WeeklyReview service if needed
      };
    } catch (error) {
      console.error('Error fetching attachment reviews:', error);
      throw transformError(error);
    }
  }

  // Legacy method - kept for backward compatibility
  // Use Attachment model instead for new code
  sanitizeAttachmentData(data) {
    const attachment = new Attachment(data);
    return transformToAPI(attachment);
  }

  // Validate attachment dates using Attachment model
  validateDates(startDate, endDate) {
    const attachment = new Attachment({ startDate, endDate });
    return attachment.getDurationInDays() >= 0;
  }

  // Calculate attachment duration using Attachment model
  calculateDuration(startDate, endDate) {
    const attachment = new Attachment({ startDate, endDate });
    return attachment.getDurationInDays();
  }

  // Format attachment data for display using Attachment model
  formatAttachmentForDisplay(attachment) {
    const attachmentModel = new Attachment(attachment);
    return {
      ...attachment,
      // Map API field names to frontend component prop names using model
      organization: attachmentModel.organizationName,
      industrySupervisor: attachmentModel.industrySupervisorName,
      industrySupervisorEmail: attachmentModel.industrySupervisorEmail,
      startDate: attachmentModel.startDate,
      endDate: attachmentModel.endDate,
      department: attachment.department || '',
      universitySupervisor: attachment.university_supervisor || 'Not yet assigned',
      duration: attachment.duration || attachmentModel.getDurationInDays(),
      status: attachmentModel.status || 'Draft',
      submissionDate: attachment.created_at || new Date().toISOString(),
      activationDate: attachment.activation_date,
      lastLogDate: attachment.last_log_date,
      currentWeek: attachment.current_week,
      progress: attachment.progress
    };
  }
}

const attachmentService = new StudentAttachmentService();
export { attachmentService };
export default attachmentService;
