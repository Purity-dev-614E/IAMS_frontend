import { API_BASE_URL, API_ROUTES } from '../../../apis/apiRoutes';

const publicRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || `HTTP Error: ${response.status}`);
  }

  return data;
};

const getFirst = (source, keys, fallback = '') => {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return fallback;
};

const unwrap = (response, keys = []) => {
  for (const key of keys) {
    if (response?.[key]) return response[key];
  }
  return response?.data || response || {};
};

const toDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value, options = { day: 'numeric', month: 'short' }) => {
  const date = toDate(value);
  return date ? date.toLocaleDateString('en-GB', options) : '';
};

const formatDateTime = (value) => {
  const date = toDate(value);
  if (!date) return '';

  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

const formatPeriod = (start, end) => {
  const startLabel = formatDate(start);
  const endLabel = formatDate(end, { day: 'numeric', month: 'short', year: 'numeric' });

  if (startLabel && endLabel) return `${startLabel} - ${endLabel}`;
  return startLabel || endLabel || 'Week dates unavailable';
};

const normalizeStatus = (review) => {
  const rawStatus = String(getFirst(review, ['link_status', 'token_status', 'status', 'review_status'], 'active')).toLowerCase();
  const submittedAt = getFirst(review, ['submitted_at', 'industry_feedback_date', 'feedback_submitted_at'], null);

  if (rawStatus.includes('expired')) return 'expired';
  if (rawStatus.includes('used') || rawStatus.includes('submitted') || rawStatus.includes('reviewed') || rawStatus.includes('complete') || submittedAt) return 'used';
  return 'active';
};

const normalizeDecision = (value) => {
  const normalized = String(value || '').toLowerCase();
  if (['r', 'reject', 'rejected'].includes(normalized)) return 'rejected';
  if (['a', 'approve', 'approved'].includes(normalized)) return 'approved';
  return normalized;
};

const normalizeStudent = (review) => {
  const student = getFirst(review, ['student'], {}) || {};
  const attachment = getFirst(review, ['attachment'], {}) || {};

  return {
    name: getFirst(review, ['student_name'], getFirst(student, ['name', 'full_name'], 'Student')),
    registration: getFirst(review, ['reg_number', 'registration_number', 'student_reg_number'], getFirst(student, ['reg_number', 'registration_number'], '')),
    program: getFirst(review, ['program', 'course'], getFirst(student, ['program', 'course'], '')),
    organization: getFirst(review, ['organization_name', 'organization', 'company_name'], getFirst(attachment, ['organization_name', 'organization', 'company_name'], 'Organization unavailable'))
  };
};

const normalizeLogs = (logs = []) => {
  if (!Array.isArray(logs)) return [];

  return logs.map((log, index) => {
    const logDate = getFirst(log, ['log_date', 'date', 'created_at'], null);
    const status = String(getFirst(log, ['status'], log.submitted_at ? 'submitted' : 'not_submitted')).toLowerCase();
    const submitted = ['submitted', 'reviewed', 'complete', 'completed'].some((value) => status.includes(value));

    return {
      id: getFirst(log, ['id', 'log_id'], `log-${index}`),
      day: logDate
        ? toDate(logDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
        : getFirst(log, ['day', 'dateLabel'], `Day ${index + 1}`),
      status: submitted ? 'Submitted' : 'Not submitted',
      tasks: getFirst(log, ['tasks_done', 'tasks', 'activities', 'description', 'work_done'], ''),
      skills: getFirst(log, ['skills_gained', 'skills', 'learning_outcomes', 'lessons_learnt'], ''),
      challenges: getFirst(log, ['challenges', 'blockers'], '')
    };
  });
};

const normalizeReview = (review, logs = []) => {
  const student = normalizeStudent(review);
  const start = getFirst(review, ['week_start_date', 'start_date', 'period_start'], null);
  const end = getFirst(review, ['week_end_date', 'end_date', 'period_end'], null);
  const normalizedLogs = normalizeLogs(logs.length ? logs : getFirst(review, ['logs', 'daily_logs'], []));
  const submittedLogs = normalizedLogs.filter((log) => log.status === 'Submitted').length;
  const totalLogs = Number(getFirst(review, ['total_logs', 'expected_logs'], normalizedLogs.length || 5));

  return {
    id: getFirst(review, ['id', 'weekly_review_id', 'review_id'], ''),
    status: normalizeStatus(review),
    student,
    week: Number(getFirst(review, ['week_number', 'week'], 0)) || '',
    period: formatPeriod(start, end),
    sentAt: formatDateTime(getFirst(review, ['sent_at', 'created_at'], null)),
    expiresAt: formatDateTime(getFirst(review, ['expires_at', 'expiry_date'], null)),
    submittedAt: formatDateTime(getFirst(review, ['submitted_at', 'industry_feedback_date', 'feedback_submitted_at'], null)),
    decision: normalizeDecision(getFirst(review, ['industry_approval', 'approval', 'decision'], '')),
    comments: getFirst(review, ['industry_comments', 'comments', 'feedback'], ''),
    logsSubmitted: Number(getFirst(review, ['submitted_logs'], submittedLogs)),
    totalLogs,
    logs: normalizedLogs
  };
};

export const industryReviewService = {
  async getReview(token) {
    const response = await publicRequest(API_ROUTES.industry.review(token));
    const review = unwrap(response, ['review', 'weeklyReview']);

    let logs = getFirst(review, ['logs', 'daily_logs'], []);
    if (!Array.isArray(logs) || logs.length === 0) {
      try {
        const logsResponse = await publicRequest(API_ROUTES.industry.reviewLogs(token));
        logs = unwrap(logsResponse, ['logs', 'dailyLogs']);
      } catch {
        logs = [];
      }
    }

    return normalizeReview(review, logs);
  },

  async submitFeedback(token, feedback) {
    const decision = feedback.approvalDecision === 'a' ? 'approved' : 'rejected';
    const payload = {
      approval: decision,
      industry_approval: decision,
      comments: feedback.comments.trim(),
      industry_comments: feedback.comments.trim(),
      improvements: feedback.improvements.trim(),
      improvement_suggestions: feedback.improvements.trim()
    };

    const response = await publicRequest(API_ROUTES.industry.submitFeedback(token), {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const review = unwrap(response, ['review', 'feedback', 'data']);

    return {
      ...normalizeReview(review),
      decision,
      comments: payload.comments,
      submittedAt: formatDateTime(new Date())
    };
  }
};
