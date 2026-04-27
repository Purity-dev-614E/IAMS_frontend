import React, { useState } from 'react';
import styles from './AttachmentOversight.module.css';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';
import StatsCards from '../widgets/StatsCards';
import StatusTabs from '../widgets/StatusTabs';
import AttachmentTable from '../widgets/AttachmentTable';
import DetailDrawer from '../widgets/DetailDrawer';
import ActivateConfirmModal from '../widgets/ActivateConfirmModal';
import Toast from '../../../shared/widgets/Toast';
import { useAuth } from '../../../contexts/AuthContext';

const AttachmentOversight = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
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

  // Mock attachment data
  const [attachments] = useState([
    {
      id: 1,
      studentName: 'Kevin Mutua',
      regNumber: 'HDB212-0089/2022',
      organization: 'Safaricom PLC',
      orgLocation: 'Nairobi',
      orgDept: 'IT Dept',
      industrySupervisor: 'james.mwangi@safaricom.co.ke',
      industrySupervisorName: 'James Mwangi',
      period: '7 Apr – 20 Jun',
      status: 'pending',
      logs: 0,
      startDate: '7 Apr 2025',
      endDate: '20 Jun 2025',
      uniSupervisor: 'Dr. F. Kamau',
      assignedDate: '7 Apr 2025',
      lastLogDate: '—'
    },
    {
      id: 2,
      studentName: 'James Kariuki',
      regNumber: 'HDB212-0091/2022',
      organization: 'NCBA Bank',
      orgLocation: 'Nairobi',
      orgDept: 'Technology',
      industrySupervisor: 'tech.hr@ncbagroup.com',
      industrySupervisorName: 'Tech HR Team',
      period: '7 Apr – 20 Jun',
      status: 'pending',
      logs: 0,
      startDate: '7 Apr 2025',
      endDate: '20 Jun 2025',
      uniSupervisor: 'Dr. Omondi',
      assignedDate: '7 Apr 2025',
      lastLogDate: '—'
    },
    {
      id: 3,
      studentName: 'Purity Chelagat Sang',
      regNumber: 'HDB212-0324/2022',
      organization: 'Safaricom PLC',
      orgLocation: 'Nairobi',
      orgDept: 'Software Eng',
      industrySupervisor: 'j.mwangi@safaricom.co.ke',
      industrySupervisorName: 'James Mwangi',
      period: '17 Feb – 2 May',
      status: 'active',
      logs: 27,
      startDate: '17 Feb 2025',
      endDate: '2 May 2025',
      uniSupervisor: 'Dr. F. Kamau',
      assignedDate: '17 Feb 2025',
      lastLogDate: 'Today, 3 April 2025'
    },
    {
      id: 4,
      studentName: 'Grace Wanjiru',
      regNumber: 'HDB212-0204/2022',
      organization: 'KCB Group',
      orgLocation: 'Nairobi',
      orgDept: 'IT',
      industrySupervisor: 'it.intern@kcbgroup.com',
      industrySupervisorName: 'IT Department',
      period: '17 Feb – 2 May',
      status: 'active',
      logs: 9,
      startDate: '17 Feb 2025',
      endDate: '2 May 2025',
      uniSupervisor: 'Dr. Omondi',
      assignedDate: '17 Feb 2025',
      lastLogDate: '2 days ago'
    },
    {
      id: 5,
      studentName: 'Amina Hassan',
      regNumber: 'HDB212-0317/2022',
      organization: 'Nation Media Group',
      orgLocation: 'Nairobi',
      orgDept: 'Digital',
      industrySupervisor: 'digital@nationmedia.com',
      industrySupervisorName: 'Digital Team',
      period: '17 Feb – 2 May',
      status: 'active',
      logs: 24,
      startDate: '17 Feb 2025',
      endDate: '2 May 2025',
      uniSupervisor: 'Dr. Waweru',
      assignedDate: '17 Feb 2025',
      lastLogDate: 'Yesterday'
    },
    {
      id: 6,
      studentName: 'Brian Otieno',
      regNumber: 'HDB212-0112/2022',
      organization: 'Kenya Power',
      orgLocation: 'Nairobi',
      orgDept: 'ICT',
      industrySupervisor: 'ict@kplc.co.ke',
      industrySupervisorName: 'ICT Department',
      period: 'Jan – Mar 2025',
      status: 'completed',
      logs: 55,
      startDate: '6 Jan 2025',
      endDate: '28 Mar 2025',
      uniSupervisor: 'Dr. F. Kamau',
      assignedDate: '6 Jan 2025',
      lastLogDate: '28 Mar 2025'
    }
  ]);

  const filteredAttachments = attachments.filter(attachment => {
    if (activeTab === 'all') return true;
    return attachment.status === activeTab;
  });

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

  const handleResend = (attachment) => {
    showToast('Review email resent');
  };

  const handleConfirmActivate = () => {
    showToast('Attachment activated');
    setIsActivateModalOpen(false);
    setSelectedAttachment(null);
  };

  const handleStatusChange = (attachment, action) => {
    const actionMessages = {
      activate: 'Attachment activated',
      complete: 'Marked as complete',
      deact: 'Attachment deactivated'
    };
    showToast(actionMessages[action] || 'Status changed');
  };

  const handleResendEmail = (attachment) => {
    showToast('Review email resent to industry supervisor');
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
            <div className={styles.topbarSubtitle}>{attachments.length} attachments · {pendingCount} pending activation</div>
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
        onClose={() => setIsActivateModalOpen(false)}
        onConfirm={handleConfirmActivate}
        studentName={selectedAttachment?.studentName}
        organization={selectedAttachment?.organization}
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
