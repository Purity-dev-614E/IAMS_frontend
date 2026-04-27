import React from 'react';
import styles from './SubmissionDonut.module.css';

const SubmissionDonut = () => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>This week's submission status</span>
      </div>
      <div className={styles.donutWrap}>
        <div className={styles.donut}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" fill="none" stroke="#E2E8F0" strokeWidth="12"/>
            <circle cx="50" cy="50" r="38" fill="none" stroke="#1B4FD8" strokeWidth="12" strokeDasharray="143 96" strokeLinecap="round"/>
            <circle cx="50" cy="50" r="38" fill="none" stroke="#FDE68A" strokeWidth="12" strokeDasharray="30 209" strokeDashoffset="-143" strokeLinecap="round"/>
            <circle cx="50" cy="50" r="38" fill="none" stroke="#FECDD3" strokeWidth="12" strokeDasharray="27 212" strokeDashoffset="-173" strokeLinecap="round"/>
          </svg>
          <div className={styles.donutLabel}>
            <div className={styles.donutNum}>71</div>
            <div className={styles.donutSub}>students</div>
          </div>
        </div>
        <div className={styles.donutLegend}>
          <div className={styles.legendRow}>
            <div className={styles.legendLeft}>
              <div className={styles.legendDot} style={{background: '#1B4FD8'}}></div>
              Submitted
            </div>
            <div className={styles.legendVal}>60</div>
          </div>
          <div className={styles.legendRow}>
            <div className={styles.legendLeft}>
              <div className={styles.legendDot} style={{background: '#FDE68A'}}></div>
              Partial
            </div>
            <div className={styles.legendVal}>7</div>
          </div>
          <div className={styles.legendRow}>
            <div className={styles.legendLeft}>
              <div className={styles.legendDot} style={{background: '#FECDD3'}}></div>
              No logs
            </div>
            <div className={styles.legendVal}>4</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDonut;
