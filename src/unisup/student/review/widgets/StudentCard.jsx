import React from 'react';
import styles from './StudentCard.module.css';

const StudentCard = ({ student }) => {
  const getStatusPill = (status) => {
    const statusConfig = {
      'Active': { className: styles.spGreen },
      'Pending': { className: styles.spAmber },
      'Completed': { className: styles.spBlue },
    };

    const config = statusConfig[status] || { className: styles.spGray };
    return <span className={`${styles.statusPill} ${config.className}`}>{status}</span>;
  };

  const getWeeklyProgress = () => {
    const weeks = [
      { week: 'W1', height: '100%', color: 'var(--green)' },
      { week: 'W2', height: '100%', color: 'var(--green)' },
      { week: 'W3', height: '100%', color: 'var(--green)' },
      { week: 'W4', height: '100%', color: 'var(--green)' },
      { week: 'W5', height: '80%', color: 'var(--green)' },
      { week: 'W6', height: '60%', color: 'var(--amber)' },
    ];

    return weeks;
  };

  return (
    <div className={styles.studentCard}>
      <div className={styles.scHeader}>
        <div className={styles.scAvatar}>{student.initials}</div>
        <div className={styles.scName}>{student.name}</div>
        <div className={styles.scReg}>{student.registration} · {student.program}</div>
      </div>
      <div className={styles.scBody}>
        <div className={styles.scRow}>
          <span className={styles.scKey}>Organization</span>
          <span className={styles.scVal}>{student.organization}</span>
        </div>
        <div className={styles.scRow}>
          <span className={styles.scKey}>Industry sup.</span>
          <span className={styles.scVal}>{student.industrySupervisor}</span>
        </div>
        <div className={styles.scRow}>
          <span className={styles.scKey}>Period</span>
          <span className={styles.scVal}>{student.period}</span>
        </div>
        <div className={styles.scRow}>
          <span className={styles.scKey}>Status</span>
          <span className={styles.scVal}>{getStatusPill(student.status)}</span>
        </div>
        <div className={styles.scRow}>
          <span className={styles.scKey}>Total logs</span>
          <span className={styles.scVal}>{student.totalLogs} submitted</span>
        </div>
      </div>
      <div className={styles.scProgress}>
        <div className={styles.spLabel}>
          <span>Attachment progress</span>
          <strong>{student.progress}%</strong>
        </div>
        <div className={styles.spTrack}>
          <div className={styles.spFill} style={{ width: `${student.progress}%` }}></div>
        </div>
      </div>
      <div className={styles.scChart}>
        <div className={styles.scChartLabel}>Weekly log submission rate</div>
        <div className={styles.chartBars}>
          {getWeeklyProgress().map((week, index) => (
            <div
              key={index}
              className={styles.bar}
              style={{
                background: week.color,
                height: week.height,
              }}
            />
          ))}
        </div>
        <div className={styles.chartWeeks}>
          {getWeeklyProgress().map((week, index) => (
            <div key={index} className={styles.cw}>{week.week}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
