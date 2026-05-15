import { apiClient } from '../../../apis';
import { API_ROUTES } from '../../../apis/apiRoutes';
import { Student, Attachment, WeeklyReview, transformToModel } from '../../../models';

// API integration service for student dashboard
export const studentDashboardService = {
  // Fetch student dashboard data
  async fetchDashboardData() {
    try {
      const data = await apiClient.get(API_ROUTES.dashboard.student);
      
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
    if (!student) return null;
    
    // The backend returns snake_case fields, Student model handles them
    const studentModel = transformToModel(student, Student);
    
    return {
      id: studentModel.studentId,
      name: student.student_name,
      email: student.student_email,
      regNumber: studentModel.registrationNumber,
      program: studentModel.program,
      yearOfStudy: studentModel.yearOfStudy,
      supervisorName: student.supervisor_name,
      supervisorEmail: student.supervisor_email,
      attachmentCount: student.attachment_count,
      initials: (student.student_name || '')
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || '??'
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
      startDate: attachmentModel.startDate ? new Date(attachmentModel.startDate) : null,
      endDate: attachmentModel.endDate ? new Date(attachmentModel.endDate) : null,
      status: attachmentModel.status,
      duration: attachmentModel.getDurationInDays ? attachmentModel.getDurationInDays() : 0
    };
  },

  // Transform statistics for components
  transformStatistics(stats) {
    if (!stats) return null;
    
    return {
      dailyLogs: {
        total: parseInt(stats.dailyLogs?.total_logs) || 0,
        draft: parseInt(stats.dailyLogs?.draft_logs) || 0,
        submitted: parseInt(stats.dailyLogs?.submitted_logs) || 0,
        lastLogDate: stats.dailyLogs?.last_log_date ? new Date(stats.dailyLogs.last_log_date) : null
      },
      weeklyReviews: {
        total: stats.weeklyReviews?.total || 0,
        pending: stats.weeklyReviews?.pending || 0,
        industryReviewed: stats.weeklyReviews?.industry_reviewed || 0,
        uniReviewed: stats.weeklyReviews?.uni_reviewed || 0,
        complete: stats.weeklyReviews?.complete || 0
      }
    };
  },

  // Transform weekly reviews for components using WeeklyReview model
  transformWeeklyReviews(reviews) {
    if (!reviews || !Array.isArray(reviews)) return [];
    
    return reviews.map(review => {
      const reviewModel = transformToModel(review, WeeklyReview);
      return {
        id: reviewModel.reviewId,
        weekNumber: reviewModel.weekNumber,
        weekStartDate: reviewModel.weekStartDate ? new Date(reviewModel.weekStartDate) : null,
        weekEndDate: reviewModel.weekEndDate ? new Date(reviewModel.weekEndDate) : null,
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
    if (!startDate || !endDate) return 'N/A';
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
    if (!stats || !stats.weeklyReviews) return 0;
    const total = stats.weeklyReviews.total || 0;
    const complete = stats.weeklyReviews.complete || 0;
    
    if (total === 0) return 0;
    return Math.round((complete / total) * 100);
  }
};
