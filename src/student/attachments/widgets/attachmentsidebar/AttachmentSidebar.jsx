import React, { useState, useEffect } from 'react';
import AppSidebar from '../../../../shared/components/AppSidebar/AppSidebar';
import { profileService } from '../../../../shared/profile/profileService';
import { useAuth } from '../../../../contexts/AuthContext';

const AttachmentSidebar = () => {
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
    <AppSidebar 
      navigationItems={profileService.getNavigationItems(profileData || user)} 
      user={profileService.getUserDisplayInfo(profileData || user)}
    />
  );
};

export default AttachmentSidebar;
