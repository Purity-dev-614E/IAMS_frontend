import React from 'react';
import styles from './ThisWeekLogs.module.css';

const ThisWeekLogs = ({ logs = [] }) => {
  const getStatusPill = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified': return styles.pillVerified;
      case 'submitted': return styles.pillSubmitted;
      case 'draft': return styles.pillMissing; // Using missing style for draft
      default: return styles.pillUpcoming;
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified': return 'Verified';
      case 'submitted': return 'Submitted';
      case 'draft': return 'Draft';
      default: return 'Pending';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const getDayName = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { weekday: 'short' });
  };

  return (
    <div className={styles.card} style={{marginBottom: '1.25rem'}}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Recent daily logs</span>
        <a href="/student/daily-logs" className={styles.cardAction}>View all logs</a>
      </div>
      <div className={styles.cardBody} style={{padding: '0.5rem 1.25rem'}}>
        {logs.length === 0 ? (
          <div className={styles.emptyState}>No logs submitted recently.</div>
        ) : (
          logs.map((log, index) => (
            <div key={log.id || index} className={styles.logRow}>
              <div className={styles.logDateCol}>
                <div className={styles.logDay}>{getDayName(log.log_date)}</div>
                <div className={styles.logDate}>{formatDate(log.log_date)}</div>
              </div>
              <div className={styles.logTasks}>
                {log.tasks_performed || 'No tasks recorded'}
              </div>
              <span className={`${styles.statusPill} ${getStatusPill(log.status)}`}>
                {getStatusText(log.status)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ThisWeekLogs;
