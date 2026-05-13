import { apiClient } from '../../apis';
import { API_ROUTES } from '../../apis/apiRoutes';
import { User, Student, transformToModel, transformToAPI, validateModel, transformError } from '../../models';

export const profileService = {
  // Fetch user profile data based on role
  async fetchProfile() {
    try {
      const userRole = localStorage.getItem('userRole');
      
      let response;
      
      switch (userRole) {
        case 'student':
          // Students have a different endpoint and response structure
          response = await apiClient.get(API_ROUTES.students.profile);
          if (response?.student) {
            // Transform student response using Student model
            const student = transformToModel(response.student, Student);
            const user = new User({
              userId: student.userId,
              userName: response.student.student_name,
              userEmail: response.student.student_email,
              userRole: 'student'
            });
            
            return {
              ...student,
              ...user,
              id: student.studentId,
              name: user.userName,
              email: user.userEmail,
              role: user.userRole,
              regNumber: student.registrationNumber,
              program: student.program,
              yearOfStudy: student.yearOfStudy,
              supervisorName: response.student.supervisor_name,
              supervisorEmail: response.student.supervisor_email,
              attachmentCount: response.student.attachment_count
            };
          }
          break;
          
        case 'admin':
        case 'uni_supervisor':
        default:
          // Admin and uni_supervisor use the generic auth/me endpoint
          response = await apiClient.get(API_ROUTES.auth.profile);
          if (response?.user) {
            return transformToModel(response.user, User);
          }
          break;
      }
      
      throw new Error('Invalid profile response structure');
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw transformError(error);
    }
  },

  // Update user profile data
  async updateProfile(updateData) {
    try {
      const userRole = localStorage.getItem('userRole');
      
      let response;
      let endpoint;
      
      switch (userRole) {
        case 'student':
          // Students might have a different update endpoint
          endpoint = API_ROUTES.students.profile;
          // Transform update data for student structure using models
          const user = new User({
            userName: updateData.name,
            userEmail: updateData.email
          });
          
          const studentUpdateData = {
            student_name: user.userName,
            student_email: user.userEmail,
            phone: updateData.phone
          };
          
          response = await apiClient.put(endpoint, studentUpdateData);
          break;
          
        case 'admin':
        case 'uni_supervisor':
        default:
          // Admin and uni_supervisor use generic auth/profile endpoint
          endpoint = API_ROUTES.auth.updateProfile;
          const userUpdateData = new User(updateData);
          
          // Validate the model
          const validation = validateModel(userUpdateData);
          if (!validation.isValid) {
            throw new Error(validation.errors.join(', '));
          }
          
          const apiData = transformToAPI(userUpdateData);
          response = await apiClient.put(endpoint, apiData);
          break;
      }
      
      if (response) {
        // Return updated profile data
        return await this.fetchProfile();
      }
      
      throw new Error('Profile update failed');
    } catch (error) {
      console.error('Profile update error:', error);
      throw transformError(error);
    }
  },

  // Change password (same for all user types)
  async changePassword(passwordData) {
    try {
      const response = await apiClient.put(API_ROUTES.auth.changePassword, passwordData);
      return response?.success || false;
    } catch (error) {
      console.error('Password change error:', error);
      throw transformError(error);
    }
  },

  // Get user display information for sidebar using User model
  getUserDisplayInfo(user) {
    if (!user) return { initials: 'U', name: 'User', role: 'User' };
    
    const userModel = new User(user);
    const initials = userModel.getDisplayName()
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    let roleDisplay = userModel.userRole;
    if (userModel.isUniSupervisor()) roleDisplay = 'University Supervisor';
    if (userModel.isStudent() && user.program) {
      roleDisplay = `Student · ${user.program}`;
    }
    
    return {
      initials,
      name: userModel.getDisplayName(),
      role: roleDisplay
    };
  },

  // Get navigation items based on user role
  getNavigationItems(user) {
    // Check for both role and userRole properties
    const userRole = user?.role || user?.userRole;
    
    if (!user) {
      return [];
    }

    switch (userRole) {
      case 'admin':
        return [
          {
            title: 'System',
            items: [
              { to: '/admin', label: 'Dashboard', icon: '▦' },
              { to: '/admin/users', label: 'Users', icon: '◉' },
              { to: '/admin/students', label: 'Students', icon: '⊞' },
              { to: '/admin/attachments', label: 'Attachments', icon: '◎' },
            ]
          },
          {
            title: 'Actions',
            items: [
              { to: '/admin/supervisors/pending', label: 'Supervisor Approval', icon: '✓' },
              { to: '/admin/reports', label: 'Reports', icon: '↓' },
            ]
          }
        ];
        
      case 'uni_supervisor':
        return [
          {
            title: 'Main',
            items: [
              { to: '/supervisor', label: 'Dashboard', icon: '▦' },
              { to: '/supervisor/students', label: 'My Students', icon: '⊞' },
              { to: '/supervisor/students/:id/reviews', label: 'Weekly Reviews', icon: '⊞' },
            ]
          },
          {
            title: 'Account',
            items: [
              { to: '/profile', label: 'Profile', icon: '◉' },
            ]
          }
        ];
        
      case 'student':
        return [
          {
            title: 'Main',
            items: [
              { to: '/dashboard', label: 'Dashboard', icon: '▦' },
              { to: '/attachments', label: 'My Attachments', icon: '⊞' },
              { to: '/logs', label: 'My Logs', icon: '📋' },
              { to: '/logs/new', label: 'Daily Logs', icon: '📝' },
              { to: '/reviews', label: 'Weekly Reviews', icon: '📊' },
              { to: '/reports', label: 'Final Report', icon: '📄' },
            ]
          },
          {
            title: 'Account',
            items: [
              { to: '/profile', label: 'Profile', icon: '◉' },
            ]
          }
        ];
        
      default:
        return [];
    }
  }
};
