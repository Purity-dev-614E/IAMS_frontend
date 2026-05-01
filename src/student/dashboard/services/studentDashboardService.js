// import { apiClient } from '../../../apis';

// API integration service for student dashboard
// Commented out for now - will be re-enabled when backend integration is ready
/*
export const studentDashboardService = {
  // Fetch student dashboard data
  async fetchDashboardData() {
    try {
      const data = await apiClient.get('/dashboard/student');
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch dashboard data');
      }

      return data.dashboard;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  // Transform student data for components
  transformStudentData(student) {
    return {
      id: student.id,
      name: student.student_name,
      email: student.student_email,
      regNumber: student.reg_number,
      program: student.program,
      yearOfStudy: student.year_of_study,
      supervisorName: student.supervisor_name,
      supervisorEmail: student.supervisor_email,
      initials: student.student_name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    };
  },

  // Transform attachment data for components
  transformAttachmentData(attachment) {
    if (!attachment) return null;

    return {
      id: attachment.id,
      organizationName: attachment.organization_name,
      industrySupervisorName: attachment.industry_supervisor_name,
      industrySupervisorEmail: attachment.industry_supervisor_email,
      startDate: new Date(attachment.start_date),
      endDate: new Date(attachment.end_date),
      status: attachment.status,
      duration: this.calculateDuration(attachment.start_date, attachment.end_date)
    };
  },

  // Transform statistics for components
  transformStatistics(stats) {
    return {
      dailyLogs: {
        total: parseInt(stats.dailyLogs.total_logs) || 0,
        draft: parseInt(stats.dailyLogs.draft_logs) || 0,
        submitted: parseInt(stats.dailyLogs.submitted_logs) || 0,
        lastLogDate: stats.dailyLogs.last_log_date ? new Date(stats.dailyLogs.last_log_date) : null
      },
      weeklyReviews: {
        total: stats.weeklyReviews.total || 0,
        pending: stats.weeklyReviews.pending || 0,
        industryReviewed: stats.weeklyReviews.industry_reviewed || 0,
        uniReviewed: stats.weeklyReviews.uni_reviewed || 0,
        complete: stats.weeklyReviews.complete || 0
      }
    };
  },

  // Transform weekly reviews for components
  transformWeeklyReviews(reviews) {
    return reviews.map(review => ({
      id: review.id,
      weekNumber: review.week_number,
      weekStartDate: new Date(review.week_start_date),
      weekEndDate: new Date(review.week_end_date),
      status: review.status,
      industryApproval: review.industry_approval,
      industryComments: review.industry_comments,
      industryFeedbackDate: review.industry_feedback_date ? new Date(review.industry_feedback_date) : null,
      uniRating: review.uni_rating,
      uniComments: review.uni_comments,
      uniSupervisorName: review.uni_supervisor_name
    }));
  },

  // Calculate duration between two dates
  calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const remainingDays = diffDays % 7;

    if (diffWeeks > 0) {
      return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''}${remainingDays > 0 ? ` ${remainingDays} day${remainingDays > 1 ? 's' : ''}` : ''}`;
    }
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  },

  // Check if log is due today
  isLogDueToday(lastLogDate) {
    if (!lastLogDate) return true;
    
    const today = new Date();
    const lastLog = new Date(lastLogDate);
    
    return today.toDateString() !== lastLog.toDateString();
  },

  // Get completion percentage for weekly reviews
  getReviewCompletionPercentage(stats) {
    const total = stats.weeklyReviews.total || 0;
    const complete = stats.weeklyReviews.complete || 0;
    
    if (total === 0) return 0;
    return Math.round((complete / total) * 100);
  }
};
*/
