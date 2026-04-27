import React from 'react';
import styles from './AlertBanner.module.css';

const AlertBanner = () => {
  return (
    <div className={styles.alertBanner}>
      <span className={styles.alertBannerIcon}>⚠</span>
      <p><strong>You haven't logged today yet.</strong> Submit your daily log before end of day to keep your week complete.</p>
      <a href="#" className={styles.alertLink}>Log now →</a>
    </div>
  );
};

export default AlertBanner;
