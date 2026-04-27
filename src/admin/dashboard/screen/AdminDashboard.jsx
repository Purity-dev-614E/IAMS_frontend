import React from 'react';
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

const AdminDashboard = () => {
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
      {/* SIDEBAR */}
      <AppSidebar 
        navigationItems={adminNavigationItems} 
        user={user ? {
          initials: 'AD',
          name: user.name || 'Admin',
          role: 'System Administrator'
        } : null}
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
