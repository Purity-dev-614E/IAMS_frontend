import { apiClient } from '../../../apis';
import { API_ROUTES } from '../../../apis/apiRoutes';

const unwrapEligibility = (response) => {
  const eligibility = response?.eligibility || response?.data?.eligibility || response?.data || response;
  return {
    ...response,
    eligibility,
    pendingReview: eligibility?.pendingReview || response?.pendingReview || response?.data?.pendingReview,
    message: eligibility?.message || response?.message || response?.data?.message
  };
};

export const eligibilityService = {
  async getMyEligibility() {
    const response = await apiClient.get(API_ROUTES.attachmentEligibility.me);
    return unwrapEligibility(response);
  },

  async getColleges() {
    const response = await apiClient.get(API_ROUTES.attachmentEligibility.colleges);
    return response?.colleges || response?.data?.colleges || [];
  },

  async requestReview(payload) {
    return apiClient.post(API_ROUTES.attachmentEligibility.reviews, payload);
  }
};

export default eligibilityService;
