import React, { useState, useEffect } from 'react';
import styles from './AdminDashboard.module.css';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';
import AdminTopbar from '../widgets/AdminTopbar';
import PendingBanner from '../widgets/PendingBanner';
import AdminStatsGrid from '../widgets/AdminStatsGrid';
import StudentsNeedingAttention from '../widgets/StudentsNeedingAttention';
import PendingSupervisorApprovals from '../widgets/PendingSupervisorApprovals';
import WeeklyReviewTrigger from '../widgets/WeeklyReviewTrigger';
import SubmissionDonut from '../widgets/SubmissionDonut';
import QuickActions from '../widgets/QuickActions';
import RecentActivity from '../widgets/RecentActivity';
import { useAuth } from '../../../contexts/AuthContext';
import { profileService } from '../../../shared/profile/profileService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const profile = await profileService.fetchProfile();
      setProfileData(profile);
    } catch (error) {
      console.error('Profile fetch error:', error);
    }
  };

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
        <AdminTopbar />
        
        {/* CONTENT */}
        <div className={styles.content}>
          {/* Pending approval banner */}
          <PendingBanner />
          
          {/* STATS */}
          <AdminStatsGrid />
          
          {/* MAIN GRID */}
          <div className={styles.mainGrid}>
            {/* LEFT */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
              {/* Students needing attention */}
              <StudentsNeedingAttention />
              
              {/* Pending supervisor approvals */}
              <PendingSupervisorApprovals />
            </div>
            
            {/* RIGHT */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
              {/* Weekly review trigger */}
              <WeeklyReviewTrigger />
              
              {/* Submission breakdown donut */}
              <SubmissionDonut />
              
              {/* Quick actions */}
              <QuickActions />
              
              {/* Recent activity */}
              <RecentActivity />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
