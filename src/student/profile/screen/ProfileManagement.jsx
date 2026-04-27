import React, { useState } from 'react';
import styles from './ProfileManagement.module.css';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';
import { studentNavigation } from '../../../shared/components/AppSidebar/sidebarConfig';
import ProfileDetails from '../widgets/ProfileDetails';
import PasswordChange from '../widgets/PasswordChange';
import Toast from '../../../shared/widgets/Toast';

const ProfileManagement = () => {
  const [toast, setToast] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });

  const user = {
    name: 'Purity Sang',
    role: 'Student · BBIT',
    initials: 'PS'
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
      <AppSidebar navigationItems={studentNavigation} user={user} />
      
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
