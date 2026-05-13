import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { profileService } from '../../../shared/profile/profileService';
import studentDataService from '../services/studentDataService';
import styles from './FinalReport.module.css';
import SubmissionChecklist from '../widgets/SubmissionChecklist';
import ReportForm from '../widgets/ReportForm';
import SubmittedView from '../widgets/SubmittedView';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';
import Toast from '../../../shared/widgets/Toast';

const FinalReport = () => {
  const { user } = useAuth();
  const [navigationItems, setNavigationItems] = useState([]);
  const [userDisplayInfo, setUserDisplayInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });
  
  // Student data
  const [studentData, setStudentData] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [weeklyReviews, setWeeklyReviews] = useState([]);
  const [myReports, setMyReports] = useState([]);

  // Load student data
  const loadStudentData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get student profile
      const profileResponse = await studentDataService.getMyProfile();
      const student = studentDataService.formatStudentForDisplay(profileResponse.student);
      setStudentData(student);
      
      // Get attachments
      const attachmentsResponse = await studentDataService.getStudentAttachments(student.id);
      const formattedAttachments = attachmentsResponse.attachments.map(att => 
        studentDataService.formatAttachmentForDisplay(att)
      );
      setAttachments(formattedAttachments);
      
      // Get daily logs
      const logsResponse = await studentDataService.getDailyLogs({ isOwnLogs: true });
      const formattedLogs = logsResponse.logs.map(log => 
        studentDataService.formatDailyLogForDisplay(log)
      );
      setDailyLogs(formattedLogs);
      
      // Get weekly reviews
      const reviewsResponse = await studentDataService.getWeeklyReviews({ isOwnReviews: true });
      const formattedReviews = reviewsResponse.reviews.map(review => 
        studentDataService.formatWeeklyReviewForDisplay(review)
      );
      setWeeklyReviews(formattedReviews);
      
      // Get my end of attachment reports
      const reportsResponse = await studentDataService.getMyEndOfAttachmentReports();
      setMyReports(reportsResponse.reports || []);
      
    } catch (error) {
      console.error('Error loading student data:', error);
      setError(error.message);
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setNavigationItems(profileService.getNavigationItems(user));
      setUserDisplayInfo(profileService.getUserDisplayInfo(user));
      loadStudentData();
    }
  }, [user]);

  const showToast = (message, type = 'success') => {
    setToast({
      message,
      type,
      isVisible: true
    });
  };

  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  // Calculate mode based on actual data
  const calculatedMode = studentData && attachments.length > 0 
    ? studentDataService.getReportSubmissionMode(attachments, dailyLogs, weeklyReviews)
    : 'locked';
  
  const [mode, setMode] = useState(calculatedMode || 'locked');
  
  // Calculate checklist items based on real data
  const checklistItems = studentData && attachments.length > 0
    ? studentDataService.calculateSubmissionChecklist(studentData, attachments, dailyLogs, weeklyReviews)
    : [
        { id: 1, label: 'Loading...', meta: 'Fetching data', status: 'pending' },
        { id: 2, label: 'Loading...', meta: 'Fetching data', status: 'pending' },
        { id: 3, label: 'Loading...', meta: 'Fetching data', status: 'pending' },
        { id: 4, label: 'Loading...', meta: 'Fetching data', status: 'pending' }
      ];

  const [formData, setFormData] = useState({
    reportTitle: '',
    department: '',
    executiveSummary: '',
    keyActivities: '',
    skillsAcquired: '',
    challenges: '',
    recommendations: '',
    uploadedFile: null
  });

  const [submittedData, setSubmittedData] = useState(null);
  
  // Load submitted report data if exists
  useEffect(() => {
    if (myReports.length > 0) {
      const latestReport = myReports[0];
      setSubmittedData({
        reportTitle: latestReport.submission_type === 'pdf' 
          ? `Industrial Attachment Report — PDF`
          : `Industrial Attachment Report — Text`,
        organization: attachments.find(att => att.id === latestReport.attachment_id)?.organizationName || 'Unknown',
        department: studentData?.program || 'Unknown',
        startDate: studentDataService.formatDate(attachments[0]?.startDate),
        endDate: studentDataService.formatDate(attachments[0]?.endDate),
        submittedDate: studentDataService.formatDateTime(latestReport.submitted_at),
        fileName: latestReport.submission_type === 'pdf' 
          ? `${studentData?.studentName || 'Student'}_Attachment_Report_${new Date().toISOString().split('T')[0]}.pdf`
          : 'Text Report',
        fileSize: latestReport.submission_type === 'pdf' ? '2.4 MB' : 'Text content',
        reviewStatus: latestReport.status || 'awaiting'
      });
    }
  }, [myReports, attachments, studentData]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    
    // Update checklist item 4 based on mode
    setChecklistItems(prev => prev.map((item, index) => {
      if (index === 3) {
        const statusMap = {
          'locked': { status: 'locked', meta: 'Attachment not yet complete' },
          'active': { status: 'pending', meta: 'Ends 2 May 2025' },
          'submitted': { status: 'done', meta: 'Completed 2 May 2025' }
        };
        return {
          ...item,
          status: statusMap[newMode].status,
          meta: statusMap[newMode].meta
        };
      }
      return item;
    }));
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (file) => {
    setFormData(prev => ({
      ...prev,
      uploadedFile: file
    }));
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({
      ...prev,
      uploadedFile: null
    }));
  };

  const handleSubmitReport = async () => {
    try {
      if (!formData.uploadedFile) {
        showToast('Please upload a file or enter text content', 'error');
        return;
      }
      
      const activeAttachment = attachments.find(att => att.status === 'active');
      if (!activeAttachment) {
        showToast('No active attachment found', 'error');
        return;
      }
      
      // Prepare report data
      const reportData = {
        attachment_id: activeAttachment.id,
        text_content: formData.reportTitle + '\n\n' + 
          'Department: ' + formData.department + '\n\n' +
          'Executive Summary: ' + formData.executiveSummary + '\n\n' +
          'Key Activities: ' + formData.keyActivities + '\n\n' +
          'Skills Acquired: ' + formData.skillsAcquired + '\n\n' +
          'Challenges: ' + formData.challenges + '\n\n' +
          'Recommendations: ' + formData.recommendations
      };
      
      let response;
      if (formData.uploadedFile instanceof File) {
        // Submit PDF
        const formDataToSend = new FormData();
        formDataToSend.append('file', formData.uploadedFile);
        formDataToSend.append('attachment_id', activeAttachment.id);
        
        response = await studentDataService.submitEndOfAttachmentReportPdf(formDataToSend);
      } else {
        // Submit text
        response = await studentDataService.submitEndOfAttachmentReportText(reportData);
      }
      
      // Refresh reports
      await loadStudentData();
      
      setMode('submitted');
      showToast('Report submitted successfully', 'success');
      
    } catch (error) {
      console.error('Error submitting report:', error);
      showToast(error.message, 'error');
    }
  };

  const handleSaveDraft = async () => {
    try {
      // For now, just show a toast
      // In a real implementation, this would save to backend
      showToast('Draft saved locally', 'success');
    } catch (error) {
      console.error('Error saving draft:', error);
      showToast(error.message, 'error');
    }
  };

  return (
    <div className={styles.shell}>
      <AppSidebar 
        navigationItems={navigationItems} 
        user={userDisplayInfo}
      />

      <div className={styles.main}>
        <div className={styles.topbar}>
          <div>
            <div className={styles.topbarTitle}>Final Report</div>
            <div className={styles.topbarSubtitle}>
              {loading ? 'Loading...' : `Submit your industrial attachment final report`}
            </div>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.demoTabs}>
              <button 
                className={`${styles.dtab} ${mode === 'active' ? styles.on : ''}`}
                onClick={() => setMode('active')}
                disabled={loading}
              >
                In progress
              </button>
              <button 
                className={`${styles.dtab} ${mode === 'locked' ? styles.on : ''}`}
                onClick={() => setMode('locked')}
                disabled={loading}
              >
                Not yet available
              </button>
              <button 
                className={`${styles.dtab} ${mode === 'submitted' ? styles.on : ''}`}
                onClick={() => setMode('submitted')}
                disabled={loading}
              >
                Submitted
              </button>
            </div>
          </div>
        </div>

        <div className={styles.content}>
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
          
          {loading && (
            <div className={styles.loadingState}>Loading your data...</div>
          )}
          
          {!loading && !error && (
            <div className={styles.inner}>
              {/* Locked Banner */}
              {mode === 'locked' && (
                <div className={styles.lockedBanner}>
                  <span className={styles.lbIcon}>🔒</span>
                  <div className={styles.lbText}>
                    <p><strong>Final report submission is not yet available.</strong> You can submit your final report once your attachment is marked as complete and all weekly reviews have been finished. {attachments.length > 0 ? `Your attachment ends on <strong>${studentDataService.formatDate(attachments[0]?.endDate)}</strong>.` : 'Please ensure you have an active attachment.'}</p>
                  </div>
                </div>
              )}

              {/* Checklist */}
              <SubmissionChecklist items={checklistItems} />

              {/* Form (active + locked states) */}
              {(mode === 'active' || mode === 'locked') && (
                <ReportForm
                  formData={formData}
                  onFormChange={handleFormChange}
                  onFileUpload={handleFileUpload}
                  onRemoveFile={handleRemoveFile}
                  onSubmit={handleSubmitReport}
                  onSaveDraft={handleSaveDraft}
                  isLocked={mode === 'locked'}
                />
              )}

              {/* Submitted View */}
              {mode === 'submitted' && submittedData && (
                <SubmittedView submittedData={submittedData} />
              )}
            </div>
          )}
        </div>
      </div>

      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default FinalReport;
