import React, { useState } from 'react';
import styles from './SupervisorApproval.module.css';
import UrgencyBanner from '../widgets/UrgencyBanner';
import SupervisorCard from '../widgets/SupervisorCard';
import ApproveConfirmModal from '../widgets/ApproveConfirmModal';
import RejectModal from '../widgets/RejectModal';
import HistoryTable from '../widgets/HistoryTable';
import EmptyState from '../widgets/EmptyState';
import Toast from '../../../shared/widgets/Toast';

const SupervisorApproval = () => {
  const [pendingSupervisors, setPendingSupervisors] = useState([
    {
      id: 1,
      name: 'Dr. Alice Njoroge',
      email: 'a.njoroge@jkuat.ac.ke',
      department: 'ETLM',
      registeredDate: 'Tuesday 1 Apr 2025',
      waitingDays: 2,
      staffId: 'JKUAT/2019/0441'
    },
    {
      id: 2,
      name: 'Mr. Samuel Kibet',
      email: 's.kibet@jkuat.ac.ke',
      department: 'Computing',
      registeredDate: 'Sunday 30 Mar 2025',
      waitingDays: 4,
      staffId: 'JKUAT/2021/0118'
    },
    {
      id: 3,
      name: 'Dr. Mary Achieng',
      email: 'm.achieng@jkuat.ac.ke',
      department: 'ETLM',
      registeredDate: 'Wednesday 27 Mar 2025',
      waitingDays: 7,
      staffId: 'JKUAT/2016/0072'
    }
  ]);

  const [history, setHistory] = useState([
    {
      name: 'Dr. Francis Kamau',
      email: 'f.kamau@jkuat.ac.ke',
      department: 'ETLM',
      actionedDate: '10 Jan 2025',
      decision: 'Approved'
    },
    {
      name: 'Dr. Omondi',
      email: 'omondi@jkuat.ac.ke',
      department: 'Computing',
      actionedDate: '10 Jan 2025',
      decision: 'Approved'
    },
    {
      name: 'Prof. Wanjiku',
      email: 'wanjiku@jkuat.ac.ke',
      department: 'ETLM',
      actionedDate: '9 Jan 2025',
      decision: 'Rejected'
    }
  ]);

  const [removingIds, setRemovingIds] = useState(new Set());
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [toast, setToast] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });

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

  const handleApprove = (supervisor) => {
    setSelectedSupervisor(supervisor);
    setIsApproveModalOpen(true);
  };

  const handleReject = (supervisor) => {
    setSelectedSupervisor(supervisor);
    setIsRejectModalOpen(true);
  };

  const handleConfirmApprove = () => {
    if (!selectedSupervisor) return;

    // Add to removing animation
    setRemovingIds(prev => new Set(prev).add(selectedSupervisor.id));

    // Remove card after animation
    setTimeout(() => {
      setPendingSupervisors(prev => prev.filter(s => s.id !== selectedSupervisor.id));
      setRemovingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedSupervisor.id);
        return newSet;
      });

      // Add to history
      setHistory(prev => [
        {
          name: selectedSupervisor.name,
          email: selectedSupervisor.email,
          department: selectedSupervisor.department,
          actionedDate: 'Today',
          decision: 'Approved'
        },
        ...prev
      ]);

      showToast(`${selectedSupervisor.name} approved — email sent`, 'success');
      setIsApproveModalOpen(false);
      setSelectedSupervisor(null);
    }, 250);
  };

  const handleConfirmReject = (reason) => {
    if (!selectedSupervisor) return;

    // Add to removing animation
    setRemovingIds(prev => new Set(prev).add(selectedSupervisor.id));

    // Remove card after animation
    setTimeout(() => {
      setPendingSupervisors(prev => prev.filter(s => s.id !== selectedSupervisor.id));
      setRemovingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedSupervisor.id);
        return newSet;
      });

      // Add to history
      setHistory(prev => [
        {
          name: selectedSupervisor.name,
          email: selectedSupervisor.email,
          department: selectedSupervisor.department,
          actionedDate: 'Today',
          decision: 'Rejected'
        },
        ...prev
      ]);

      showToast(`${selectedSupervisor.name} rejected — email sent`, 'error');
      setIsRejectModalOpen(false);
      setSelectedSupervisor(null);
    }, 250);
  };

  const handleCloseApproveModal = () => {
    setIsApproveModalOpen(false);
    setSelectedSupervisor(null);
  };

  const handleCloseRejectModal = () => {
    setIsRejectModalOpen(false);
    setSelectedSupervisor(null);
  };

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <div className={styles.logoMark}>IA</div>
          <span className={styles.logoLabel}>IAMS · Admin</span>
        </div>
        <span className={styles.navSectionLabel}>System</span>
        <a className={styles.navItem}>
          <div className={styles.navItemLeft}>
            <span className={styles.navIcon}>â¦</span> Dashboard
          </div>
        </a>
        <a className={styles.navItem}>
          <div className={styles.navItemLeft}>
            <span className={styles.navIcon}>â</span> Users
          </div>
        </a>
        <a className={styles.navItem}>
          <div className={styles.navItemLeft}>
            <span className={styles.navIcon}>â</span> Students
          </div>
        </a>
        <a className={styles.navItem}>
          <div className={styles.navItemLeft}>
            <span className={styles.navIcon}>â¡</span> Attachments
          </div>
        </a>
        <span className={styles.navSectionLabel} style={{marginTop: '16px'}}>Actions</span>
        <a className={`${styles.navItem} ${styles.active}`}>
          <div className={styles.navItemLeft}>
            <span className={styles.navIcon}>â</span> Supervisor Approval
          </div>
          {pendingSupervisors.length > 0 && (
            <span className={styles.navBadge}>{pendingSupervisors.length}</span>
          )}
        </a>
        <a className={styles.navItem}>
          <div className={styles.navItemLeft}>
            <span className={styles.navIcon}>â</span> Reports
          </div>
        </a>
        <div className={styles.sidebarBottom}>
          <div className={styles.userChip}>
            <div className={styles.avatar}>AD</div>
            <div>
              <div className={styles.userName}>Admin</div>
              <div className={styles.userRole}>System Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      <div className={styles.main}>
        <div className={styles.topbar}>
          <div>
            <div className={styles.topbarTitle}>Supervisor Approval</div>
            <div className={styles.topbarSubtitle}>
              {pendingSupervisors.length} pending · supervisors cannot log in until approved
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <UrgencyBanner pendingCount={pendingSupervisors.length} />

          {pendingSupervisors.length === 0 ? (
            <EmptyState />
          ) : (
            <div className={styles.grid}>
              {pendingSupervisors.map((supervisor) => (
                <SupervisorCard
                  key={supervisor.id}
                  supervisor={supervisor}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isRemoving={removingIds.has(supervisor.id)}
                />
              ))}
            </div>
          )}

          <div className={styles.sectionTitle}>Recently actioned</div>
          <HistoryTable history={history} />
        </div>
      </div>

      <ApproveConfirmModal
        isOpen={isApproveModalOpen}
        onClose={handleCloseApproveModal}
        onConfirm={handleConfirmApprove}
        supervisorName={selectedSupervisor?.name}
      />

      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={handleCloseRejectModal}
        onConfirm={handleConfirmReject}
        supervisorName={selectedSupervisor?.name}
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

export default SupervisorApproval;
