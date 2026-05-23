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

const getNestedFeedback = (review, keys) => {
  for (const key of keys) {
    const value = review?.[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }
  return {};
};

const getFeedbackText = (review, reviewKeys, nested, nestedKeys, fallback = '') => {
  const direct = getFirst(review, reviewKeys, null);
  if (direct && typeof direct !== 'object') return direct;
  if (typeof nested === 'string') return nested;
  if (nested && typeof nested === 'object') {
    const nestedValue = getFirst(nested, nestedKeys, null);
    if (nestedValue && typeof nestedValue !== 'object') return nestedValue;
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

const extractObject = (response, keys) => {
  for (const key of keys) {
    const value = response?.[key] || response?.data?.[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  }
  if (response && typeof response === 'object' && !Array.isArray(response)) return response;
  return {};
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

  hasFetchedIndustryFields(review) {
    return Boolean(
      getFirst(review, ['industry_approval', 'industryApproval'], null) ||
      getFirst(review, ['industry_comments', 'industryComments'], null) ||
      getFirst(review, ['industry_improvements', 'industryImprovements'], null) ||
      getFirst(review, ['industry_feedback_date', 'industryFeedbackDate'], null)
    );
  }

  async getReviewDetails(review) {
    const reviewId = this.getReviewId(review);
    if (!reviewId || this.hasFetchedIndustryFields(review)) return review;

    try {
      const response = await apiClient.get(API_ROUTES.weeklyReviews.byId(reviewId));
      const detailedReview = extractObject(response, ['review', 'weeklyReview', 'weekly_review']);
      return {
        ...review,
        ...detailedReview
      };
    } catch (error) {
      console.error(`Error fetching weekly review details for ${reviewId}:`, error);
      return review;
    }
  }

  hasIndustryFeedback(review) {
    const nested = getNestedFeedback(review, ['industry_feedback', 'industryFeedback']);

    return Boolean(
      getFirst(review, ['industry_feedback_date', 'industryFeedbackDate'], null) ||
      getFirst(review, ['feedback_submitted_at', 'submitted_at'], null) ||
      getFeedbackText(review, ['industry_comments', 'industryComments', 'industry_feedback_comments', 'industryFeedbackComments', 'industry_supervisor_comments', 'supervisor_comments', 'comments', 'feedback_comments', 'feedback'], nested, ['comments', 'comment', 'feedback', 'feedback_comments'], null) ||
      getFeedbackText(review, ['industry_improvements', 'industryImprovements', 'industry_recommendations', 'industryRecommendations', 'improvement_suggestions', 'improvementSuggestions', 'recommendations', 'suggestions', 'improvements'], nested, ['improvements', 'recommendations', 'suggestions', 'improvement_suggestions'], null) ||
      getFirst(review, ['industry_approval', 'industryApproval', 'approval', 'decision'], null) ||
      (typeof nested === 'string' ? nested : getFirst(nested, ['submitted_at', 'submittedAt', 'feedback_date', 'comments', 'comment', 'feedback', 'improvements', 'recommendations', 'approval', 'decision'], null))
    );
  }

  hasUniversityFeedback(review) {
    const nested = getNestedFeedback(review, ['uni_feedback', 'uniFeedback', 'university_feedback', 'universityFeedback']);

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

    const nested = getNestedFeedback(review, ['industry_feedback', 'industryFeedback']);
    const approval = String(getFirst(review, ['industry_approval', 'industryApproval', 'approval', 'decision'], typeof nested === 'object' ? getFirst(nested, ['approval', 'decision'], 'approved') : 'approved')).toLowerCase();
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
      comments: getFeedbackText(
        review,
        ['industry_comments', 'industryComments', 'industry_feedback_comments', 'industryFeedbackComments', 'industry_supervisor_comments', 'supervisor_comments', 'comments', 'feedback_comments', 'feedback'],
        nested,
        ['comments', 'comment', 'feedback', 'feedback_comments'],
        'No comments provided.'
      ),
      improvements: getFeedbackText(
        review,
        ['industry_improvements', 'industryImprovements', 'industry_recommendations', 'industryRecommendations', 'improvement_suggestions', 'improvementSuggestions', 'recommendations', 'suggestions', 'improvements'],
        nested,
        ['improvements', 'recommendations', 'suggestions', 'improvement_suggestions'],
        ''
      )
    };
  }

  normalizeUniversityFeedback(review) {
    if (!this.hasUniversityFeedback(review)) return null;
    const nested = getNestedFeedback(review, ['uni_feedback', 'uniFeedback', 'university_feedback', 'universityFeedback']);

    return {
      comments: getFirst(review, ['uni_comments', 'uniComments', 'university_comments'], getFirst(nested, ['comments', 'comment', 'feedback'], '')),
      improvements: getFirst(review, ['uni_improvements', 'uniImprovements', 'uni_recommendations'], getFirst(nested, ['improvements', 'recommendations', 'suggestions'], '')),
      rating: getFirst(review, ['uni_rating', 'uniRating', 'university_rating'], getFirst(nested, ['rating'], '')),
      submittedDate: getFirst(review, ['uni_feedback_date', 'uniFeedbackDate', 'university_feedback_date'], getFirst(nested, ['submitted_at', 'submittedAt', 'feedback_date'], null))
    };
  }

  async normalizeReview(review, activeAttachment) {
    const detailedReview = await this.getReviewDetails(review);
    const reviewId = this.getReviewId(detailedReview);
    const weekNumber = this.getWeekNumber(detailedReview);
    const startDate = getFirst(detailedReview, ['week_start_date', 'weekStartDate'], null);
    const endDate = getFirst(detailedReview, ['week_end_date', 'weekEndDate'], null);
    const nestedLogs = extractArray(detailedReview, ['logs', 'dailyLogs', 'daily_logs']);
    const fetchedLogs = nestedLogs.length > 0 ? nestedLogs : await weeklyReviewService.getReviewLogs(detailedReview);
    const hasIndustry = this.hasIndustryFeedback(detailedReview);
    const hasUni = this.hasUniversityFeedback(detailedReview);

    return {
      ...detailedReview,
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
      industryFeedback: this.normalizeIndustryFeedback(detailedReview, activeAttachment),
      myFeedback: this.normalizeUniversityFeedback(detailedReview)
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
