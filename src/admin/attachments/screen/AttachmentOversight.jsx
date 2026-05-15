import React, { useState, useEffect } from 'react';
import styles from './AttachmentOversight.module.css';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';
import StatsCards from '../widgets/StatsCards';
import StatusTabs from '../widgets/StatusTabs';
import AttachmentTable from '../widgets/AttachmentTable';
import DetailDrawer from '../widgets/DetailDrawer';
import ActivateConfirmModal from '../widgets/ActivateConfirmModal';
import Toast from '../../../shared/widgets/Toast';
import { useAuth } from '../../../contexts/AuthContext';
import attachmentApi from '../services/attachmentServices';

const AttachmentOversight = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const adminNavigationItems = [
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
  const [toast, setToast] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });

  // Fetch attachments from API
  const fetchAttachments = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = {
        status: activeTab === 'all' ? undefined : activeTab,
        page: 1,
        limit: 50
      };
      const response = await attachmentApi.getAttachments(filters);
      setAttachments(response.data?.attachments || response.attachments || []);
    } catch (err) {
      setError(err.message);
      showToast('Failed to fetch attachments', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAttachments();
  }, [activeTab]);

  // Since we fetch data based on activeTab, no need for additional filtering
  const filteredAttachments = attachments;

  const pendingCount = attachments.filter(a => a.status === 'pending').length;
  const activeCount = attachments.filter(a => a.status === 'active').length;
  const completedCount = attachments.filter(a => a.status === 'completed').length;

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

  const handleActivate = (attachment) => {
    setSelectedAttachment(attachment);
    setIsActivateModalOpen(true);
  };

  const handleView = (attachment) => {
    setSelectedAttachment(attachment);
    setIsDrawerOpen(true);
  };

  const handleResend = async (attachment) => {
    try {
      await attachmentApi.resendReviewEmail(attachment.id);
      showToast('Review email resent successfully');
    } catch (error) {
      showToast('Failed to resend review email', 'error');
    }
  };

  const handleConfirmActivate = async () => {
    if (!selectedAttachment) return;
    setActivating(true);

    try {
      console.log('Activating attachment:', selectedAttachment.id);
      const response = await attachmentApi.activateAttachment(selectedAttachment.id);
      console.log('Activation response:', response);
      showToast('Attachment activated successfully');
      setIsActivateModalOpen(false);
      setSelectedAttachment(null);
      await fetchAttachments();
    } catch (error) {
      console.error('Activation error:', error);
      showToast(error.message || 'Failed to activate attachment', 'error');
    } finally {
      setActivating(false);
    }
  };

  const handleStatusChange = async (attachment, action) => {
    try {
      let response;
      switch (action) {
        case 'activate':
          response = await attachmentApi.activateAttachment(attachment.id);
          showToast('Attachment activated successfully');
          break;
        case 'complete':
          response = await attachmentApi.completeAttachment(attachment.id);
          showToast('Attachment marked as complete');
          break;
        case 'deact':
          response = await attachmentApi.deactivateAttachment(attachment.id);
          showToast('Attachment deactivated');
          break;
        default:
          showToast('Status changed');
      }
      // Refresh the data
      fetchAttachments();
    } catch (error) {
      showToast('Failed to update attachment status', 'error');
    }
  };

  const handleResendEmail = async (attachment) => {
    try {
      await attachmentApi.resendReviewEmail(attachment.id);
      showToast('Review email resent to industry supervisor');
    } catch (error) {
      showToast('Failed to resend review email', 'error');
    }
  };

  return (
    <div className={styles.shell}>
      <AppSidebar 
        navigationItems={adminNavigationItems} 
        user={user ? {
          initials: 'AD',
          name: user.name || 'Admin',
          role: 'System Administrator'
        } : null}
      />

      <div className={styles.main}>
        <div className={styles.topbar}>
          <div>
            <div className={styles.topbarTitle}>Attachment Oversight</div>
            <div className={styles.topbarSubtitle}>
              {loading ? 'Loading...' : `${attachments.length} attachments · ${pendingCount} pending activation`}
            </div>
          </div>
          <div className={styles.topbarRight}>
            <button className={styles.btnGhost}>â Export</button>
          </div>
        </div>

        <div className={styles.content}>
          <StatsCards 
            pending={pendingCount}
            active={activeCount}
            completed={completedCount}
            total={attachments.length}
          />

          <StatusTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            pendingCount={pendingCount}
            activeCount={activeCount}
            completedCount={completedCount}
          />

          <AttachmentTable 
            attachments={filteredAttachments}
            onActivate={handleActivate}
            onView={handleView}
            onResend={handleResend}
            loading={loading}
          />

          {/* PAGINATION */}
          <div className={styles.pagination}>
            <span className={styles.pgInfo}>Showing {filteredAttachments.length} of {attachments.length} attachments</span>
            <div className={styles.pgBtns}>
              <button className={styles.pgBtn}>â</button>
              <button className={`${styles.pgBtn} ${styles.on}`}>1</button>
              <button className={styles.pgBtn}>2</button>
              <button className={styles.pgBtn}>3</button>
              <button className={styles.pgBtn}>â</button>
            </div>
          </div>
        </div>
      </div>

      <DetailDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        attachment={selectedAttachment}
        onStatusChange={handleStatusChange}
        onResendEmail={handleResendEmail}
      />

      <ActivateConfirmModal 
        isOpen={isActivateModalOpen}
        isActivating={activating}
        onClose={() => setIsActivateModalOpen(false)}
        onConfirm={handleConfirmActivate}
        studentName={selectedAttachment?.student_name}
        organization={selectedAttachment?.organization_name}
      />

      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default AttachmentOversight;
