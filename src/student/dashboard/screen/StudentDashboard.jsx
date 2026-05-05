import React, { useState, useEffect } from 'react';
import styles from './StudentDashboard.module.css';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';
import { profileService } from '../../../shared/profile/profileService';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Topbar,
  AlertBanner,
  StatsGrid,
  LogCTA,
  ThisWeekLogs,
  WeeklyReviews,
  AttachmentInfo,
  Reminders
} from '../widgets';

const StudentDashboard = () => {
  const [profileData, setProfileData] = useState(null);
  const { user } = useAuth();

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
        <Topbar />
        
        {/* CONTENT */}
        <div className={styles.content}>
          {/* Alert: today's log missing */}
          <AlertBanner />
          
          {/* STATS */}
          <StatsGrid />
          
          {/* LOG CTA */}
          <LogCTA />
          
          {/* MAIN GRID */}
          <div className={styles.mainGrid}>
            {/* LEFT: This week's logs */}
            <div>
              <ThisWeekLogs />
              
              {/* Weekly reviews */}
              <WeeklyReviews />
            </div>
            
            {/* RIGHT COLUMN */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
              {/* Attachment details */}
              <AttachmentInfo />
              
              {/* Quick tips */}
              <Reminders />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
