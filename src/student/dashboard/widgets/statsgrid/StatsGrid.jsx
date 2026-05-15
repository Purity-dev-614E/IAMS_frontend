import React from 'react';
import styles from './StatsGrid.module.css';

const StatsGrid = ({ statistics, activeAttachment }) => {
  const dailyLogs = statistics?.dailyLogs || { total: 0, submitted: 0, draft: 0 };
  const weeklyReviews = statistics?.weeklyReviews || { total: 0, complete: 0, pending: 0 };
  
  // Calculate log completion percentage
  const logPercentage = dailyLogs.total > 0 
    ? Math.round((dailyLogs.submitted / dailyLogs.total) * 100) 
    : 0;

  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!activeAttachment?.endDate) return 'N/A';
    const end = new Date(activeAttachment.endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining();
  const endDateFormatted = activeAttachment?.endDate 
    ? new Date(activeAttachment.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'N/A';

  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <div className={styles.statLabel}>Logs submitted</div>
        <div className={styles.statValue}>{dailyLogs.submitted}</div>
        <div className={styles.statSub}>of {dailyLogs.total || '--'} working days</div>
        <span className={styles.statPill} style={{background: 'var(--blue-light)', color: 'var(--blue)'}}>
          {logPercentage}% complete
        </span>
      </div>
      
      <div className={styles.statCard}>
        <div className={styles.statLabel}>Draft logs</div>
        <div className={styles.statValue}>{dailyLogs.draft}</div>
        <div className={styles.statSub}>require submission</div>
        <span className={styles.statPill} style={{
          background: dailyLogs.draft > 0 ? 'var(--amber-bg)' : 'var(--surface)', 
          color: dailyLogs.draft > 0 ? 'var(--amber)' : 'var(--muted)'
        }}>
          {dailyLogs.draft > 0 ? 'Action needed' : 'All clear'}
        </span>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statLabel}>Reviews complete</div>
        <div className={styles.statValue}>{weeklyReviews.complete}</div>
        <div className={styles.statSub}>of {weeklyReviews.total || '--'} weeks reviewed</div>
        <span className={styles.statPill} style={{
          background: weeklyReviews.pending > 0 ? 'var(--amber-bg)' : 'var(--green-bg)', 
          color: weeklyReviews.pending > 0 ? 'var(--amber)' : 'var(--green)'
        }}>
          {weeklyReviews.pending > 0 ? `${weeklyReviews.pending} pending` : 'Up to date'}
        </span>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statLabel}>Attachment ends</div>
        <div className={styles.statValue}>{daysRemaining}</div>
        <div className={styles.statSub}>days remaining</div>
        <span className={styles.statPill} style={{background: 'var(--surface)', color: 'var(--muted)', border: '0.5px solid var(--border)'}}>
          {endDateFormatted}
        </span>
      </div>
    </div>
  );
};

export default StatsGrid;
