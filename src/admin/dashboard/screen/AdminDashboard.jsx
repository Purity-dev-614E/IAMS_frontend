import React, { useState, useEffect } from 'react';
import styles from './AdminDashboard.module.css';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';
import AdminTopbar from '../widgets/AdminTopbar';
import PendingBanner from '../widgets/PendingBanner';
import AdminStatsGrid from '../widgets/AdminStatsGrid';
import NewStudents from '../widgets/NewStudents';
import PendingSupervisorApprovals from '../widgets/PendingSupervisorApprovals';
import WeeklyReviewTrigger from '../widgets/WeeklyReviewTrigger';
import SubmissionDonut from '../widgets/SubmissionDonut';
import QuickActions from '../widgets/QuickActions';
import RecentActivity from '../widgets/RecentActivity';
import DetailDrawer from '../../attachments/widgets/DetailDrawer';
import { useAuth } from '../../../contexts/AuthContext';
import { profileService } from '../../../shared/profile/profileService';
import { adminDashboardService } from '../services/adminDashboardService';
import { studentApi } from '../../students/services/studentServices';
import attachmentApi from '../../attachments/services/attachmentServices';
import supervisorApprovalService from '../../supervisor-approval/services/supervisorApprovalService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Dashboard data state
  const [dashboardData, setDashboardData] = useState({
    systemStats: null,
    recentActivity: [],
    weeklyTrends: [],
    programDistribution: [],
    industryFeedbackStats: null,
    metrics: null,
    pendingSupervisors: [],
    newStudents: []
  });

  // Fetch data on component mount
  useEffect(() => {
    if (user) {
      loadDashboardData();
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      const profile = await profileService.fetchProfile();
      setProfileData(profile);
    } catch (error) {
      console.error('Profile fetch error:', error);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [data, pendingSupervisors, newStudents] = await Promise.all([
        adminDashboardService.fetchDashboardData(),
        adminDashboardService.fetchPendingSupervisors(),
        adminDashboardService.fetchNewStudents()
      ]);
      
      setDashboardData({
        ...data,
        pendingSupervisors,
        newStudents
      });
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSupervisor = async (id) => {
    try {
      await supervisorApprovalService.approveSupervisor(id);
      await loadDashboardData();
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  const handleRejectSupervisor = async (id) => {
    try {
      await supervisorApprovalService.rejectSupervisor(id);
      await loadDashboardData();
    } catch (err) {
      console.error('Rejection failed:', err);
    }
  };

  const handleViewStudent = async (student) => {
    try {
      const attachment = await studentApi.getPrimaryAttachmentForStudent(student);
      if (!attachment) return;

      setSelectedAttachment({
        ...attachment,
        student_name: attachment.student_name || student.student_name || student.name,
        student_email: attachment.student_email || student.student_email || student.email,
        reg_number: attachment.reg_number || student.reg_number || student.regNumber,
        supervisor_name: attachment.supervisor_name || student.supervisor_name || student.supervisor
      });
      setIsDrawerOpen(true);
    } catch (err) {
      console.error('Failed to load attachment details:', err);
    }
  };

  const handleStatusChange = async (attachment, action) => {
    try {
      if (action === 'activate') {
        await attachmentApi.activateAttachment(attachment.id);
      }
      await loadDashboardData();
    } catch (err) {
      console.error('Failed to update attachment status:', err);
    }
  };

  const handleResendEmail = async (attachment) => {
    try {
      await attachmentApi.resendReviewEmail(attachment.id);
    } catch (err) {
      console.error('Failed to resend review email:', err);
    }
  };

  if (loading && !dashboardData.systemStats) {
    return (
      <div className={styles.loadingContainer}>
        <aside className={styles.loadingSidebar}>
          <div className={styles.loadingLogo}></div>
          <div className={styles.loadingNav}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </aside>
        <main className={styles.loadingMain}>
          <div className={styles.loadingTopbar}>
            <div>
              <div className={styles.loadingTitle}></div>
              <div className={styles.loadingSubtitle}></div>
            </div>
            <div className={styles.loadingPulse}>
              <span className={styles.loadingSpinner}></span>
              Loading dashboard
            </div>
          </div>
          <div className={styles.loadingContent}>
            <div className={styles.loadingStats}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className={styles.loadingGrid}>
              <div className={styles.loadingPanel}></div>
              <div className={styles.loadingPanelSmall}></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      {/* SIDEBAR */}
      <AppSidebar 
        navigationItems={profileService.getNavigationItems(profileData || user)} 
        user={profileService.getUserDisplayInfo(profileData || user)}
      />
      
      {/* MAIN */}
      <div className={styles.main}>
        {/* TOPBAR */}
        <AdminTopbar user={profileData || user} />
        
        {/* CONTENT */}
        <div className={styles.content}>
          {error && (
            <div className={styles.errorBanner}>
              {error}
              <button onClick={loadDashboardData} className={styles.retryBtn}>Retry</button>
            </div>
          )}

          {/* Pending approval banner */}
          <PendingBanner pendingCount={dashboardData.pendingSupervisors.length} />
          
          {/* STATS */}
          <AdminStatsGrid stats={adminDashboardService.transformSystemStats(dashboardData.systemStats)} />
          
          {/* MAIN GRID */}
          <div className={styles.mainGrid}>
            {/* LEFT */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
              {/* New students list */}
              <NewStudents students={dashboardData.newStudents} onViewStudent={handleViewStudent} />
              
              {/* Pending supervisor approvals */}
              <PendingSupervisorApprovals 
                supervisors={dashboardData.pendingSupervisors} 
                onApprove={handleApproveSupervisor}
                onReject={handleRejectSupervisor}
              />
            </div>
            
            {/* RIGHT */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
              {/* Weekly review trigger */}
              <WeeklyReviewTrigger metrics={dashboardData.metrics} onTriggered={loadDashboardData} />
              
              {/* Submission breakdown donut */}
              <SubmissionDonut systemStats={dashboardData.systemStats} />
              
              {/* Quick actions */}
              <QuickActions />
              
              {/* Recent activity */}
              <RecentActivity 
                activities={adminDashboardService.transformRecentActivity(dashboardData.recentActivity)} 
              />
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
    </div>
  );
};

export default AdminDashboard;
