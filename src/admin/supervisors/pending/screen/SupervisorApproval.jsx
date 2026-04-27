import React from 'react';
import styles from './SupervisorApproval.module.css';
import AppSidebar from '../../../../shared/components/AppSidebar/AppSidebar';
import { useAuth } from '../../../../contexts/AuthContext';

const SupervisorApproval = () => {
  const { user } = useAuth();

  const adminNavigationItems = [
    {
      title: 'System',
      items: [
        { to: '/admin', label: 'Dashboard', icon: '▦' },
        { to: '/admin/users', label: 'Users', icon: '◉' },
        { to: '/admin/students', label: 'Students', icon: '⊞' },
        { to: '/admin/attachments', label: 'Attachments', icon: '◎' },
      ]
    },
    {
      title: 'Actions',
      items: [
        { to: '/admin/supervisors/pending', label: 'Supervisor Approval', icon: '✓' },
        { to: '/admin/reports', label: 'Reports', icon: '↓' },
      ]
    }
  ];

  return (
    <div className={styles.shell}>
      <AppSidebar 
        navigationItems={adminNavigationItems} 
        user={user ? {
          initials: 'AD',
          name: user.name || 'Admin',
          role: 'System Administrator'
        } : null}
      />
      
      <div className={styles.main}>
        <div className={styles.topbar}>
          <div>
            <div className={styles.topbarTitle}>Supervisor Approval</div>
            <div className={styles.topbarSubtitle}>Approve supervisor registrations</div>
          </div>
        </div>
        
        <div className={styles.content}>
          <div className={styles.supervisorApproval}>
            <h1>Supervisor Approval</h1>
            <p>Approve supervisor registrations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorApproval;
