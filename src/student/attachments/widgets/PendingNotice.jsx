import React from 'react';
import styles from './PendingNotice.module.css';

const PendingNotice = () => {
  return (
    <div className={styles.pendingCard}>
      <span style={{fontSize: '16px'}}>◔</span>
      <p><strong>Your attachment is pending admin activation.</strong> Your details have been submitted and are waiting for review. You will receive a notification once it is activated and you can begin submitting daily logs.</p>
    </div>
  );
};

export default PendingNotice;
