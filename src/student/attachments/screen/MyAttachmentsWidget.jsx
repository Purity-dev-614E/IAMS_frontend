import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyAttachmentsWidget.module.css';
import { 
  AttachmentSidebar,
  AttachmentTopbar,
  EmptyState,
  PendingNotice,
  AttachmentCard,
  RegisterForm,
  EligibilityNotice,
  EligibilityReviewModal
} from '../widgets';
import { useAttachments } from '../services/useAttachments';
import { eligibilityService } from '../services/eligibilityService';
import { isActiveAttachment } from '../services/studentAttachmentAccess';

const MyAttachments = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('empty');
  const [formData, setFormData] = useState({
    organization: '',
    supervisorName: '',
    supervisorEmail: '',
    startDate: '',
    endDate: ''
  });
  const [eligibilityState, setEligibilityState] = useState({
    loading: true,
    data: null,
    error: ''
  });
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  const { 
    attachments, 
    loading, 
    error, 
    createAttachment, 
    clearError 
  } = useAttachments();

  const fetchEligibility = async () => {
    setEligibilityState(prev => ({ ...prev, loading: true, error: '' }));
    try {
      const response = await eligibilityService.getMyEligibility();
      setEligibilityState({
        loading: false,
        data: response.eligibility || response,
        error: ''
      });
    } catch (err) {
      setEligibilityState({
        loading: false,
        data: null,
        error: err.message || 'Failed to check attachment eligibility.'
      });
    }
  };

  useEffect(() => {
    fetchEligibility();
  }, []);

  // Set initial view based on attachments
  useEffect(() => {
    setActiveView(attachments.some(isActiveAttachment) ? 'active' : 'empty');
  }, [attachments]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleViewChange = (view) => {
    setActiveView(view);
    clearError();
  };

  const handleSubmitForm = async () => {
    try {
      const response = await eligibilityService.getMyEligibility();
      const eligibility = response.eligibility || response;
      setEligibilityState({ loading: false, data: eligibility, error: '' });

      if (eligibility?.eligible === false) {
        setActiveView('empty');
        return;
      }

      await createAttachment(formData);
      setActiveView('pending');
    } catch {
      await fetchEligibility();
    }
  };

  const handleViewLogs = async () => {
    if (attachments.length > 0) {
      try {
        // Navigate to logs page for this attachment
        navigate('/logs');
      } catch {
        // Error is handled by the hook
      }
    }
  };

  const handleRegister = () => {
    if (eligibilityState.data?.eligible === false) {
      return;
    }
    setActiveView('register');
    clearError();
  };

  const handleSubmitReview = async (payload) => {
    setIsReviewSubmitting(true);
    try {
      await eligibilityService.requestReview(payload);
      setReviewSuccess('Your eligibility review request has been submitted and is pending admin review.');
      setIsReviewModalOpen(false);
      await fetchEligibility();
    } catch (err) {
      setEligibilityState(prev => ({
        ...prev,
        error: err.message || 'Failed to submit eligibility review request.'
      }));
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  const handleCancel = () => {
    setActiveView('empty');
    setFormData({
      organization: '',
      supervisorName: '',
      supervisorEmail: '',
      startDate: '',
      endDate: ''
    });
    clearError();
  };

  // Helper to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Get current attachment for display
  const getCurrentAttachment = () => {
    if (activeView === 'active') {
      return attachments.find(isActiveAttachment) || null;
    }

    if (activeView === 'pending') {
      return attachments.find(attachment => String(attachment.status || '').toLowerCase() === 'pending') || null;
    }

    return attachments.length > 0 ? attachments[0] : null;
  };

  const getUniversitySupervisorName = (attachment) => {
    const supervisorName = attachment?.universitySupervisor || '';

    console.log('[IAMS supervisor debug] attachment card supervisor display:', {
      attachmentSupervisor: attachment?.universitySupervisor,
      attachmentSupervisorEmail: attachment?.universitySupervisorEmail,
      attachmentSupervisorStaffId: attachment?.universitySupervisorStaffId,
      displayedSupervisor: supervisorName
    });

    return supervisorName;
  };

  return (
    <div className={styles.shell}>
      <AttachmentSidebar />
      
      <div className={styles.main}>
        <AttachmentTopbar 
          activeView={activeView} 
          onViewChange={handleViewChange} 
        />
        
        <div className={styles.content}>
          <div className={styles.pageInner}>
            <div className={styles.pageHeader}>
              <h1>My Attachment</h1>
              <p>Your industrial attachment details and progress for the 2025 cohort.</p>
            </div>

            {/* LOADING STATE */}
            {loading && (
              <div className={styles.loadingState}>
                <p>Loading your attachments...</p>
              </div>
            )}

            {/* ERROR STATE */}
            {error && (
              <div className={styles.errorState}>
                <p>{error}</p>
                <button onClick={clearError} className={styles.btnRetry}>Retry</button>
              </div>
            )}

            {eligibilityState.error && (
              <div className={styles.errorState}>
                <p>{eligibilityState.error}</p>
                <button onClick={fetchEligibility} className={styles.btnRetry}>Retry</button>
              </div>
            )}

            {reviewSuccess && (
              <div className={styles.successState}>
                <p>{reviewSuccess}</p>
              </div>
            )}

            {!loading && !eligibilityState.loading && !error && eligibilityState.data?.eligible === false && (
              <EligibilityNotice
                message={eligibilityState.data?.message}
                pendingReview={eligibilityState.data?.pendingReview}
                onRequestReview={() => setIsReviewModalOpen(true)}
              />
            )}

            {/* EMPTY STATE */}
            {!loading && !eligibilityState.loading && !error && eligibilityState.data?.eligible !== false && activeView === 'empty' && (
              <EmptyState onRegister={handleRegister} />
            )}

            {/* PENDING STATE */}
            {!loading && !error && activeView === 'pending' && (() => {
              const attachment = getCurrentAttachment();
              return attachment ? (
                <>
                  <PendingNotice />
                  <AttachmentCard
                    organization={attachment.organization}
                    department={`${attachment.department}`}
                    status={attachment.status}
                    industrySupervisor={attachment.industrySupervisor}
                    industrySupervisorEmail={attachment.industrySupervisorEmail}
                    universitySupervisor={getUniversitySupervisorName(attachment)}
                    startDate={formatDate(attachment.startDate)}
                    endDate={formatDate(attachment.endDate)}
                    submissionDate={formatDate(attachment.submissionDate)}
                  />
                </>
              ) : null;
            })()}

            {/* ACTIVE STATE */}
            {!loading && !error && activeView === 'active' && (() => {
              const attachment = getCurrentAttachment();
              return attachment ? (
                <AttachmentCard
                  organization={attachment.organization}
                  department={`${attachment.department}`}
                  status={attachment.status}
                  industrySupervisor={attachment.industrySupervisor}
                  industrySupervisorEmail={attachment.industrySupervisorEmail}
                  universitySupervisor={getUniversitySupervisorName(attachment)}
                  startDate={formatDate(attachment.startDate)}
                  endDate={formatDate(attachment.endDate)}
                  duration={attachment.duration}
                  currentWeek={attachment.currentWeek}
                  progress={attachment.progress}
                  activationDate={formatDate(attachment.activationDate)}
                  lastLogDate={attachment.lastLogDate}
                  onViewLogs={handleViewLogs}
                />
              ) : null;
            })()}

            {/* REGISTER FORM */}
            {activeView === 'register' && eligibilityState.data?.eligible !== false && (
              <RegisterForm
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmitForm}
                onCancel={handleCancel}
                isSubmitting={loading || eligibilityState.loading}
              />
            )}
          </div>
        </div>
      </div>

      <EligibilityReviewModal
        isOpen={isReviewModalOpen}
        isSubmitting={isReviewSubmitting}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default MyAttachments;
