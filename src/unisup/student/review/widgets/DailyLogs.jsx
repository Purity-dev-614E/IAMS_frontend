import React from 'react';
import styles from './DailyLogs.module.css';

const DailyLogs = ({ logs }) => {
  const getStatusPill = (status) => {
    const statusConfig = {
      'Submitted': { className: styles.spBlue },
      'Verified': { className: styles.spGreen },
      'Missing': { className: styles.spGray },
    };

    const config = statusConfig[status] || { className: styles.spGray };
    return <span className={`${styles.statusPill} ${config.className}`}>{status}</span>;
  };

  return (
    <div className={styles.logsSection}>
      <div className={styles.secTitle}>Daily logs this week</div>
      {logs.map((log, index) => (
        <div key={index} className={styles.logEntry}>
          <div className={styles.leDate}>
            <div className={styles.leDay}>{log.day}</div>
            <div className={styles.leDatestr}>{log.date}</div>
          </div>
          <div className={styles.leContent}>
            {log.missing ? (
              <div className={styles.leMissing}>{log.missing}</div>
            ) : (
              <>
                {log.tasks && (
                  <div className={styles.leField}>
                    <div className={styles.leFl}>Tasks</div>
                    <div className={styles.leFt}>{log.tasks}</div>
                  </div>
                )}
                {log.skills && (
                  <div className={styles.leField}>
                    <div className={styles.leFl}>Skills</div>
                    <div className={styles.leFt}>{log.skills}</div>
                  </div>
                )}
              </>
            )}
          </div>
          {getStatusPill(log.status)}
        </div>
      ))}
    </div>
  );
};

export default DailyLogs;
