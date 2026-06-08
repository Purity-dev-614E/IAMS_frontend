import { apiClient } from '../../../apis';
import { API_ROUTES } from '../../../apis/apiRoutes';

const getReviewsFromResponse = (response) => {
  if (Array.isArray(response)) return response;
  return response?.reviews || response?.data?.reviews || response?.data || [];
};

export const eligibilityReviewService = {
  async getReviews(status = 'pending') {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    const response = await apiClient.get(`${API_ROUTES.attachmentEligibility.adminReviews}${query}`);
    return getReviewsFromResponse(response);
  },

  async updateReview(id, payload) {
    return apiClient.put(API_ROUTES.attachmentEligibility.adminReviewById(id), payload);
  }
};

export default eligibilityReviewService;
