import React from 'react';
import styles from './UrgencyBanner.module.css';

const UrgencyBanner = ({ pendingCount }) => {
  if (pendingCount === 0) return null;

  return (
    <div className={styles.urgencyBanner}>
      <div className={styles.ubIcon}>⚠</div>
      <div className={styles.ubText}>
        <p>
          <strong>{pendingCount} university supervisor{pendingCount > 1 ? 's are' : ' is'} blocked.</strong> They registered and are waiting to access the system. Approve or reject each one below — they receive an email notification either way.
        </p>
      </div>
    </div>
  );
};

export default UrgencyBanner;
