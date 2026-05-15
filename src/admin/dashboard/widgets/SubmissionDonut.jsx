import React from 'react';
import styles from './SubmissionDonut.module.css';

const SubmissionDonut = ({ systemStats }) => {
  const total = systemStats?.active_attachments || 0;
  const submitted = systemStats?.submitted_daily_logs || 0;
  const draft = systemStats?.draft_daily_logs || 0;
  
  // Calculate relative portions for the donut (using simple proportions for visualization)
  const submittedPercent = total > 0 ? Math.min((submitted / (submitted + draft || 1)) * 100, 100) : 0;
  const draftPercent = 100 - submittedPercent;
  
  // Dash array calculations for 238 circumference (2 * pi * 38)
  const circumference = 238;
  const submittedDash = (submittedPercent / 100) * circumference;
  const draftDash = (draftPercent / 100) * circumference;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Daily log status</span>
      </div>
      <div className={styles.donutWrap}>
        <div className={styles.donut}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" fill="none" stroke="#E2E8F0" strokeWidth="12"/>
            {total > 0 && (
              <>
                <circle 
                  cx="50" cy="50" r="38" fill="none" stroke="#1B4FD8" strokeWidth="12" 
                  strokeDasharray={`${submittedDash} ${circumference - submittedDash}`} 
                  strokeLinecap="round"
                />
                <circle 
                  cx="50" cy="50" r="38" fill="none" stroke="#FDE68A" strokeWidth="12" 
                  strokeDasharray={`${draftDash} ${circumference - draftDash}`} 
                  strokeDashoffset={-submittedDash} 
                  strokeLinecap="round"
                />
              </>
            )}
          </svg>
          <div className={styles.donutLabel}>
            <div className={styles.donutNum}>{total}</div>
            <div className={styles.donutSub}>active</div>
          </div>
        </div>
        <div className={styles.donutLegend}>
          <div className={styles.legendRow}>
            <div className={styles.legendLeft}>
              <div className={styles.legendDot} style={{background: '#1B4FD8'}}></div>
              Submitted
            </div>
            <div className={styles.legendVal}>{submitted}</div>
          </div>
          <div className={styles.legendRow}>
            <div className={styles.legendLeft}>
              <div className={styles.legendDot} style={{background: '#FDE68A'}}></div>
              Drafts
            </div>
            <div className={styles.legendVal}>{draft}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDonut;
