import { apiClient } from '../../../apis';
import { API_ROUTES } from '../../../apis/apiRoutes';
import { DailyLog, transformToModel, transformToAPI, validateModel, transformError } from '../../../models';

class DailyLogService {
  // Get current student's daily logs
  async getMyLogs(page = 1, limit = 20) {
    try {
      const data = await apiClient.get(`${API_ROUTES.dailyLogs.myLogs}?page=${page}&limit=${limit}`);
      return {
        ...data,
        data: transformToModel(data.data || data, DailyLog)
      };
    } catch (error) {
      console.error('Error fetching my logs:', error);
      throw transformError(error);
    }
  }

  // Get logs by attachment ID
  async getLogsByAttachment(attachmentId, page = 1, limit = 20) {
    try {
      const data = await apiClient.get(`${API_ROUTES.dailyLogs.byAttachment(attachmentId)}?page=${page}&limit=${limit}`);
      return {
        ...data,
        data: transformToModel(data.data || data, DailyLog)
      };
    } catch (error) {
      console.error('Error fetching attachment logs:', error);
      throw transformError(error);
    }
  }

  // Get single log by ID
  async getLogById(id) {
    try {
      const data = await apiClient.get(API_ROUTES.dailyLogs.byId(id));
      return transformToModel(data, DailyLog);
    } catch (error) {
      console.error('Error fetching log:', error);
      throw transformError(error);
    }
  }

  // Create new daily log
  async createLog(logData) {
    try {
      const dailyLog = new DailyLog(logData);
      
      // Validate the model
      const validation = validateModel(dailyLog);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
      
      const apiData = transformToAPI(dailyLog);
      const data = await apiClient.post(API_ROUTES.dailyLogs.create, apiData);
      // Return raw response for create operations - log is nested under 'log' key
      return data.log || data;
    } catch (error) {
      console.error('Error creating log:', error);
      throw transformError(error);
    }
  }

  // Update daily log
  async updateLog(id, logData) {
    try {
      const dailyLog = new DailyLog({ ...logData, logId: id });
      
      // Validate the model
      const validation = validateModel(dailyLog);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
      
      const apiData = transformToAPI(dailyLog);
      const data = await apiClient.put(API_ROUTES.dailyLogs.update(id), apiData);
      return transformToModel(data, DailyLog);
    } catch (error) {
      console.error('Error updating log:', error);
      throw transformError(error);
    }
  }

  // Submit daily log for review
  async submitLog(id) {
    try {
      const data = await apiClient.put(API_ROUTES.dailyLogs.submit(id));
      return transformToModel(data, DailyLog);
    } catch (error) {
      console.error('Error submitting log:', error);
      throw transformError(error);
    }
  }

  // Delete daily log
  async deleteLog(id) {
    try {
      const data = await apiClient.delete(API_ROUTES.dailyLogs.delete(id));
      return data;
    } catch (error) {
      console.error('Error deleting log:', error);
      throw transformError(error);
    }
  }

  // Legacy method - kept for backward compatibility
  // Use DailyLog model instead for new code
  sanitizeLogData(data) {
    const dailyLog = new DailyLog(data);
    return transformToAPI(dailyLog);
  }

  // Legacy method - kept for backward compatibility
  // Use DailyLog model methods instead for new code
  formatLogForDisplay(log) {
    return transformToModel(log, DailyLog);
  }

  // Legacy methods - kept for backward compatibility
  // Use DailyLog model methods instead for new code
  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  getTodayDate() {
    return new Date().toISOString().split('T')[0];
  }

  canEditLog(log) {
    const dailyLog = new DailyLog(log);
    return dailyLog.canEdit();
  }

  getLogStatusText(status) {
    const dailyLog = new DailyLog({ status });
    return dailyLog.getStatusDisplay();
  }
}

const dailyLogService = new DailyLogService();
export { dailyLogService };
export default dailyLogService;
