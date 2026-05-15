import { apiClient } from '../../../apis';
import { API_ROUTES } from '../../../apis/apiRoutes';

export const adminDashboardService = {
  // Fetch admin dashboard data
  async fetchDashboardData() {
    try {
      const data = await apiClient.get(API_ROUTES.dashboard.admin);
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch admin dashboard data');
      }

      return data.dashboard;
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
      throw error;
    }
  },

  // Transform system statistics for the grid
  transformSystemStats(stats) {
    if (!stats) return [];
    
    return [
      {
        label: 'Total students',
        value: stats.total_students || 0,
        sub: 'registered this cohort',
        trend: 'up',
        trendText: `Total users: ${stats.total_users || 0}`
      },
      {
        label: 'Active attachments',
        value: stats.active_attachments || 0,
        sub: `of ${stats.total_attachments || 0} attachments`,
        trend: stats.pending_attachments > 0 ? 'warn' : 'up',
        trendText: `${stats.pending_attachments || 0} pending activation`
      },
      {
        label: 'Daily logs',
        value: stats.submitted_daily_logs || 0,
        sub: 'total logs submitted',
        trend: 'up',
        trendText: `${stats.draft_daily_logs || 0} currently in draft`
      },
      {
        label: 'Reviews complete',
        value: stats.complete_weekly_reviews || 0,
        sub: `of ${stats.total_weekly_reviews || 0} reviews`,
        trend: stats.pending_weekly_reviews > 0 ? 'warn' : 'up',
        trendText: `${stats.pending_weekly_reviews || 0} still pending`
      }
    ];
  },

  // Fetch pending supervisors
  async fetchPendingSupervisors() {
    try {
      const data = await apiClient.get(API_ROUTES.users.pendingSupervisors);
      return data.users || [];
    } catch (error) {
      console.error('Error fetching pending supervisors:', error);
      return [];
    }
  },

  // Fetch new students
  async fetchNewStudents() {
    try {
      // Fetching from students list with a limit to get the most recent ones
      const data = await apiClient.get(`${API_ROUTES.students.list}?limit=5&sort=created_at:desc`);
      return data.students || [];
    } catch (error) {
      console.error('Error fetching new students:', error);
      return [];
    }
  },

  // Transform recent activity
  transformRecentActivity(activity) {
    if (!activity || !Array.isArray(activity)) return [];
    
    return activity.map(item => {
      let icon = 'var(--blue)';
      if (item.status === 'submitted') icon = 'var(--green)';
      if (item.status === 'pending') icon = 'var(--amber)';
      if (item.status === 'flagged') icon = 'var(--red)';
      
      return {
        id: item.id,
        icon,
        text: `<strong>${item.student_name}</strong> submitted log for ${item.organization_name}`,
        time: this.formatTimeAgo(item.created_at)
      };
    });
  },

  // Helper to format time ago
  formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }
};
