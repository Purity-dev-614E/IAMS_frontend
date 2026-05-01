import React from 'react';
import styles from './DailyLogs.module.css';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';
import { studentNavigation } from '../../../shared/components/AppSidebar/sidebarConfig';
import Weekstoggle from "../widgets/weekstoggle/weekstoggle";
import Button from '../../../shared/components/Button';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import WeeklyLogs from '../widgets/weeklylogswidget/WeeklyLogs';

const DailyLogs = () => {
   const user =  {
    name: 'Student',
    role: 'Student',
    initials: 'ST'
  };
  return (
    <div className={styles.shell}>
      <AppSidebar navigationItems={studentNavigation} user={user} />
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
