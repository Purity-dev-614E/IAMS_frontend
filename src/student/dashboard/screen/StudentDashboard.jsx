import React from 'react';
import styles from './StudentDashboard.module.css';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';
import { studentNavigation } from '../../../shared/components/AppSidebar/sidebarConfig';
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
  const user = {
    name: 'Purity Sang',
    role: 'Student · BBIT',
    initials: 'PS'
  };

  return (
    <div className={styles.shell}>
      {/* SIDEBAR */}
      <AppSidebar navigationItems={studentNavigation} user={user} />
      
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
