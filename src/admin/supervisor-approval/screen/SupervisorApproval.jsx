import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { profileService } from '../../../shared/profile/profileService';
import supervisorApprovalService from '../services/supervisorApprovalService';
import styles from './SupervisorApproval.module.css';
import UrgencyBanner from '../widgets/UrgencyBanner';
import SupervisorCard from '../widgets/SupervisorCard';
import ApproveConfirmModal from '../widgets/ApproveConfirmModal';
import RejectModal from '../widgets/RejectModal';
import HistoryTable from '../widgets/HistoryTable';
import EmptyState from '../widgets/EmptyState';
import Toast from '../../../shared/widgets/Toast';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';

const SupervisorApproval = () => {
  const { user } = useAuth();
  const [navigationItems, setNavigationItems] = useState([]);
  const [userDisplayInfo, setUserDisplayInfo] = useState({});

  // Fetch pending supervisors from API
  const fetchPendingSupervisors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await supervisorApprovalService.getPendingSupervisors();
      
      const formattedSupervisors = response.supervisors.map(supervisor => 
        supervisorApprovalService.formatSupervisorForDisplay(supervisor)
      );
      
      setPendingSupervisors(formattedSupervisors);
    } catch (error) {
      console.error('Error fetching pending supervisors:', error);
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
      fetchPendingSupervisors();
    }
  }, [user]);

  const [pendingSupervisors, setPendingSupervisors] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleConfirmApprove = async () => {
    if (!selectedSupervisor) return;

    try {
      // Add to removing animation
      setRemovingIds(prev => new Set(prev).add(selectedSupervisor.id));

      // Call API to approve supervisor
      await supervisorApprovalService.approveSupervisor(selectedSupervisor.id);

      // Remove card after animation
      setTimeout(() => {
        setPendingSupervisors(prev => prev.filter(s => s.id !== selectedSupervisor.id));
        setRemovingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(selectedSupervisor.id);
          return newSet;
        });

        // Add to history
        const historyEntry = supervisorApprovalService.formatHistoryEntry(
          selectedSupervisor, 
          'approved'
        );
        setHistory(prev => [historyEntry, ...prev]);

        showToast(`${selectedSupervisor.name} approved successfully`, 'success');
        setIsApproveModalOpen(false);
        setSelectedSupervisor(null);
      }, 250);
    } catch (error) {
      console.error('Error approving supervisor:', error);
      showToast(error.message, 'error');
      // Remove from removing set if API call fails
      setRemovingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedSupervisor.id);
        return newSet;
      });
    }
  };

  const handleConfirmReject = async (reason) => {
    if (!selectedSupervisor) return;

    try {
      // Add to removing animation
      setRemovingIds(prev => new Set(prev).add(selectedSupervisor.id));

      // Call API to reject supervisor
      await supervisorApprovalService.rejectSupervisor(selectedSupervisor.id);

      // Remove card after animation
      setTimeout(() => {
        setPendingSupervisors(prev => prev.filter(s => s.id !== selectedSupervisor.id));
        setRemovingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(selectedSupervisor.id);
          return newSet;
        });

        // Add to history
        const historyEntry = supervisorApprovalService.formatHistoryEntry(
          selectedSupervisor, 
          'rejected'
        );
        setHistory(prev => [historyEntry, ...prev]);

        showToast(`${selectedSupervisor.name} rejected successfully`, 'error');
        setIsRejectModalOpen(false);
        setSelectedSupervisor(null);
      }, 250);
    } catch (error) {
      console.error('Error rejecting supervisor:', error);
      showToast(error.message, 'error');
      // Remove from removing set if API call fails
      setRemovingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedSupervisor.id);
        return newSet;
      });
    }
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
       <AppSidebar 
        navigationItems={navigationItems} 
        user={userDisplayInfo}
      />
      {/* <aside className={styles.sidebar}>
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
      </aside> */}

      <div className={styles.main}>
        <div className={styles.topbar}>
          <div>
            <div className={styles.topbarTitle}>Supervisor Approval</div>
            <div className={styles.topbarSubtitle}>
              {loading ? 'Loading...' : `${pendingSupervisors.length} pending · supervisors cannot log in until approved`}
            </div>
          </div>
        </div>

        <div className={styles.content}>
          {error && (
            <div className={styles.errorMessage}>
              Error: {error}
              <button 
                onClick={fetchPendingSupervisors}
                className={styles.retryButton}
              >
                Retry
              </button>
            </div>
          )}
          
          <UrgencyBanner pendingCount={pendingSupervisors.length} />

          {loading ? (
            <div className={styles.loadingState}>Loading pending supervisors...</div>
          ) : pendingSupervisors.length === 0 ? (
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
