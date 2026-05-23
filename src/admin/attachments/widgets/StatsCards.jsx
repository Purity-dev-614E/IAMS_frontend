import React from 'react';
import styles from './StatsCards.module.css';

const StatsCards = ({ pending, active, completed, inactive, total }) => {
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
        <div className={styles.scl}>Complete</div>
        <div className={styles.scv}>{completed}</div>
        <div className={styles.scs}>finished this cohort</div>
      </div>
      <div className={styles.sc}>
        <div className={styles.scl}>Inactive</div>
        <div className={styles.scv}>{inactive}</div>
        <div className={styles.scs}>deactivated automatically</div>
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
