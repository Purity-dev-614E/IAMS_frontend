import { apiClient } from '../../../apis';
import { API_ROUTES } from '../../../apis/apiRoutes';

// API integration service for university supervisor dashboard
export const uniSupDashboardService = {
  // Fetch supervisor dashboard data
  async fetchDashboardData() {
    try {
      const data = await apiClient.get(API_ROUTES.dashboard.supervisor);
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch supervisor dashboard data');
      }

      return data.dashboard;
    } catch (error) {
      console.error('Error fetching supervisor dashboard data:', error);
      throw error;
    }
  },

  // Transform supervisor overview stats
  transformOverviewStats(supervisor) {
    if (!supervisor) return null;
    return {
      totalStudents: supervisor.totalStudents || 0,
      activeAttachments: supervisor.activeAttachments || 0,
      pendingAttachments: supervisor.pendingAttachments || 0
    };
  },

  // Transform review statistics
  transformReviewStats(stats) {
    if (!stats) return null;
    return {
      total: parseInt(stats.total_reviews) || 0,
      pending: parseInt(stats.pending_reviews) || 0,
      industryReviewed: parseInt(stats.industry_reviewed) || 0,
      uniReviewed: parseInt(stats.uni_reviewed) || 0,
      complete: parseInt(stats.complete_reviews) || 0
    };
  },

  // Transform pending industry feedback items
  transformPendingFeedback(items) {
    if (!items || !Array.isArray(items)) return [];
    return items.map(item => ({
      id: item.id,
      weekNumber: item.week_number,
      studentName: item.student_name,
      regNumber: item.reg_number,
      organizationName: item.organization_name,
      startDate: item.week_start_date ? new Date(item.week_start_date) : null,
      endDate: item.week_end_date ? new Date(item.week_end_date) : null
    }));
  },

  // Transform students with overdue logs
  transformOverdueLogs(items) {
    if (!items || !Array.isArray(items)) return [];
    return items.map(item => ({
      studentName: item.student_name,
      regNumber: item.reg_number,
      organizationName: item.organization_name,
      lastLogDate: item.last_log_date ? new Date(item.last_log_date) : null
    }));
  }
};
