import React from 'react';
import styles from './AttachmentTopbar.module.css';

const AttachmentTopbar = ({ activeView, onViewChange }) => {
  return (
    <div className={styles.topbar}>
      <div>
        <div className={styles.topbarTitle}>My Attachment</div>
        <div className={styles.topbarSub}>Manage your industrial attachment details</div>
      </div>
      <div className={styles.demoTabs}>
        <button 
          className={`${styles.dtab} ${activeView === 'empty' ? styles.active : ''}`}
          onClick={() => onViewChange('empty')}
        >
          No attachment
        </button>
        <button 
          className={`${styles.dtab} ${activeView === 'pending' ? styles.active : ''}`}
          onClick={() => onViewChange('pending')}
        >
          Pending
        </button>
        <button 
          className={`${styles.dtab} ${activeView === 'active' ? styles.active : ''}`}
          onClick={() => onViewChange('active')}
        >
          Active
        </button>
        <button 
          className={`${styles.dtab} ${activeView === 'register' ? styles.active : ''}`}
          onClick={() => onViewChange('register')}
        >
          Register form
        </button>
      </div>
    </div>
  );
};

export default AttachmentTopbar;
