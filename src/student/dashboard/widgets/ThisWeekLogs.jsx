import React from 'react';
import styles from './ThisWeekLogs.module.css';

const ThisWeekLogs = () => {
  const logs = [
    { day: 'Mon', date: '31 Mar', tasks: 'Attended morning stand-up, reviewed codebase documentation, set up local dev environment', status: 'verified' },
    { day: 'Tue', date: '1 Apr', tasks: 'Implemented user authentication module, fixed session timeout bug', status: 'submitted' },
    { day: 'Wed', date: '2 Apr', tasks: 'Wrote unit tests for API endpoints, attended code review session', status: 'submitted' },
    { day: 'Thu', date: '3 Apr', tasks: '—', status: 'missing' },
    { day: 'Fri', date: '4 Apr', tasks: '—', status: 'upcoming' }
  ];

  const getStatusPill = (status) => {
    switch (status) {
      case 'verified': return styles.pillVerified;
      case 'submitted': return styles.pillSubmitted;
      case 'missing': return styles.pillMissing;
      case 'upcoming': return styles.pillUpcoming;
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'verified': return 'Verified';
      case 'submitted': return 'Submitted';
      case 'missing': return 'Not logged';
      case 'upcoming': return 'Upcoming';
      default: return '';
    }
  };

  return (
    <div className={styles.card} style={{marginBottom: '1.25rem'}}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>This week's logs — Week 6</span>
        <a href="#" className={styles.cardAction}>View all logs</a>
      </div>
      <div className={styles.cardBody} style={{padding: '0.5rem 1.25rem'}}>
        {logs.map((log, index) => (
          <div key={index} className={styles.logRow}>
            <div className={styles.logDateCol}>
              <div className={styles.logDay}>{log.day}</div>
              <div className={styles.logDate}>{log.date}</div>
            </div>
            <div className={styles.logTasks}>{log.tasks}</div>
            <span className={`${styles.statusPill} ${getStatusPill(log.status)}`}>
              {getStatusText(log.status)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThisWeekLogs;
