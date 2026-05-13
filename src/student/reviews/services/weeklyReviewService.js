import { apiClient } from '../../../apis';
import { API_ROUTES } from '../../../apis/apiRoutes';

class WeeklyReviewService {
  async getMyReviews(page = 1, limit = 20) {
    try {
      const endpoint = `${API_ROUTES.weeklyReviews.myReviews}?page=${page}&limit=${limit}`;
      console.log('🌐 Making API call to:', endpoint);
      console.log('🔑 Auth token:', sessionStorage.getItem('iams_token') ? 'Present' : 'Missing');
      
      const response = await apiClient.get(endpoint);
      console.log('📡 Raw API response:', response);
      console.log('📊 Response type:', typeof response);
      console.log('📋 Response keys:', response ? Object.keys(response) : 'No response');
      
      // Check if response has expected structure
      if (response && response.reviews) {
        console.log('✅ Found reviews array:', response.reviews.length, 'items');
      } else if (response && response.data) {
        console.log('� Found nested data structure');
      } else {
        console.log('⚠️ No reviews found in response');
      }
      
      // Handle different possible response structures
      let reviews = [];
      let pagination = null;
      let success = false;
      
      if (response && typeof response === 'object') {
        // Try different possible structures
        if (Array.isArray(response)) {
          // Direct array response
          reviews = response;
          success = true;
        } else if (response.data && Array.isArray(response.data)) {
          // Nested data array
          reviews = response.data;
          success = true;
        } else if (response.reviews && Array.isArray(response.reviews)) {
          // Expected structure
          reviews = response.reviews;
          pagination = response.pagination || null;
          success = response.success !== false;
        } else if (response.data && response.data.reviews && Array.isArray(response.data.reviews)) {
          // Nested structure
          reviews = response.data.reviews;
          pagination = response.data.pagination || null;
          success = response.data.success !== false;
        } else {
          console.warn('⚠️ Unexpected response structure:', response);
          reviews = [];
          success = false;
        }
      }
      
      const processedResponse = {
        reviews: reviews,
        pagination: pagination || {
          page: page,
          limit: limit,
          total: reviews.length,
          pages: Math.ceil(reviews.length / limit)
        },
        success: success
      };
      console.log('✅ Processed response:', processedResponse);
      
      return processedResponse;
    } catch (error) {
      console.error('❌ Error fetching weekly reviews:', error);
      console.log('🔄 Falling back to empty array...');
      
      // Return empty structure instead of throwing to avoid breaking the UI
      return {
        reviews: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0
        },
        success: false
      };
    }
  }

  async getReviewById(reviewId) {
    try {
      const data = await apiClient.get(API_ROUTES.weeklyReviews.byId(reviewId));
      return data;
    } catch (error) {
      console.error('Error fetching weekly review:', error);
      throw error;
    }
  }

  async getReviewsByAttachment(attachmentId, page = 1, limit = 20) {
    try {
      const data = await apiClient.get(`${API_ROUTES.weeklyReviews.byAttachment(attachmentId)}?page=${page}&limit=${limit}`);
      return data;
    } catch (error) {
      console.error('Error fetching reviews by attachment:', error);
      throw error;
    }
  }

  async createWeeklyReview(reviewData) {
    try {
      const data = await apiClient.post(API_ROUTES.weeklyReviews.create, reviewData);
      return data;
    } catch (error) {
      console.error('Error creating weekly review:', error);
      throw error;
    }
  }

  async createAutomatedReview(attachmentId) {
    try {
      const data = await apiClient.post(API_ROUTES.weeklyReviews.createAutomated, { attachmentId });
      return data;
    } catch (error) {
      console.error('Error creating automated weekly review:', error);
      throw error;
    }
  }

  async updateReviewStatus(reviewId, status) {
    try {
      const data = await apiClient.put(API_ROUTES.weeklyReviews.updateStatus(reviewId), { status });
      return data;
    } catch (error) {
      console.error('Error updating review status:', error);
      throw error;
    }
  }

  // Helper method to transform API data to match the component's expected format
  transformReviewData(apiData) {
    return {
      reviewId: apiData.id,
      week: apiData.week_number,
      title: apiData.week_number === this.getCurrentWeek() ? `Week ${apiData.week_number} — current week` : `Week ${apiData.week_number}`,
      dates: this.formatDateRange(apiData.week_start_date, apiData.week_end_date),
      logsSubmitted: apiData.logs_submitted || 0,
      totalLogs: apiData.total_logs || 5,
      status: this.mapStatus(apiData.status),
      stages: this.getStages(apiData.status),
      isCurrent: apiData.week_number === this.getCurrentWeek(),
      dailyLogs: apiData.daily_logs || [],
      industryFeedback: apiData.industry_feedback,
      uniFeedback: apiData.uni_feedback,
      // Additional fields from API
      attachmentId: apiData.attachment_id,
      createdAt: apiData.created_at,
      updatedAt: apiData.updated_at
    };
  }

  getCurrentWeek() {
    // This should ideally come from the backend or be calculated based on attachment start date
    // For now, return a placeholder
    return 6;
  }

  formatDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const options = { day: 'numeric', month: 'short' };
    return `${start.toLocaleDateString('en-US', options)} – ${end.toLocaleDateString('en-US', options)} ${start.getFullYear()}`;
  }

  mapStatus(status) {
    const statusMap = {
      'pending': 'in-progress',
      'industry_reviewed': 'in-progress',
      'uni_reviewed': 'in-progress',
      'complete': 'complete'
    };
    return statusMap[status] || 'in-progress';
  }

  getStages(status) {
    const stages = [
      { label: 'Logs', status: 'done' },
      { label: 'Industry', status: 'pending' },
      { label: 'Uni supervisor', status: 'pending' }
    ];

    if (status === 'industry_reviewed' || status === 'uni_reviewed' || status === 'complete') {
      stages[1].status = 'done';
    }
    
    if (status === 'uni_reviewed' || status === 'complete') {
      stages[2].status = 'done';
    }

    if (status === 'complete') {
      stages[2].status = 'done';
    }

    return stages;
  }
}

export const weeklyReviewService = new WeeklyReviewService();
export default weeklyReviewService;
