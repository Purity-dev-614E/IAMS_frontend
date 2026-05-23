import { apiClient } from '../../../../apis';
import { API_ROUTES } from '../../../../apis/apiRoutes';
import { weeklyReviewService } from '../../../../student/reviews/services/weeklyReviewService';

const getFirst = (source, keys, fallback = '') => {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }
  return fallback;
};

const extractArray = (response, keys) => {
  if (Array.isArray(response)) return response;
  for (const key of keys) {
    const value = response?.[key] || response?.data?.[key];
    if (Array.isArray(value)) return value;
  }
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
};

class SupervisorReviewService {
  extractReviews(response) {
    return extractArray(response, ['reviews', 'weeklyReviews', 'weekly_reviews']);
  }

  extractAttachments(response) {
    return extractArray(response, ['attachments']);
  }

  getReviewId(review) {
    return getFirst(review, ['id', 'reviewId', 'review_id', 'weekly_review_id', 'weeklyReviewId'], null);
  }

  getWeekNumber(review) {
    return getFirst(review, ['week_number', 'weekNumber', 'week'], null);
  }

  hasIndustryFeedback(review) {
    const nested = review.industry_feedback || review.industryFeedback || {};

    return Boolean(
      getFirst(review, ['industry_feedback_date', 'industryFeedbackDate'], null) ||
      getFirst(review, ['feedback_submitted_at', 'submitted_at'], null) ||
      getFirst(review, ['industry_comments', 'industryComments', 'comments', 'feedback'], null) ||
      getFirst(review, ['industry_improvements', 'industryImprovements', 'industry_recommendations', 'improvement_suggestions', 'improvements'], null) ||
      getFirst(review, ['industry_approval', 'industryApproval', 'approval', 'decision'], null) ||
      getFirst(nested, ['submitted_at', 'submittedAt', 'feedback_date', 'comments', 'comment', 'feedback', 'improvements', 'recommendations', 'approval', 'decision'], null)
    );
  }

  hasUniversityFeedback(review) {
    const nested = review.uni_feedback || review.uniFeedback || review.university_feedback || review.universityFeedback || {};

    return Boolean(
      getFirst(review, ['uni_feedback_date', 'uniFeedbackDate'], null) ||
      getFirst(review, ['uni_comments', 'uniComments', 'university_comments'], null) ||
      getFirst(review, ['uni_improvements', 'uniImprovements', 'uni_recommendations'], null) ||
      getFirst(review, ['uni_rating', 'uniRating', 'university_rating'], null) ||
      getFirst(nested, ['submitted_at', 'submittedAt', 'feedback_date', 'comments', 'comment', 'feedback', 'improvements', 'recommendations', 'rating'], null) ||
      String(getFirst(review, ['status'], '')).toLowerCase() === 'complete'
    );
  }

  formatDateRange(startDate, endDate) {
    if (!startDate || !endDate) return 'Dates unavailable';
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'Dates unavailable';

    return `${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  }

  normalizeDailyLogs(logs = []) {
    return logs.map((log) => {
      const rawDate = getFirst(log, ['log_date', 'logDate', 'date', 'created_at'], null);
      const date = rawDate ? new Date(rawDate) : null;
      const hasValidDate = date && !Number.isNaN(date.getTime());
      const rawStatus = String(getFirst(log, ['status'], 'submitted')).toLowerCase();
      const missing = rawStatus === 'missing';

      return {
        id: getFirst(log, ['id'], rawDate),
        day: hasValidDate ? date.toLocaleDateString('en-GB', { weekday: 'short' }) : getFirst(log, ['day'], 'Log'),
        date: hasValidDate ? date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : getFirst(log, ['dateLabel', 'date'], ''),
        tasks: getFirst(log, ['tasks_performed', 'tasksPerformed', 'tasks', 'activity', 'description'], ''),
        skills: getFirst(log, ['skills_acquired', 'skillsAcquired', 'skills'], ''),
        missing: missing ? 'No log submitted for this day.' : '',
        status: missing ? 'Missing' : rawStatus === 'draft' ? 'Draft' : 'Submitted'
      };
    });
  }

  normalizeIndustryFeedback(review, activeAttachment) {
    if (!this.hasIndustryFeedback(review)) {
      return { waiting: true };
    }

    const nested = review.industry_feedback || review.industryFeedback || {};
    const approval = String(getFirst(review, ['industry_approval', 'industryApproval', 'approval', 'decision'], getFirst(nested, ['approval', 'decision'], 'approved'))).toLowerCase();
    const supervisorName = getFirst(
      review,
      ['industry_supervisor_name', 'industrySupervisorName'],
      activeAttachment?.industry_supervisor_name || 'Industry Supervisor'
    );

    return {
      waiting: false,
      color: approval === 'rejected' ? 'amber' : 'green',
      supervisorInitials: supervisorName.split(' ').filter(Boolean).map(part => part[0]).join('').toUpperCase().slice(0, 2) || 'IS',
      supervisorName,
      supervisorRole: 'Industry Supervisor',
      status: approval === 'rejected' ? 'Rejected' : 'Approved',
      comments: getFirst(review, ['industry_comments', 'industryComments', 'comments', 'feedback'], getFirst(nested, ['comments', 'comment', 'feedback'], 'No comments provided.')),
      improvements: getFirst(
        review,
        ['industry_improvements', 'industryImprovements', 'industry_recommendations', 'improvement_suggestions', 'improvements'],
        getFirst(nested, ['improvements', 'recommendations', 'suggestions', 'improvement_suggestions'], '')
      )
    };
  }

  normalizeUniversityFeedback(review) {
    if (!this.hasUniversityFeedback(review)) return null;
    const nested = review.uni_feedback || review.uniFeedback || review.university_feedback || review.universityFeedback || {};

    return {
      comments: getFirst(review, ['uni_comments', 'uniComments', 'university_comments'], getFirst(nested, ['comments', 'comment', 'feedback'], '')),
      improvements: getFirst(review, ['uni_improvements', 'uniImprovements', 'uni_recommendations'], getFirst(nested, ['improvements', 'recommendations', 'suggestions'], '')),
      rating: getFirst(review, ['uni_rating', 'uniRating', 'university_rating'], getFirst(nested, ['rating'], '')),
      submittedDate: getFirst(review, ['uni_feedback_date', 'uniFeedbackDate', 'university_feedback_date'], getFirst(nested, ['submitted_at', 'submittedAt', 'feedback_date'], null))
    };
  }

  async normalizeReview(review, activeAttachment) {
    const reviewId = this.getReviewId(review);
    const weekNumber = this.getWeekNumber(review);
    const startDate = getFirst(review, ['week_start_date', 'weekStartDate'], null);
    const endDate = getFirst(review, ['week_end_date', 'weekEndDate'], null);
    const nestedLogs = extractArray(review, ['logs', 'dailyLogs', 'daily_logs']);
    const fetchedLogs = nestedLogs.length > 0 ? nestedLogs : await weeklyReviewService.getReviewLogs(review);
    const hasIndustry = this.hasIndustryFeedback(review);
    const hasUni = this.hasUniversityFeedback(review);

    return {
      ...review,
      id: reviewId,
      weekId: weekNumber,
      weekNumber,
      dates: this.formatDateRange(startDate, endDate),
      status: hasUni ? 'Complete' : hasIndustry ? 'Needs feedback' : 'Pending',
      needsFeedback: hasIndustry && !hasUni,
      isCurrent: false,
      stages: {
        logs: fetchedLogs.length > 0 ? 'done' : 'wait',
        industry: hasIndustry ? 'done' : 'wait',
        feedback: hasUni ? 'done' : 'wait'
      },
      dailyLogs: this.normalizeDailyLogs(fetchedLogs),
      industryFeedback: this.normalizeIndustryFeedback(review, activeAttachment),
      myFeedback: this.normalizeUniversityFeedback(review)
    };
  }

  async normalizeReviews(reviews = [], activeAttachment = null) {
    const sortedReviews = [...reviews].sort((a, b) => Number(this.getWeekNumber(b)) - Number(this.getWeekNumber(a)));
    const normalized = await Promise.all(sortedReviews.map(review => this.normalizeReview(review, activeAttachment)));
    if (normalized[0]) normalized[0].isOpen = true;
    return normalized;
  }

  async submitUniversityFeedback(reviewId, feedback) {
    const payload = {
      uni_comments: feedback.comments,
      uni_improvements: feedback.improvements || '',
      uni_rating: feedback.rating || null,
      status: 'complete'
    };

    const attempts = [
      () => apiClient.post(`/weekly-reviews/${reviewId}/university-feedback`, payload),
      () => apiClient.put(API_ROUTES.weeklyReviews.byId(reviewId), payload),
      () => apiClient.put(API_ROUTES.weeklyReviews.updateStatus(reviewId), payload)
    ];

    let lastError;
    for (const attempt of attempts) {
      try {
        return await attempt();
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  }
}

export const supervisorReviewService = new SupervisorReviewService();
export default supervisorReviewService;
