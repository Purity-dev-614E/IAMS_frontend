import React from 'react';
import styles from './StatsCards.module.css';

const StatsCards = ({ pending, active, completed, total }) => {
  return (
    <div className={styles.stats}>
      <div className={styles.sc}>
        <div className={styles.scl}>Pending activation</div>
        <div className={styles.scv}>{pending}</div>
        <div className={styles.scs}>awaiting admin review</div>
      </div>
      <div className={styles.sc}>
        <div className={styles.scl}>Active</div>
        <div className={styles.scv}>{active}</div>
        <div className={styles.scs}>currently ongoing</div>
      </div>
      <div className={styles.sc}>
        <div className={styles.scl}>Completed</div>
        <div className={styles.scv}>{completed}</div>
        <div className={styles.scs}>finished this cohort</div>
      </div>
      <div className={styles.sc}>
        <div className={styles.scl}>Total</div>
        <div className={styles.scv}>{total}</div>
        <div className={styles.scs}>this cohort</div>
      </div>
    </div>
  );
};

export default StatsCards;
