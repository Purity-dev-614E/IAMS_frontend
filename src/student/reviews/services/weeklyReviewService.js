import { apiClient } from '../../../apis';
import { API_ROUTES } from '../../../apis/apiRoutes';

class WeeklyReviewService {
  async getMyReviews(page = 1, limit = 20) {
    try {
      const response = await apiClient.get(`${API_ROUTES.weeklyReviews.myReviews}?page=${page}&limit=${limit}`);
      const reviews = this.extractReviews(response);
      const pagination = response?.pagination || response?.data?.pagination || {
        page,
        limit,
        total: reviews.length,
        pages: Math.ceil(reviews.length / limit)
      };

      return {
        reviews,
        pagination,
        success: response?.success !== false
      };
    } catch (error) {
      console.error('Error fetching weekly reviews:', error);
      return {
        reviews: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          pages: 0
        },
        success: false
      };
    }
  }

  extractReviews(response) {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.reviews)) return response.reviews;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.reviews)) return response.data.reviews;
    return [];
  }

  async getReviewById(reviewId) {
    try {
      return await apiClient.get(API_ROUTES.weeklyReviews.byId(reviewId));
    } catch (error) {
      console.error('Error fetching weekly review:', error);
      throw error;
    }
  }

  async getReviewsByAttachment(attachmentId, page = 1, limit = 20) {
    try {
      return await apiClient.get(`${API_ROUTES.weeklyReviews.byAttachment(attachmentId)}?page=${page}&limit=${limit}`);
    } catch (error) {
      console.error('Error fetching reviews by attachment:', error);
      throw error;
    }
  }

  async getReviewDailyLogs(reviewId) {
    if (!reviewId) return [];

    try {
      const response = await apiClient.get(API_ROUTES.dailyLogs.byWeeklyReview(reviewId));
      if (Array.isArray(response)) return response;
      if (Array.isArray(response?.logs)) return response.logs;
      if (Array.isArray(response?.dailyLogs)) return response.dailyLogs;
      if (Array.isArray(response?.daily_logs)) return response.daily_logs;
      if (Array.isArray(response?.data)) return response.data;
      if (Array.isArray(response?.data?.logs)) return response.data.logs;
      if (Array.isArray(response?.data?.dailyLogs)) return response.data.dailyLogs;
      if (Array.isArray(response?.data?.daily_logs)) return response.data.daily_logs;
      if (Array.isArray(response?.data?.data)) return response.data.data;
      return [];
    } catch (error) {
      console.error('Error fetching daily logs for weekly review:', error);
      return [];
    }
  }

  async getReviewLogs(review) {
    const reviewId = review.id || review.reviewId || review.weekly_review_id || review.weeklyReviewId;
    if (reviewId) {
      const directLogs = await this.getReviewDailyLogs(reviewId);
      if (directLogs.length > 0) return directLogs;
    }

    const attachmentId = review.attachment_id || review.attachmentId;
    if (attachmentId) {
      try {
        const response = await apiClient.get(this.buildLogsEndpoint(API_ROUTES.dailyLogs.byAttachment(attachmentId), review));
        const logs = this.filterLogsToReviewWeek(this.extractLogs(response), review);
        if (logs.length > 0) return logs;
      } catch (error) {
        console.error('Error fetching attachment logs for weekly review:', error);
      }
    }

    try {
      const response = await apiClient.get(this.buildLogsEndpoint(API_ROUTES.dailyLogs.myLogs, review));
      return this.filterLogsToReviewWeek(this.extractLogs(response), review);
    } catch (error) {
      console.error('Error fetching my logs for weekly review:', error);
      return [];
    }
  }

  buildLogsEndpoint(baseEndpoint, review) {
    const queryParams = new URLSearchParams({ limit: '100' });
    const startDate = review.week_start_date || review.weekStartDate;
    const endDate = review.week_end_date || review.weekEndDate;
    const weekNumber = review.week_number || review.weekNumber;
    const attachmentId = review.attachment_id || review.attachmentId;

    if (startDate) {
      queryParams.append('startDate', startDate);
      queryParams.append('start_date', startDate);
    }

    if (endDate) {
      queryParams.append('endDate', endDate);
      queryParams.append('end_date', endDate);
    }

    if (weekNumber) {
      queryParams.append('week', weekNumber);
      queryParams.append('week_number', weekNumber);
    }

    if (attachmentId && baseEndpoint === API_ROUTES.dailyLogs.myLogs) {
      queryParams.append('attachment_id', attachmentId);
      queryParams.append('attachmentId', attachmentId);
    }

    return `${baseEndpoint}?${queryParams.toString()}`;
  }

  extractLogs(response) {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.logs)) return response.logs;
    if (Array.isArray(response?.dailyLogs)) return response.dailyLogs;
    if (Array.isArray(response?.daily_logs)) return response.daily_logs;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.logs)) return response.data.logs;
    if (Array.isArray(response?.data?.dailyLogs)) return response.data.dailyLogs;
    if (Array.isArray(response?.data?.daily_logs)) return response.data.daily_logs;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    return [];
  }

  filterLogsToReviewWeek(logs, review) {
    const startDate = review.week_start_date || review.weekStartDate;
    const endDate = review.week_end_date || review.weekEndDate;

    if (!startDate || !endDate) return logs;

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return logs;

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return logs.filter((log) => {
      const rawDate = log.log_date || log.logDate || log.date || log.created_at;
      const logDate = rawDate ? new Date(rawDate) : null;
      if (!logDate || Number.isNaN(logDate.getTime())) return false;
      return logDate >= start && logDate <= end;
    });
  }

  async createWeeklyReview(reviewData) {
    try {
      return await apiClient.post(API_ROUTES.weeklyReviews.create, reviewData);
    } catch (error) {
      console.error('Error creating weekly review:', error);
      throw error;
    }
  }

  async createAutomatedReview(attachmentId) {
    try {
      return await apiClient.post(API_ROUTES.weeklyReviews.createAutomated, { attachmentId });
    } catch (error) {
      console.error('Error creating automated weekly review:', error);
      throw error;
    }
  }

  async updateReviewStatus(reviewId, status) {
    try {
      return await apiClient.put(API_ROUTES.weeklyReviews.updateStatus(reviewId), { status });
    } catch (error) {
      console.error('Error updating review status:', error);
      throw error;
    }
  }

  transformReviewData(apiData) {
    const weekNumber = apiData.week_number || apiData.weekNumber;
    const dailyLogs = this.normalizeDailyLogs(
      apiData.daily_logs || apiData.dailyLogs || apiData.logs || []
    );
    const industryFeedback = this.normalizeFeedback(apiData, 'industry');
    const uniFeedback = this.normalizeFeedback(apiData, 'uni');
    const status = this.mapStatus(apiData, industryFeedback, uniFeedback);

    return {
      reviewId: apiData.id || apiData.reviewId,
      week: weekNumber,
      title: weekNumber === this.getCurrentWeek() ? `Week ${weekNumber} - current week` : `Week ${weekNumber}`,
      dates: this.formatDateRange(apiData.week_start_date || apiData.weekStartDate, apiData.week_end_date || apiData.weekEndDate),
      logsSubmitted: apiData.logs_submitted || apiData.logsSubmitted || dailyLogs.filter(log => !log.missing).length,
      totalLogs: apiData.total_logs || apiData.totalLogs || dailyLogs.length || 5,
      status,
      stages: this.getStages(apiData.status, industryFeedback, uniFeedback),
      isCurrent: weekNumber === this.getCurrentWeek(),
      dailyLogs,
      industryFeedback,
      uniFeedback,
      attachmentId: apiData.attachment_id || apiData.attachmentId,
      createdAt: apiData.created_at || apiData.createdAt,
      updatedAt: apiData.updated_at || apiData.updatedAt
    };
  }

  normalizeDailyLogs(logs) {
    if (!Array.isArray(logs)) return [];

    return logs.map((log) => {
      const rawDate = log.log_date || log.date || log.created_at;
      const date = rawDate ? new Date(rawDate) : null;
      const hasValidDate = date && !Number.isNaN(date.getTime());
      const status = String(log.status || '').toLowerCase();
      const isSubmitted = status === 'submitted' || Boolean(log.submitted_at);
      const isDraft = status === 'draft';

      return {
        day: hasValidDate ? date.toLocaleDateString('en-US', { weekday: 'long' }) : (log.day || 'Log'),
        date: hasValidDate ? date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : (log.dateLabel || ''),
        text: this.getLogText(log),
        missing: status === 'missing',
        status: isSubmitted ? 'active' : (isDraft ? 'pending' : (status || 'pending')),
        statusText: isSubmitted ? 'Submitted' : (isDraft ? 'Draft' : this.toTitleCase(status || 'Pending'))
      };
    });
  }

  getLogText(log) {
    const sections = [
      log.tasks_performed || log.tasksPerformed,
      log.skills_acquired || log.skillsAcquired,
      log.observations
    ].filter(Boolean);

    if (sections.length > 0) return sections.join('\n\n');

    return log.activities
      || log.activity
      || log.description
      || log.text
      || log.tasks_completed
      || 'No activity details provided.';
  }

  normalizeFeedback(apiData, type) {
    const nested = type === 'industry'
      ? (apiData.industry_feedback || apiData.industryFeedback)
      : (apiData.uni_feedback || apiData.uniFeedback || apiData.university_feedback || apiData.universityFeedback);

    if (nested) {
      const name = nested.name || nested.supervisor_name || nested.reviewer_name || this.getDefaultFeedbackName(apiData, type);
      const comments = nested.comments || nested.feedback || nested.comment || '';
      const improvements = nested.improvements || nested.recommendations || nested.suggestions || '';
      const submittedAt = nested.submitted_at || nested.submittedAt || nested.feedback_date || nested.feedbackDate || '';
      const approval = nested.approval || nested.decision || '';
      const rating = nested.rating || '';
      const hasFeedback = Boolean(comments || improvements || submittedAt || approval || rating);

      return {
        name,
        role: nested.role || this.getDefaultFeedbackRole(type),
        initials: nested.initials || this.getInitials(name),
        status: nested.status || (hasFeedback ? 'complete' : 'awaiting'),
        comments,
        improvements,
        submittedAt,
        approval,
        rating,
        awaitingMessage: nested.awaitingMessage || this.getAwaitingMessage(type)
      };
    }

    const comments = type === 'industry'
      ? (apiData.industry_comments || apiData.industryComments || apiData.comments || apiData.feedback)
      : (apiData.uni_comments || apiData.uniComments || apiData.university_comments || apiData.universityComments);
    const improvements = type === 'industry'
      ? (apiData.industry_improvements || apiData.industryImprovements || apiData.industry_recommendations || apiData.improvement_suggestions || apiData.improvements)
      : (apiData.uni_improvements || apiData.uniImprovements || apiData.uni_recommendations);
    const submittedAt = type === 'industry'
      ? (apiData.industry_feedback_date || apiData.industryFeedbackDate || apiData.feedback_submitted_at || apiData.submitted_at)
      : (apiData.uni_feedback_date || apiData.uniFeedbackDate || apiData.university_feedback_date);
    const approval = type === 'industry'
      ? (apiData.industry_approval || apiData.industryApproval || apiData.approval || apiData.decision)
      : '';
    const rating = type === 'uni'
      ? (apiData.uni_rating || apiData.uniRating || apiData.university_rating)
      : '';
    const name = this.getDefaultFeedbackName(apiData, type);
    const hasFeedback = Boolean(comments || improvements || submittedAt || approval || rating);

    return {
      name,
      role: this.getDefaultFeedbackRole(type),
      initials: this.getInitials(name),
      status: hasFeedback ? 'complete' : 'awaiting',
      comments: comments || '',
      improvements: improvements || '',
      submittedAt: submittedAt || '',
      approval: approval || '',
      rating: rating || '',
      awaitingMessage: this.getAwaitingMessage(type)
    };
  }

  getDefaultFeedbackName(apiData, type) {
    if (type === 'industry') {
      return apiData.industry_supervisor_name || apiData.industrySupervisorName || 'Industry Supervisor';
    }

    return apiData.uni_supervisor_name || apiData.uniSupervisorName || apiData.supervisor_name || 'University Supervisor';
  }

  getDefaultFeedbackRole(type) {
    return type === 'industry' ? 'Industry Supervisor' : 'University Supervisor';
  }

  getAwaitingMessage(type) {
    return type === 'industry'
      ? 'Industry supervisor feedback has not been submitted for this week yet.'
      : 'University supervisor feedback has not been submitted for this week yet.';
  }

  getInitials(name) {
    return String(name || '')
      .split(' ')
      .filter(Boolean)
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??';
  }

  toTitleCase(value) {
    return String(value)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  getCurrentWeek() {
    return 6;
  }

  formatDateRange(startDate, endDate) {
    if (!startDate || !endDate) return 'Dates unavailable';

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return 'Dates unavailable';
    }

    const options = { day: 'numeric', month: 'short' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)} ${start.getFullYear()}`;
  }

  mapStatus(reviewOrStatus, industryFeedback = null, uniFeedback = null) {
    const status = typeof reviewOrStatus === 'object'
      ? (reviewOrStatus.status || reviewOrStatus.review_status || reviewOrStatus.reviewStatus)
      : reviewOrStatus;

    if (uniFeedback?.status === 'complete') return 'complete';

    const statusMap = {
      pending: 'in-progress',
      industry_reviewed: 'in-progress',
      uni_reviewed: 'in-progress',
      complete: 'complete'
    };
    return statusMap[status] || 'in-progress';
  }

  getStages(status, industryFeedback = null, uniFeedback = null) {
    const stages = [
      { label: 'Logs', status: 'done' },
      { label: 'Industry', status: 'pending' },
      { label: 'Uni supervisor', status: 'pending' }
    ];

    if (
      status === 'industry_reviewed' ||
      status === 'uni_reviewed' ||
      status === 'complete' ||
      industryFeedback?.status === 'complete'
    ) {
      stages[1].status = 'done';
    }

    if (status === 'uni_reviewed' || status === 'complete' || uniFeedback?.status === 'complete') {
      stages[2].status = 'done';
    }

    return stages;
  }
}

export const weeklyReviewService = new WeeklyReviewService();
export default weeklyReviewService;
