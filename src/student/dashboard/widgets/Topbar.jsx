import React from 'react';
import styles from './Topbar.module.css';

const Topbar = () => {
  return (
    <div className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <h1>Good morning, Purity</h1>
        <p>Thursday, 2 April 2025 · Week 6 of your attachment</p>
      </div>
      <div className={styles.topbarRight}>
        <div className={styles.notifBtn}>
          🔔
          <div className={styles.notifDot}></div>
        </div>
        <div className={styles.dateBadge}>Active attachment</div>
      </div>
    </div>
  );
};

export default Topbar;
