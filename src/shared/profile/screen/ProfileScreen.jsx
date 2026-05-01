import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfileScreen.module.css';
import AppSidebar from '../../components/AppSidebar/AppSidebar';
import DynamicProfileDetails from '../widgets/DynamicProfileDetails';
import PasswordChange from '../../../student/profile/widgets/PasswordChange';
import Toast from '../../widgets/Toast';
import { useAuth } from '../../../contexts/AuthContext';
import { profileService } from '../profileService';

const ProfileScreen = () => {
  const [toast, setToast] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const profile = await profileService.fetchProfile();
      setProfileData(profile);
      // Update auth context with fresh user data
      updateUser(profile);
    } catch (error) {
      showToast('Failed to load profile data', 'error');
      console.error('Profile fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfileData = async (updateData) => {
    setIsLoading(true);
    try {
      const updatedProfile = await profileService.updateProfile(updateData);
      setProfileData(updatedProfile);
      updateUser(updatedProfile);
      showToast('Profile updated successfully');
      return true;
    } catch (error) {
      showToast('Failed to update profile', 'error');
      console.error('Profile update error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    setIsLoading(true);
    try {
      const success = await profileService.changePassword(passwordData);
      if (success) {
        showToast('Password changed successfully');
        return true;
      }
      return false;
    } catch (error) {
      showToast('Failed to change password', 'error');
      console.error('Password change error:', error);
      return false;
    } finally {
      setIsLoading(false);
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

  const handleProfileUpdate = async (updateData) => {
    return await updateProfileData(updateData);
  };

  const handlePasswordChange = async (passwordData) => {
    return await changePassword(passwordData);
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'success');
      // Navigate to login screen after successful logout
      setTimeout(() => {
        navigate('/login');
      }, 1000); // Small delay to show toast message
    } catch (error) {
      showToast('Failed to logout', 'error');
      console.error('Logout error:', error);
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
        <div className={styles.topbar}>
          <div>
            <div className={styles.topbarTitle}>Profile</div>
            <div className={styles.topbarSubtitle}>Manage your account details</div>
          </div>
          <button 
            className={styles.logoutButton}
            onClick={handleLogout}
            disabled={isLoading}
          >
            Logout
          </button>
        </div>
        
        {/* CONTENT */}
        <div className={styles.content}>
          <div className={styles.contentInner}>
            <DynamicProfileDetails 
              user={profileData || user} 
              onSave={handleProfileUpdate}
              isLoading={isLoading}
            />
            <PasswordChange 
              onSave={handlePasswordChange}
              isLoading={isLoading}
            />
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

export default ProfileScreen;
