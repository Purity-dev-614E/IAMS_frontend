import React from 'react';
import styles from './ReviewsTopbar.module.css';

const ReviewsTopbar = () => {
  return (
    <div className={styles.topbar}>
      <div>
        <div className={styles.topbarTitle}>Weekly Reviews</div>
        <div className={styles.topbarSub}>Supervisor feedback on your weekly activity</div>
      </div>
    </div>
  );
};

export default ReviewsTopbar;
