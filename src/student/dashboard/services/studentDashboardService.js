import { apiClient } from '../../../apis';
import { API_ROUTES } from '../../../apis/apiRoutes';
import { Student, Attachment, WeeklyReview, transformToModel } from '../../../models';

const getFirst = (source, keys, fallback = '') => {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return fallback;
};

const toDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

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
      const industryFeedback = review.industry_feedback || review.industryFeedback || {};
      const uniFeedback = review.uni_feedback || review.uniFeedback || review.university_feedback || review.universityFeedback || {};
      const industryApproval = getFirst(review, ['industry_approval', 'industryApproval', 'approval', 'decision'], getFirst(industryFeedback, ['approval', 'decision'], ''));
      const industryComments = getFirst(review, ['industry_comments', 'industryComments', 'comments', 'feedback'], getFirst(industryFeedback, ['comments', 'comment', 'feedback'], ''));
      const industryFeedbackDate = getFirst(
        review,
        ['industry_feedback_date', 'industryFeedbackDate', 'feedback_submitted_at', 'submitted_at'],
        getFirst(industryFeedback, ['submitted_at', 'submittedAt', 'feedback_date', 'feedbackDate'], '')
      );
      const uniComments = getFirst(review, ['uni_comments', 'uniComments', 'university_comments'], getFirst(uniFeedback, ['comments', 'comment', 'feedback'], ''));
      const uniRating = getFirst(review, ['uni_rating', 'uniRating', 'university_rating'], getFirst(uniFeedback, ['rating'], ''));
      const uniFeedbackDate = getFirst(review, ['uni_feedback_date', 'uniFeedbackDate', 'university_feedback_date'], getFirst(uniFeedback, ['submitted_at', 'submittedAt'], ''));
      const hasUniFeedback = Boolean(uniFeedbackDate || uniComments || uniRating);
      const status = hasUniFeedback ? 'complete' : (reviewModel.status || review.status || 'pending');

      return {
        id: reviewModel.reviewId,
        weekNumber: reviewModel.weekNumber,
        weekStartDate: toDate(reviewModel.weekStartDate),
        weekEndDate: toDate(reviewModel.weekEndDate),
        status,
        industryApproval,
        industryComments,
        industryFeedbackDate: toDate(industryFeedbackDate),
        uniRating,
        uniComments,
        uniFeedbackDate: toDate(uniFeedbackDate),
        uniSupervisorName: getFirst(review, ['uni_supervisor_name', 'uniSupervisorName', 'supervisor_name'], '')
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
