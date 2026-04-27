import React from 'react';
import styles from './PendingBanner.module.css';

const PendingBanner = () => {
  return (
    <div className={styles.pendingBanner}>
      <div className={styles.pendingBannerIcon}>⚠</div>
      <p><strong>3 university supervisors</strong> are pending approval and cannot access the system. Review and approve their accounts to unblock them.</p>
      <span className={styles.bannerAction}>Review now →</span>
    </div>
  );
};

export default PendingBanner;
