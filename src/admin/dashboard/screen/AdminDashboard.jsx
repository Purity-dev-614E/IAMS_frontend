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
import { useAuth } from '../../../contexts/AuthContext';
import { profileService } from '../../../shared/profile/profileService';
import { adminDashboardService } from '../services/adminDashboardService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
      // Assuming there's a method in userApi or similar
      // await userApi.approve(id);
      loadDashboardData(); // Refresh
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  const handleRejectSupervisor = async (id) => {
    try {
      // await userApi.reject(id);
      loadDashboardData(); // Refresh
    } catch (err) {
      console.error('Rejection failed:', err);
    }
  };

  if (loading && !dashboardData.systemStats) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}>Loading admin dashboard...</div>
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
          <PendingBanner pendingCount={dashboardData.systemStats?.pending_attachments} />
          
          {/* STATS */}
          <AdminStatsGrid stats={adminDashboardService.transformSystemStats(dashboardData.systemStats)} />
          
          {/* MAIN GRID */}
          <div className={styles.mainGrid}>
            {/* LEFT */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
              {/* New students list */}
              <NewStudents students={dashboardData.newStudents} />
              
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
              <WeeklyReviewTrigger metrics={dashboardData.metrics} />
              
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
    </div>
  );
};

export default AdminDashboard;
