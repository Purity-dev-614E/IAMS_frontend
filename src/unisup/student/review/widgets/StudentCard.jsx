import React from 'react';
import styles from './StudentCard.module.css';

const StudentCard = ({ student = {} }) => {
  // Extract with defaults to prevent "not showing anything" if data is missing
  const {
    initials = '??',
    name = student.studentName || 'Unknown Student',
    registration = student.regNumber || 'N/A',
    program = student.program || 'N/A',
    organization = student.organization || 'Not assigned',
    industrySupervisor = student.industrySupervisor || 'Not assigned',
    period = student.period || 'N/A',
    status = student.status || 'Pending',
    totalLogs = student.totalLogs || 0,
    progress = student.progress || 0
  } = student;

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
    // In a real scenario, this would be derived from student.weeklyProgress
    // For now, we'll keep the hardcoded bars but ensure they render
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
        <div className={styles.scAvatar}>{initials}</div>
        <div className={styles.scName}>{name}</div>
        <div className={styles.scReg}>{registration} · {program}</div>
      </div>
      <div className={styles.scBody}>
        <div className={styles.scRow}>
          <span className={styles.scKey}>Organization</span>
          <span className={styles.scVal}>{organization}</span>
        </div>
        <div className={styles.scRow}>
          <span className={styles.scKey}>Industry sup.</span>
          <span className={styles.scVal}>{industrySupervisor}</span>
        </div>
        <div className={styles.scRow}>
          <span className={styles.scKey}>Period</span>
          <span className={styles.scVal}>{period}</span>
        </div>
        <div className={styles.scRow}>
          <span className={styles.scKey}>Status</span>
          <span className={styles.scVal}>{getStatusPill(status)}</span>
        </div>
        <div className={styles.scRow}>
          <span className={styles.scKey}>Total logs</span>
          <span className={styles.scVal}>{totalLogs} submitted</span>
        </div>
      </div>
      <div className={styles.scProgress}>
        <div className={styles.spLabel}>
          <span>Attachment progress</span>
          <strong>{progress}%</strong>
        </div>
        <div className={styles.spTrack}>
          <div className={styles.spFill} style={{ width: `${progress}%` }}></div>
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
