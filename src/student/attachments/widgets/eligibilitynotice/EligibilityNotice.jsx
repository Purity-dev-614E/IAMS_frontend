import React from 'react';
import styles from './EligibilityNotice.module.css';

const EligibilityNotice = ({ message, pendingReview, onRequestReview }) => {
  return (
    <div className={styles.notice}>
      <div className={styles.icon}>!</div>
      <div>
        <h2>Attachment registration is not available</h2>
        <p>{message || 'You are not currently eligible to register for attachment.'}</p>
        {pendingReview ? (
          <div className={styles.pending}>Your review request is pending</div>
        ) : (
          <button className={styles.requestBtn} onClick={onRequestReview}>
            Request Eligibility Review
          </button>
        )}
      </div>
    </div>
  );
};

export default EligibilityNotice;
