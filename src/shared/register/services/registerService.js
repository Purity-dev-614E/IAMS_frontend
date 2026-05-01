import { apiClient } from '../../../apis';
import { API_ROUTES } from '../../../apis/apiRoutes';

export const registerService = {
  // User registration - backend handles role-specific logic
  async registerUser(userData) {
    try {
      const payload = {
        name: `${userData.fname} ${userData.lname}`,
        email: userData.email,
        password: userData.pw,
        role: userData.role === 'supervisor' ? 'uni_supervisor' : userData.role
      };

      // Add student-specific fields if role is student
      if (userData.role === 'student') {
        payload.reg_number = userData.reg;
        payload.program = userData.program;
        payload.year_of_study = userData.yearOfStudy || 1;
      }

      const response = await apiClient.post(API_ROUTES.auth.register, payload);
      
      return response;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  }
};
