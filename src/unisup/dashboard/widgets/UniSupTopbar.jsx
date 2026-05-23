import React from 'react';
import { Download } from 'lucide-react';
import styles from './UniSupTopbar.module.css';

const UniSupTopbar = ({ user }) => {
  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const name = user?.name || user?.userName || 'Supervisor';

  return (
    <div className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <h1>Welcome back, {name}</h1>
        <p>{getFormattedDate()} - University Supervisor</p>
      </div>
      <div className={styles.topbarRight}>
        <button className={`${styles.btnSm} ${styles.btnGhost}`}>
          <Download size={14} />
          Export student data
        </button>
      </div>
    </div>
  );
};

export default UniSupTopbar;
