import React from 'react';
import styles from './StatsGrid.module.css';

const StatsGrid = () => {
  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <div className={styles.statLabel}>Logs submitted</div>
        <div className={styles.statValue}>27</div>
        <div className={styles.statSub}>of 30 working days</div>
        <span className={styles.statPill} style={{background: 'var(--blue-light)', color: 'var(--blue)'}}>90% complete</span>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statLabel}>This week</div>
        <div className={styles.statValue}>4</div>
        <div className={styles.statSub}>of 5 days logged</div>
        <span className={styles.statPill} style={{background: 'var(--amber-bg)', color: 'var(--amber)'}}>Today missing</span>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statLabel}>Reviews complete</div>
        <div className={styles.statValue}>5</div>
        <div className={styles.statSub}>of 6 weeks reviewed</div>
        <span className={styles.statPill} style={{background: 'var(--green-bg)', color: 'var(--green)'}}>Week 6 pending</span>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statLabel}>Attachment ends</div>
        <div className={styles.statValue}>18</div>
        <div className={styles.statSub}>days remaining</div>
        <span className={styles.statPill} style={{background: 'var(--surface)', color: 'var(--muted)', border: '0.5px solid var(--border)'}}>2 May 2025</span>
      </div>
    </div>
  );
};

export default StatsGrid;
