import React, { useState, useEffect } from 'react';
import styles from './DailyLogs.module.css';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';
import { profileService } from '../../../shared/profile/profileService';
import { useAuth } from '../../../contexts/AuthContext';
import Weekstoggle from "../widgets/weekstoggle/weekstoggle";
import Button from '../../../shared/components/Button';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import WeeklyLogs from '../widgets/weeklylogswidget/WeeklyLogs';

const DailyLogs = () => {
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
      <AppSidebar 
        navigationItems={profileService.getNavigationItems(profileData || user)} 
        user={profileService.getUserDisplayInfo(profileData || user)}
      />
      <div className={styles.main}>
        <div className={styles.header}>
          <Weekstoggle />
        </div>
        <div className={styles.content}>
          <WeeklyLogs />
        </div>
        <div className={styles.pagination}>
        <Button icon={FaArrowLeft}>previous</Button>
        <Button icon={FaArrowRight}>next</Button>
      </div>
      </div>
    
    </div>
  );
};

export default DailyLogs;
