import { apiClient } from '../apis';
import { API_ROUTES } from '../apis/apiRoutes';

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
            // Transform student response to match user structure
            return {
              ...response.student,
              id: response.student.id,
              name: response.student.student_name,
              email: response.student.student_email,
              role: 'student',
              regNumber: response.student.reg_number,
              program: response.student.program,
              yearOfStudy: response.student.year_of_study,
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
            return response.user;
          }
          break;
      }
      
      throw new Error('Invalid profile response structure');
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
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
          // Transform update data for student structure
          const studentUpdateData = {
            student_name: updateData.name,
            student_email: updateData.email,
            phone: updateData.phone
          };
          response = await apiClient.put(endpoint, studentUpdateData);
          break;
          
        case 'admin':
        case 'uni_supervisor':
        default:
          // Admin and uni_supervisor use generic auth/profile endpoint
          endpoint = API_ROUTES.auth.updateProfile;
          response = await apiClient.put(endpoint, updateData);
          break;
      }
      
      if (response) {
        // Return updated profile data
        return await this.fetchProfile();
      }
      
      throw new Error('Profile update failed');
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },

  // Change password (same for all user types)
  async changePassword(passwordData) {
    try {
      const response = await apiClient.put(API_ROUTES.auth.changePassword, passwordData);
      return response?.success || false;
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  },

  // Get user display information for sidebar
  getUserDisplayInfo(user) {
    if (!user) return { initials: 'U', name: 'User', role: 'User' };
    
    const initials = user.name 
      ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : 'U';
    
    let roleDisplay = user.role;
    if (user.role === 'uni_supervisor') roleDisplay = 'University Supervisor';
    if (user.role === 'student' && user.program) {
      roleDisplay = `Student · ${user.program}`;
    }
    
    return {
      initials,
      name: user.name || 'User',
      role: roleDisplay
    };
  },

  // Get navigation items based on user role
  getNavigationItems(user) {
    if (!user) return [];

    switch (user.role) {
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
              { to: '/logs/new', label: 'Daily Logs', icon: '📝' },
              { to: '/reviews', label: 'Weekly Reviews', icon: '📊' },
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
