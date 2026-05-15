import React from 'react';
import styles from './AlertBanner.module.css';

const AlertBanner = ({ statistics }) => {
  const lastLogDate = statistics?.dailyLogs?.lastLogDate;
  
  const isLogDueToday = () => {
    if (!lastLogDate) return true;
    const today = new Date().toDateString();
    const last = new Date(lastLogDate).toDateString();
    return today !== last;
  };

  if (!isLogDueToday()) return null;

  return (
    <div className={styles.alertBanner}>
      <span className={styles.alertBannerIcon}>⚠</span>
      <p><strong>You haven't logged today yet.</strong> Submit your daily log before end of day to keep your week complete.</p>
      <a href="/student/daily-logs/new" className={styles.alertLink}>Log now →</a>
    </div>
  );
};

export default AlertBanner;
