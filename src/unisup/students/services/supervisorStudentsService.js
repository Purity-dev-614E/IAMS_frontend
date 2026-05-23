import { apiClient } from '../../../apis';
import { API_ROUTES } from '../../../apis/apiRoutes';
import { studentDataService } from '../../../student/reports/services/studentDataService';

class SupervisorStudentsService {
  getField(student, keys, fallback = '') {
    const keyList = Array.isArray(keys) ? keys : [keys];
    for (const key of keyList) {
      if (student?.[key] !== undefined && student?.[key] !== null && student?.[key] !== '') {
        return student[key];
      }
    }
    return fallback;
  }

  normalizeStatus(status) {
    const normalized = String(status || '').toLowerCase().replace(/[_-]/g, ' ');

    if (normalized.includes('flag')) return 'Flagged';
    if (normalized.includes('need') || normalized.includes('pending uni') || normalized.includes('awaiting supervisor')) {
      return 'Needs my feedback';
    }
    if (normalized.includes('industry')) return 'Industry pending';
    if (normalized.includes('complete') || normalized.includes('reviewed') || normalized.includes('done')) return 'Reviewed';

    return '';
  }

  buildWeekStatuses(student, mode) {
    const raw =
      mode === 'current'
        ? this.getField(student, ['currentWeek', 'current_week', 'current_week_statuses', 'week_statuses'], null)
        : this.getField(student, ['previousWeeks', 'previous_weeks', 'previous_week_statuses'], null);

    if (Array.isArray(raw) && raw.length > 0) {
      return raw;
    }

    const submitted = Number(this.getField(student, ['submitted_logs_count', 'submittedLogsCount', 'logs_submitted'], 0));
    const missing = Number(this.getField(student, ['missing_logs_count', 'missingLogsCount', 'logs_missing'], 0));
    const total = mode === 'current' ? 5 : 5;

    if (submitted || missing) {
      return Array.from({ length: total }, (_, index) => {
        if (index < submitted) return mode === 'current' ? 'submitted' : 'complete';
        if (index < submitted + missing) return 'missing';
        return mode === 'current' ? 'upcoming' : 'pending';
      });
    }

    return Array.from({ length: total }, () => (mode === 'current' ? 'upcoming' : 'pending'));
  }

  async enrichStudentWithAttachment(student) {
    const studentId = this.getField(student, ['id', 'student_id', 'studentId'], null);
    if (!studentId) {
      return student;
    }

    try {
      const attachmentsResponse = await studentDataService.getStudentAttachments(studentId, { limit: 20 });
      const attachments = attachmentsResponse.attachments || [];
      const activeAttachment = attachments.find(attachment => attachment.status === 'active') || attachments[0];

      if (!activeAttachment) {
        return student;
      }

      let weeklyReviews = [];
      try {
        const reviewsResponse = await studentDataService.getWeeklyReviews({
          attachmentId: activeAttachment.id,
          limit: 100
        });
        weeklyReviews = reviewsResponse.reviews || [];
      } catch (reviewError) {
        console.error(`Error fetching reviews for student ${studentId}:`, reviewError);
      }

      const latestWeeklyReview = [...weeklyReviews].sort((a, b) => {
        const weekA = Number(a.week_number) || 0;
        const weekB = Number(b.week_number) || 0;
        return weekB - weekA;
      })[0] || null;

      return {
        ...student,
        organization_name: activeAttachment.organization_name,
        industry_supervisor_name: activeAttachment.industry_supervisor_name,
        industry_supervisor_email: activeAttachment.industry_supervisor_email,
        active_attachment: activeAttachment,
        attachment_status: activeAttachment.status,
        weekly_reviews: weeklyReviews,
        latest_weekly_review: latestWeeklyReview
      };
    } catch (error) {
      console.error(`Error enriching student ${studentId} with attachment:`, error);
      return student;
    }
  }

  async enrichStudentsWithAttachments(students = []) {
    return Promise.all(students.map(student => this.enrichStudentWithAttachment(student)));
  }

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
            
            const enrichedStudents = await this.enrichStudentsWithAttachments(uniqueStudents);

            return {
              success: true,
              students: enrichedStudents
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
      
      if (data?.students && Array.isArray(data.students)) {
        return {
          ...data,
          students: await this.enrichStudentsWithAttachments(data.students)
        };
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
    const reviewStatus = this.getReviewStatus(student);
    const flagged = Boolean(this.getField(student, ['flagged', 'is_flagged'], false)) || reviewStatus === 'Flagged';
    const name = this.getField(student, ['name', 'student_name', 'studentName'], 'Unknown student');
    const registration = this.getField(student, ['registration', 'reg_number', 'regNumber'], 'No registration');

    return {
      id: this.getField(student, ['id', 'student_id', 'studentId']),
      name,
      registration,
      regNumber: registration,
      program: this.getField(student, ['program'], 'Not provided'),
      yearOfStudy: this.getField(student, ['yearOfStudy', 'year_of_study'], ''),
      email: this.getField(student, ['email', 'student_email', 'studentEmail'], ''),
      organization: this.getField(student, ['organization', 'organization_name', 'organizationName'], 'Not assigned'),
      attachmentCount: Number(this.getField(student, ['attachmentCount', 'attachment_count'], 0)),
      activeAttachment: student.active_attachment || null,
      latestWeeklyReview: student.latest_weekly_review || null,
      weeklyReviews: student.weekly_reviews || [],
      attachmentStatus: this.getField(student, ['attachmentStatus', 'attachment_status'], ''),
      currentWeek: this.getCurrentWeekStatus(student),
      previousWeeks: this.getPreviousWeeksStatus(student),
      reviewStatus,
      flagged,
      filters: this.getStudentFilters({ ...student, reviewStatus, flagged })
    };
  }

  // Calculate current week status from API fields, falling back to neutral values
  getCurrentWeekStatus(student) {
    return this.buildWeekStatuses(student, 'current');
  }

  // Calculate previous weeks status from API fields, falling back to neutral values
  getPreviousWeeksStatus(student) {
    return this.buildWeekStatuses(student, 'previous');
  }

  // Determine review status based on student data
  getReviewStatus(student) {
    if (student.flagged || student.is_flagged) return 'Flagged';

    const latestReview = student.latest_weekly_review || student.latestWeeklyReview;
    if (latestReview) {
      const industryFeedback = latestReview.industry_feedback || latestReview.industryFeedback || {};
      const universityFeedback = latestReview.uni_feedback || latestReview.uniFeedback || latestReview.university_feedback || latestReview.universityFeedback || {};
      const hasUniFeedback = Boolean(
        latestReview.uni_feedback_date ||
        latestReview.uniFeedbackDate ||
        latestReview.uni_comments ||
        latestReview.uniComments ||
        latestReview.uni_improvements ||
        latestReview.uniImprovements ||
        latestReview.uni_rating ||
        latestReview.uniRating ||
        universityFeedback.submitted_at ||
        universityFeedback.submittedAt ||
        universityFeedback.comments ||
        universityFeedback.feedback ||
        universityFeedback.rating ||
        latestReview.status === 'complete'
      );

      if (hasUniFeedback) return 'Reviewed';

      const hasIndustryFeedback = Boolean(
        latestReview.industry_feedback_date ||
        latestReview.industryFeedbackDate ||
        latestReview.feedback_submitted_at ||
        latestReview.submitted_at ||
        latestReview.industry_comments ||
        latestReview.industryComments ||
        latestReview.comments ||
        latestReview.feedback ||
        latestReview.industry_improvements ||
        latestReview.industryImprovements ||
        latestReview.industry_recommendations ||
        latestReview.improvement_suggestions ||
        latestReview.industry_approval ||
        latestReview.industryApproval ||
        latestReview.approval ||
        latestReview.decision ||
        industryFeedback.submitted_at ||
        industryFeedback.submittedAt ||
        industryFeedback.comments ||
        industryFeedback.feedback ||
        industryFeedback.improvements ||
        industryFeedback.approval ||
        industryFeedback.decision
      );

      if (hasIndustryFeedback) return 'Needs my feedback';

      return 'Industry pending';
    }

    const status = this.normalizeStatus(this.getField(student, [
      'reviewStatus',
      'review_status',
      'status',
      'weekly_review_status',
      'latest_review_status'
    ]));

    if (status) return status;

    const pendingFeedback = Number(this.getField(student, ['pending_feedback_count', 'pendingReviews', 'pending_reviews'], 0));
    const missingLogs = Number(this.getField(student, ['missing_logs_count', 'missingLogsCount', 'logs_missing'], 0));
    const completedReviews = Number(this.getField(student, ['complete_reviews', 'completedReviews', 'reviewed_count'], 0));

    if (pendingFeedback > 0) return 'Needs my feedback';
    if (missingLogs > 0) return 'Industry pending';
    if (completedReviews > 0) return 'Reviewed';

    if (student.active_attachment || student.activeAttachment) return 'Industry pending';

    return 'No active attachment';
  }

  // Get filter categories for student
  getStudentFilters(student) {
    const filters = [];
    const reviewStatus = this.getReviewStatus(student);
    
    if (student.flagged) {
      filters.push('flagged');
    }
    
    if (reviewStatus === 'Needs my feedback') {
      filters.push('needs');
    }
    
    if (
      Number(this.getField(student, ['missing_logs_count', 'missingLogsCount', 'logs_missing'], 0)) > 0 ||
      this.getCurrentWeekStatus(student).includes('missing')
    ) {
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
      const filters = student.filters || this.getStudentFilters(student);
      const reviewStatus = student.reviewStatus || this.getReviewStatus(student);

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
      const filters = student.filters || this.getStudentFilters(student);
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
      student.name?.toLowerCase().includes(term) ||
      student.student_name?.toLowerCase().includes(term) ||
      student.registration?.toLowerCase().includes(term) ||
      student.reg_number?.toLowerCase().includes(term) ||
      student.program?.toLowerCase().includes(term) ||
      student.organization?.toLowerCase().includes(term) ||
      student.organization_name?.toLowerCase().includes(term)
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
      student.name || student.student_name || '',
      student.registration || student.reg_number || '',
      student.program || '',
      student.yearOfStudy || student.year_of_study || '',
      student.email || student.student_email || '',
      student.organization || student.organization_name || 'Not assigned',
      student.attachmentCount || student.attachment_count || 0,
      student.reviewStatus || this.getReviewStatus(student),
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
