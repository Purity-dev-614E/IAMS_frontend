import React from 'react';
import styles from './AdminTopbar.module.css';

const AdminTopbar = () => {
  return (
    <div className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <h1>System Dashboard</h1>
        <p>Thursday, 3 April 2025 · 2025 Cohort</p>
      </div>
      <div className={styles.topbarRight}>
        <button className={`${styles.btnSm} ${styles.btnGhost}`}>↓ Export report</button>
        <button className={`${styles.btnSm} ${styles.btnPrimary}`}>+ Add user</button>
      </div>
    </div>
  );
};

export default AdminTopbar;
