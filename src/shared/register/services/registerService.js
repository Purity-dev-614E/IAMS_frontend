import { apiClient } from '../../../apis';
import { API_ROUTES } from '../../../apis/apiRoutes';
import { User, Student, transformToModel, transformToAPI, validateModel, transformError } from '../../../models';

export const registerService = {
  // User registration - backend handles role-specific logic
  async registerUser(userData) {
    try {
      // Create User model for base user data
      const user = new User({
        userName: `${userData.fname} ${userData.lname}`,
        userEmail: userData.email,
        userRole: userData.role === 'supervisor' ? 'uni_supervisor' : userData.role
      });
      
      // Validate the user model
      const userValidation = validateModel(user);
      if (!userValidation.isValid) {
        throw new Error(userValidation.errors.join(', '));
      }
      
      // Transform user data to API format
      const userApiData = transformToAPI(user);
      
      const payload = {
        ...userApiData,
        password: userData.pw
      };

      // Add student-specific fields if role is student
      if (userData.role === 'student') {
        const student = new Student({
          registrationNumber: userData.reg,
          program: userData.program,
          yearOfStudy: userData.yearOfStudy || 1
        });
        
        // Validate the student model
        const studentValidation = validateModel(student);
        if (!studentValidation.isValid) {
          throw new Error(studentValidation.errors.join(', '));
        }
        
        // Transform student data to API format
        const studentApiData = transformToAPI(student);
        payload.reg_number = studentApiData.reg_number;
        payload.program = studentApiData.program;
        payload.year_of_study = studentApiData.year_of_study;
      }

      const response = await apiClient.post(API_ROUTES.auth.register, payload);
      
      return response;
    } catch (error) {
      throw transformError(error);
    }
  }
};
