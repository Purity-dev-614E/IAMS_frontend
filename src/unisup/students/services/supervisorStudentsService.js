import { apiClient } from '../../../apis';
import { API_ROUTES } from '../../../apis/apiRoutes';

class SupervisorStudentsService {
  // Get students assigned to current supervisor
  async getMyStudents() {
    try {
      // Try different possible endpoints based on backend implementation
      let data;
      
      try {
        // First try the dedicated endpoint
        data = await apiClient.get(API_ROUTES.students.myStudents);
      } catch (firstError) {
        console.log('my-students endpoint failed, trying alternative:', firstError.message);
        
        // Fallback 1: Try using attachments to get students
        try {
          const attachmentsData = await apiClient.get(`${API_ROUTES.attachments.list}?my_students=true`);
          if (attachmentsData.attachments && attachmentsData.attachments.length > 0) {
            // Extract unique students from attachments
            const uniqueStudents = attachmentsData.attachments.reduce((acc, attachment) => {
              if (!acc.find(s => s.id === attachment.student_id)) {
                acc.push({
                  id: attachment.student_id,
                  student_name: attachment.student_name || 'Unknown Student',
                  reg_number: attachment.reg_number || 'Unknown',
                  program: attachment.program || 'Unknown',
                  year_of_study: attachment.year_of_study || 0,
                  student_email: attachment.student_email || '',
                  organization_name: attachment.organization_name || 'Unknown',
                  attachment_count: 1
                });
              }
              return acc;
            }, []);
            
            return {
              success: true,
              students: uniqueStudents
            };
          }
        } catch (secondError) {
          console.log('Attachments fallback failed:', secondError.message);
          
          // Fallback 2: Return empty array with proper structure
          return {
            success: true,
            students: []
          };
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching my students:', error);
      throw this.transformError(error);
    }
  }

  // Get student details by ID
  async getStudentById(id) {
    try {
      const data = await apiClient.get(API_ROUTES.students.byId(id));
      return data;
    } catch (error) {
      console.error('Error fetching student details:', error);
      throw this.transformError(error);
    }
  }

  // Update student information
  async updateStudent(id, studentData) {
    try {
      const data = await apiClient.put(API_ROUTES.students.update(id), studentData);
      return data;
    } catch (error) {
      console.error('Error updating student:', error);
      throw this.transformError(error);
    }
  }

  // Flag/unflag student (custom endpoint if needed)
  async toggleStudentFlag(id, flagged) {
    try {
      const data = await apiClient.put(API_ROUTES.students.update(id), {
        flagged
      });
      return data;
    } catch (error) {
      console.error('Error toggling student flag:', error);
      throw this.transformError(error);
    }
  }

  // Export student progress
  async exportStudentProgress(format = 'csv') {
    try {
      // This would be a custom endpoint, for now we'll use the list endpoint
      const data = await apiClient.get(`${API_ROUTES.students.myStudents}?export=${format}`);
      return data;
    } catch (error) {
      console.error('Error exporting student progress:', error);
      throw this.transformError(error);
    }
  }

  // Format student data for display
  formatStudentForDisplay(student) {
    return {
      id: student.id,
      name: student.student_name,
      registration: student.reg_number,
      program: student.program,
      yearOfStudy: student.year_of_study,
      email: student.student_email,
      organization: student.organization_name || 'Not assigned',
      attachmentCount: student.attachment_count || 0,
      // These would come from additional API calls or be calculated
      currentWeek: this.getCurrentWeekStatus(student),
      previousWeeks: this.getPreviousWeeksStatus(student),
      reviewStatus: this.getReviewStatus(student),
      flagged: student.flagged || false,
      filters: this.getStudentFilters(student)
    };
  }

  // Calculate current week status (mock implementation)
  getCurrentWeekStatus(student) {
    // This would typically come from weekly reviews API
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    return days.map(() => {
      const statuses = ['submitted', 'missing', 'upcoming'];
      return statuses[Math.floor(Math.random() * statuses.length)];
    });
  }

  // Calculate previous weeks status (mock implementation)
  getPreviousWeeksStatus(student) {
    // This would typically come from weekly reviews API
    const weeks = 5;
    return Array(weeks).fill(null).map(() => {
      const statuses = ['complete', 'pending', 'missing'];
      return statuses[Math.floor(Math.random() * statuses.length)];
    });
  }

  // Determine review status based on student data
  getReviewStatus(student) {
    // This would be calculated based on weekly reviews and feedback
    const statuses = ['Needs my feedback', 'Reviewed', 'Industry pending', 'Flagged'];
    
    if (student.flagged) return 'Flagged';
    
    // Random logic for demo - in real implementation this would be based on actual review data
    const randomStatus = statuses[Math.floor(Math.random() * (statuses.length - 1))];
    return randomStatus;
  }

  // Get filter categories for student
  getStudentFilters(student) {
    const filters = [];
    
    if (student.flagged) {
      filters.push('flagged');
    }
    
    // Add other filter logic based on review status, submission status, etc.
    const reviewStatus = this.getReviewStatus(student);
    if (reviewStatus === 'Needs my feedback') {
      filters.push('needs');
    }
    
    // Check if student is behind (mock implementation)
    if (Math.random() > 0.7) {
      filters.push('behind');
    }
    
    return filters.join(' ');
  }

  // Calculate statistics from students data
  calculateStats(students) {
    const stats = {
      all: students.length,
      needs: 0,
      flagged: 0,
      behind: 0,
      reviewed: 0
    };

    students.forEach(student => {
      const filters = this.getStudentFilters(student);
      const reviewStatus = this.getReviewStatus(student);

      if (reviewStatus === 'Needs my feedback') {
        stats.needs++;
      }
      
      if (student.flagged) {
        stats.flagged++;
      }
      
      if (filters.includes('behind')) {
        stats.behind++;
      }
      
      if (reviewStatus === 'Reviewed') {
        stats.reviewed++;
      }
    });

    return stats;
  }

  // Filter students based on active filter
  filterStudents(students, activeFilter) {
    if (activeFilter === 'all') {
      return students;
    }
    
    return students.filter(student => {
      const filters = this.getStudentFilters(student);
      return filters.includes(activeFilter);
    });
  }

  // Search students by name or registration
  searchStudents(students, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      return students;
    }
    
    const term = searchTerm.toLowerCase();
    return students.filter(student => 
      student.student_name?.toLowerCase().includes(term) ||
      student.reg_number?.toLowerCase().includes(term) ||
      student.program?.toLowerCase().includes(term)
    );
  }

  // Export data to CSV
  exportToCSV(students) {
    const headers = [
      'Student Name',
      'Registration Number',
      'Program',
      'Year of Study',
      'Email',
      'Organization',
      'Attachment Count',
      'Review Status',
      'Flagged'
    ];
    
    const rows = students.map(student => [
      student.student_name || '',
      student.reg_number || '',
      student.program || '',
      student.year_of_study || '',
      student.student_email || '',
      student.organization_name || 'Not assigned',
      student.attachment_count || 0,
      this.getReviewStatus(student),
      student.flagged ? 'Yes' : 'No'
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    return csvContent;
  }

  // Download CSV file
  downloadCSV(csvContent, filename = 'students_progress.csv') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return { success: true, filename };
  }

  // Transform API error to user-friendly message
  transformError(error) {
    // Handle common error scenarios
    if (error.message.includes('401')) {
      return new Error('Authentication required. Please login again.');
    }
    
    if (error.message.includes('403')) {
      return new Error('Access denied. University supervisor privileges required.');
    }
    
    if (error.message.includes('404')) {
      return new Error('No students found assigned to this supervisor.');
    }
    
    // Return original error if no specific handling
    return error;
  }
}

const supervisorStudentsService = new SupervisorStudentsService();
export { supervisorStudentsService };
export default supervisorStudentsService;
