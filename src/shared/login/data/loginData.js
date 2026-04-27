// Login data logic and API calls
import { apiClient } from '../../../apis';
import { API_ROUTES } from '../../../apis/apiRoutes';

export const loginApi = async (credentials) => {
  try {
    // Use the universal API client
    const response = await apiClient.post(API_ROUTES.auth.login, credentials);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const validateLoginForm = (formData) => {
  const errors = {};
  
  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Email is invalid';
  }
  
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return errors;
};
