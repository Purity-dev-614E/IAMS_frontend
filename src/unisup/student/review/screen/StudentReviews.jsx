import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import styles from './StudentReviews.module.css';
import AppSidebar from '../../../../shared/components/AppSidebar/AppSidebar';
import StudentCard from '../widgets/StudentCard';
import ReviewCard from '../widgets/ReviewCard';
import Toast from '../widgets/Toast';
import { profileService } from '../../../../shared/profile/profileService';
import { studentDataService } from '../../../../student/reports/services/studentDataService';

const StudentReviews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  // Student data state
  const [student, setStudent] = useState(null);
  const [weeklyReviews, setWeeklyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load student data and weekly reviews
  const loadStudentData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading student data for ID:', id);
      
      // Get student data
      const studentResponse = await studentDataService.getStudentById(id);
      const rawStudent = studentResponse.student;
      
      // Get student's attachments to find active attachment
      const attachmentsResponse = await studentDataService.getStudentAttachments(id);
      const activeAttachment = attachmentsResponse.attachments?.find(att => att.status === 'active') || attachmentsResponse.attachments?.[0];
      
      // Get daily logs count for the active attachment
      let logsCount = 0;
      if (activeAttachment) {
        try {
          const logsResponse = await studentDataService.getDailyLogs({ attachmentId: activeAttachment.id });
          logsCount = logsResponse.logs?.length || 0;
        } catch (logErr) {
          console.error('Error fetching logs for count:', logErr);
        }
      }

      // Format student for the StudentCard widget
      const formattedStudent = {
        ...studentDataService.formatStudentForDisplay(rawStudent),
        name: rawStudent.student_name,
        registration: rawStudent.reg_number,
        initials: rawStudent.student_name ? rawStudent.student_name.split(' ').map(n => n[0]).join('').toUpperCase() : '??',
        organization: activeAttachment ? activeAttachment.organization_name : 'Not assigned',
        industrySupervisor: activeAttachment ? activeAttachment.industry_supervisor_name : 'Not assigned',
        period: activeAttachment ? `${new Date(activeAttachment.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${new Date(activeAttachment.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : 'N/A',
        status: activeAttachment ? (activeAttachment.status.charAt(0).toUpperCase() + activeAttachment.status.slice(1)) : 'Pending',
        totalLogs: logsCount,
        progress: activeAttachment ? calculateProgress(activeAttachment.start_date, activeAttachment.end_date) : 0
      };
      
      setStudent(formattedStudent);
      
      // Get weekly reviews for this student (supervisor view)
      let reviewsResponse;
      
      try {
        if (activeAttachment) {
          reviewsResponse = await studentDataService.getWeeklyReviews({ 
            attachmentId: activeAttachment.id 
          });
        } else {
          reviewsResponse = { reviews: [], pagination: null, success: false };
        }
      } catch (error) {
        console.error('Error getting weekly reviews:', error);
        reviewsResponse = { reviews: [], pagination: null, success: false };
      }
      
      console.log('📊 Reviews response:', reviewsResponse);
      
      // Transform reviews data
      const transformedReviews = reviewsResponse.reviews ? reviewsResponse.reviews.map(review => 
        studentDataService.formatWeeklyReviewForDisplay(review)
      ) : [];
      
      setWeeklyReviews(transformedReviews);
      console.log('✅ Loaded reviews:', transformedReviews.length);
      
    } catch (error) {
      console.error('❌ Error loading student data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    
    if (today < start) return 0;
    if (today > end) return 100;
    
    const total = end - start;
    const elapsed = today - start;
    return Math.round((elapsed / total) * 100);
  };

  useEffect(() => {
    if (id && user) {
      loadStudentData();
    }
  }, [id, user]);

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleBackToStudents = () => {
    navigate('/supervisor/students');
  };

  const handleFlagStudent = () => {
    showNotification('Student flagged for admin attention');
  };

  const handleFeedbackSubmit = (weekId, feedback) => {
    setWeeklyReviews(prev => prev.map(review => 
      review.weekId === weekId ? {
        ...review,
        myFeedback: {
          ...feedback,
          submittedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        },
        status: 'Complete',
        needsFeedback: false,
        stages: {
          ...review.stages,
          feedback: 'done'
        }
      } : review
    ));
    showNotification(`Feedback submitted for ${weekId === '6' ? 'Week 6' : weekId} — student notified`);
  };

  const handleFeedbackEdit = (weekId) => {
    showNotification(`Editing feedback for ${weekId === '6' ? 'Week 6' : weekId}`);
  };

  return (
    <div className={styles.shell}>
      <AppSidebar 
        navigationItems={profileService.getNavigationItems(user)} 
        user={profileService.getUserDisplayInfo(user)} 
      />

      <div className={styles.main}>
        {error && (
          <div className={styles.errorMessage}>
            Error: {error}
            <button 
              onClick={loadStudentData}
              className={styles.retryButton}
            >
              Retry
            </button>
          </div>
        )}
        
        {loading && !student && (
          <div className={styles.loadingState}>Loading student data...</div>
        )}
        
        {!loading && student && (
          <React.Fragment>
            <div className={styles.topbar}>
              <div className={styles.topbarLeft}>
                <button className={styles.backBtn} onClick={handleBackToStudents}>‹</button>
                <div>
                  <div className={styles.topbarTitle}>{student.studentName} — Reviews</div>
                  <div className={styles.topbarSubtitle}>{student.regNumber} · {student.program}</div>
                </div>
              </div>
              <div className={styles.topbarRight}>
                <button className={`${styles.btn} ${styles.btnRed}`} onClick={handleFlagStudent}>
                  ⚑ Flag student
                </button>
                <button className={`${styles.btn} ${styles.btnGhost}`} onClick={handleBackToStudents}>
                  ‹ Back to students
                </button>
              </div>
            </div>

            <div className={styles.content}>
              <div className={styles.layout}>
                {/* LEFT: STUDENT CARD */}
                <div className={styles.studentCardColumn}>
                  <StudentCard student={student} />
                </div>

                {/* RIGHT: REVIEWS */}
                <div className={styles.reviewsColumn}>
                  {weeklyReviews.length === 0 ? (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyStateIcon}>📋</div>
                      <div className={styles.emptyStateTitle}>No weekly reviews yet</div>
                      <div className={styles.emptyStateText}>
                        Weekly reviews will appear here once the student has submitted daily logs and supervisors have provided feedback.
                      </div>
                      <div className={styles.emptyStateSubtext}>
                        Keep submitting your daily logs to generate weekly reviews.
                      </div>
                    </div>
                  ) : (
                    weeklyReviews.map(review => (
                      <ReviewCard
                        key={review.id || review.weekId || `review-${Math.random()}`}
                        week={review.weekId}
                        data={review}
                        onFeedbackSubmit={handleFeedbackSubmit}
                        onFeedbackEdit={handleFeedbackEdit}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
            </React.Fragment>
        )}
      </div>

      <Toast message={toastMessage} show={showToast} />
    </div>
  );
};

export default StudentReviews;
