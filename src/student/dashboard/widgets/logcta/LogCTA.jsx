import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LogCTA.module.css';

const LogCTA = ({ activeAttachment }) => {
  const getTodayFormatted = () => {
    return new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  if (!activeAttachment || activeAttachment.status !== 'active') {
    return (
      <div className={styles.logCTA}>
        <div className={styles.logCTAText}>
          <h3>No active attachment</h3>
          <p>You need an active attachment to submit daily logs.</p>
        </div>
        <Link to="/student/attachments" className={styles.btnLog}>View attachments</Link>
      </div>
    );
  }

  return (
    <div className={styles.logCTA}>
      <div className={styles.logCTAText}>
        <h3>Log today's activities</h3>
        <p>{getTodayFormatted()} — document your learning today. Takes about 3 minutes.</p>
      </div>
      <Link to="/student/daily-logs/new" className={styles.btnLog}>+ Add today's log</Link>
    </div>
  );
};

export default LogCTA;
