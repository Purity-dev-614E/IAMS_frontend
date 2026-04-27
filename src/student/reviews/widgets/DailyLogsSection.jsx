import React from 'react';
import styles from './DailyLogsSection.module.css';
import StatusPill from './StatusPill';

const DailyLogsSection = ({ logs }) => {
  return (
    <div className={styles.logsSection}>
      <div className={styles.sectionTitle}>Daily logs this week</div>
      {logs.map((log, index) => (
        <div key={index} className={styles.logDay}>
          <div className={styles.ldDate}>
            <div className={styles.ldDayName}>{log.day}</div>
            <div className={styles.ldDateStr}>{log.date}</div>
          </div>
          <div className={styles.ldContent}>
            {log.missing ? (
              <div className={styles.ldMissing}>{log.text}</div>
            ) : (
              <div className={styles.ldText}>{log.text}</div>
            )}
          </div>
          <StatusPill 
            type={log.status} 
            style={{flexShrink: 0}}
          >
            {log.statusText}
          </StatusPill>
        </div>
      ))}
    </div>
  );
};

export default DailyLogsSection;
