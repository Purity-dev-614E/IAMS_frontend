import React, { useState, useEffect } from 'react';
import styles from './MyAttachmentsWidget.module.css';
import { 
  AttachmentSidebar,
  AttachmentTopbar,
  EmptyState,
  PendingNotice,
  AttachmentCard,
  RegisterForm
} from '../widgets';
import { useAttachments } from '../services/useAttachments';

const MyAttachments = () => {
  const [activeView, setActiveView] = useState('empty');
  const [formData, setFormData] = useState({
    organization: '',
    department: '',
    industrySupervisor: '',
    industrySupervisorEmail: '',
    startDate: '',
    endDate: ''
  });

  const { 
    attachments, 
    loading, 
    error, 
    createAttachment, 
    getAttachmentLogs,
    clearError 
  } = useAttachments();

  // Set initial view based on attachments
  useEffect(() => {
    if (attachments.length > 0) {
      const latestAttachment = attachments[0];
      if (latestAttachment.status === 'Active') {
        setActiveView('active');
      } else if (latestAttachment.status === 'Pending activation') {
        setActiveView('pending');
      } else {
        setActiveView('empty');
      }
    }
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
      await createAttachment(formData);
      setActiveView('pending');
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleViewLogs = async () => {
    if (attachments.length > 0) {
      try {
        await getAttachmentLogs(attachments[0].id);
        // Navigate to logs page
        console.log('Navigate to logs page');
      } catch (err) {
        // Error is handled by the hook
      }
    }
  };

  const handleRegister = () => {
    setActiveView('register');
    clearError();
  };

  const handleCancel = () => {
    setActiveView('empty');
    setFormData({
      organization: '',
      department: '',
      industrySupervisor: '',
      industrySupervisorEmail: '',
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
    return attachments.length > 0 ? attachments[0] : null;
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

            {/* EMPTY STATE */}
            {!loading && !error && activeView === 'empty' && (
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
                    universitySupervisor={attachment.universitySupervisor || 'Not yet assigned'}
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
                  universitySupervisor={attachment.universitySupervisor}
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
            {activeView === 'register' && (
              <RegisterForm
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmitForm}
                onCancel={handleCancel}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAttachments;
