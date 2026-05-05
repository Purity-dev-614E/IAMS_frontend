import React, { useState, useEffect } from 'react';
import styles from './ProfileManagement.module.css';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';
import { profileService } from '../../../shared/profile/profileService';
import { useAuth } from '../../../contexts/AuthContext';
import ProfileDetails from '../widgets/ProfileDetails';
import PasswordChange from '../widgets/PasswordChange';
import Toast from '../../../shared/widgets/Toast';

const ProfileManagement = () => {
  const [toast, setToast] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });
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
        <div className={styles.topbar}>
          <div>
            <div className={styles.topbarTitle}>Profile</div>
            <div className={styles.topbarSubtitle}>Manage your account details</div>
          </div>
        </div>
        
        {/* CONTENT */}
        <div className={styles.content}>
          <div className={styles.contentInner}>
            <ProfileDetails onSave={showToast} />
            <PasswordChange onSave={showToast} />
          </div>
        </div>
      </div>
      
      {/* TOAST */}
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default ProfileManagement;
