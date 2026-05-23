export const API_ROUTES = {
  // Authentication Routes
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    profile: "/auth/me",
    updateProfile: "/auth/profile",
    changePassword: "/auth/change-password",
    logout: "/auth/logout",
    refreshToken: "/auth/refresh-token",
  },

  // User Management Routes (Admin only)
  users: {
    list: "/users",
    create: "/users",
    byId: (id) => `/users/${id}`,
    update: (id) => `/users/${id}`,
    delete: (id) => `/users/${id}`,
    byRole: (role) => `/users/role/${role}`,
    pendingSupervisors: "/users/pending-supervisors",
    approve: (id) => `/users/${id}/approve`,
    reject: (id) => `/users/${id}/reject`,
  },

  // Student Routes
  students: {
    list: "/students",
    create: "/students",
    byId: (id) => `/students/${id}`,
    update: (id) => `/students/${id}`,
    delete: (id) => `/students/${id}`,
    assignSupervisor: (id) => `/students/${id}/assign-supervisor`,
    bulkAssign: "/students/bulk-assign-supervisors",
    availableSupervisors: "/students/available-supervisors",
    unassigned: "/students/unassigned",
    myStudents: "/students/my-students",
    profile: "/students/profile/me",
  },

  // Attachment Routes (Internship)
  attachments: {
    list: "/attachments",
    create: "/attachments",
    byId: (id) => `/attachments/${id}`,
    update: (id) => `/attachments/${id}`,
    updateStatus: (id) => `/attachments/${id}/status`,
    delete: (id) => `/attachments/${id}`,
    myAttachments: "/attachments/my-attachments",
  },

  // Daily Log Routes
  dailyLogs: {
    list: "/daily-logs",
    create: "/daily-logs",
    byId: (id) => `/daily-logs/${id}`,
    update: (id) => `/daily-logs/${id}`,
    submit: (id) => `/daily-logs/${id}/submit`,
    delete: (id) => `/daily-logs/${id}`,
    myLogs: "/daily-logs/my-logs",
    byAttachment: (attachmentId) => `/daily-logs/attachment/${attachmentId}`,
    byWeeklyReview: (weeklyReviewId) => `/daily-logs/weekly-review/${weeklyReviewId}`,
  },

  // Weekly Review Routes
  weeklyReviews: {
    list: "/weekly-reviews",
    create: "/weekly-reviews",
    createAutomated: "/weekly-reviews/automated",
    byId: (id) => `/weekly-reviews/${id}`,
    updateStatus: (id) => `/weekly-reviews/${id}/status`,
    byAttachment: (attachmentId) => `/weekly-reviews/attachment/${attachmentId}`,
    myReviews: "/weekly-reviews/my-reviews",
  },

  // Dashboard Routes
  dashboard: {
    base: "/dashboard",
    student: "/dashboard/student",
    supervisor: "/dashboard/supervisor",
    admin: "/dashboard/admin",
  },

  // Reports Routes
  reports: {
    generateStudent: "/reports/generate/student",
    generateCohort: "/reports/generate/cohort",
    generateWeeklyReviewStatus: "/reports/generate/weekly-review-status",
    byId: (id) => `/reports/${id}`,
  },

  // End of Attachment Reports Routes
  endOfAttachmentReports: {
    // Student endpoints
    submitText: "/end-of-attachment-reports/text",
    submitPdf: "/end-of-attachment-reports/pdf",
    myReports: "/end-of-attachment-reports/my-reports",
    download: (id) => `/end-of-attachment-reports/${id}/download`,
    
    // Staff endpoints (Admin/University Supervisor)
    list: "/end-of-attachment-reports",
    byId: (id) => `/end-of-attachment-reports/${id}`,
    review: (id) => `/end-of-attachment-reports/${id}/review`,
    staffDownload: (id) => `/end-of-attachment-reports/${id}/download`,
  },

  // Industry Supervisor Routes (Token-based)
  industry: {
    review: (token) => `/industry/review/${token}`,
    reviewLogs: (token) => `/industry/review/${token}/logs`,
    submitFeedback: (token) => `/industry/review/${token}/feedback`,
  },

  // Admin Routes
  admin: {
    dashboard: "/admin/dashboard",
    sendWeeklyReviews: "/admin/send-weekly-reviews",
    reportsSummary: "/admin/reports/summary",
    reportsGenerate: "/admin/reports/generate",
  },

  // General Routes
  profile: "/profile",
  health: "/health",
  testDb: "/test-db",
};

// Helper function to get full API URL
export const getApiUrl = (route, params = {}) => {
  let url = route;
  
  // Replace parameter placeholders like :id, :token etc.
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  
  return url;
};

// Base URL configuration.
// VITE_API_URL is used by apiClient as the full API root, so local .env files may
// include /api. Public URL builders append /api themselves, so keep this value as
// the backend origin/base without a trailing API segment.
const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || 'https://iams-backend.onrender.com/api';
export const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '').replace(/\/api$/, '');

// Full API URL builder
export const buildApiUrl = (route, params = {}) => {
  const routePath = typeof route === 'function' ? route(params.id || params.token || params) : route;
  return `${API_BASE_URL}/api${routePath}`;
};

// Example usage:
// import { API_ROUTES, buildApiUrl } from './config/apiRoutes';
// 
// const loginUrl = buildApiUrl(API_ROUTES.auth.login);
// const userByIdUrl = buildApiUrl(API_ROUTES.users.byId, { id: '123' });
// const reviewUrl = buildApiUrl(API_ROUTES.industry.review, { token: 'abc123' });

export default API_ROUTES;
