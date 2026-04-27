import React from 'react';
import styles from './UniSupTopbar.module.css';

const UniSupTopbar = () => {
  return (
    <div className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <h1>My students</h1>
        <p>Thursday, 3 April 2025 · Week 6 · 8 students assigned</p>
      </div>
      <div className={styles.topbarRight}>
        <button className={`${styles.btnSm} ${styles.btnGhost}`}>↓ Export progress</button>
      </div>
    </div>
  );
};

export default UniSupTopbar;
