import { apiClient } from '../../../apis';
import { API_ROUTES } from '../../../apis/apiRoutes';
import { Student, Attachment, DailyLog, WeeklyReview, transformToModel, transformToAPI, validateModel, transformError } from '../../../models';

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

  // Transform student data for components using Student model
  transformStudentData(student) {
    const studentModel = transformToModel(student, Student);
    return {
      id: studentModel.studentId,
      name: student.userName || student.student_name,
      email: student.userEmail || student.student_email,
      regNumber: studentModel.registrationNumber,
      program: studentModel.program,
      yearOfStudy: studentModel.yearOfStudy,
      supervisorName: student.supervisor_name,
      supervisorEmail: student.supervisor_email,
      initials: studentModel.getDisplayName()
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    };
  },

  // Transform attachment data for components using Attachment model
  transformAttachmentData(attachment) {
    if (!attachment) return null;

    const attachmentModel = transformToModel(attachment, Attachment);
    return {
      id: attachmentModel.attachmentId,
      organizationName: attachmentModel.organizationName,
      industrySupervisorName: attachmentModel.industrySupervisorName,
      industrySupervisorEmail: attachmentModel.industrySupervisorEmail,
      startDate: new Date(attachmentModel.startDate),
      endDate: new Date(attachmentModel.endDate),
      status: attachmentModel.status,
      duration: attachmentModel.getDurationInDays()
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

  // Transform weekly reviews for components using WeeklyReview model
  transformWeeklyReviews(reviews) {
    return reviews.map(review => {
      const reviewModel = transformToModel(review, WeeklyReview);
      return {
        id: reviewModel.reviewId,
        weekNumber: reviewModel.weekNumber,
        weekStartDate: new Date(reviewModel.weekStartDate),
        weekEndDate: new Date(reviewModel.weekEndDate),
        status: reviewModel.status,
        industryApproval: reviewModel.industryApproval,
        industryComments: reviewModel.industryComments,
        industryFeedbackDate: reviewModel.industryFeedbackDate ? new Date(reviewModel.industryFeedbackDate) : null,
        uniRating: reviewModel.uniRating,
        uniComments: reviewModel.uniComments,
        uniSupervisorName: reviewModel.uniSupervisorName
      };
    });
  },

  // Calculate duration between two dates using Attachment model
  calculateDuration(startDate, endDate) {
    const attachment = new Attachment({ startDate, endDate });
    const days = attachment.getDurationInDays();
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;

    if (weeks > 0) {
      return `${weeks} week${weeks > 1 ? 's' : ''}${remainingDays > 0 ? ` ${remainingDays} day${remainingDays > 1 ? 's' : ''}` : ''}`;
    }
    return `${days} day${days > 1 ? 's' : ''}`;
  },

  // Check if log is due today using DailyLog model
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
