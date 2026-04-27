import React from 'react';
import styles from './UsedState.module.css';

const UsedState = () => {
  return (
    <div className={styles.endPage}>
      <div className={styles.endIcon} style={{background: 'var(--bl)', border: '.5px solid rgba(27,79,216,.2)'}}>â</div>
      <h1>Already submitted</h1>
      <p>You have already submitted your review for Purity Sang's Week 6. No further action needed.</p>
      <div className={styles.endCard} style={{background: 'var(--bl)', border: '.5px solid rgba(27,79,216,.2)'}}>
        <div style={{fontSize: '10px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--blue)', marginBottom: '8px'}}>
          Your submission
        </div>
        <div className={styles.endRow} style={{color: 'var(--blue)'}}>
          <span>Decision</span>
          <span style={{fontWeight: '500'}}>Approved</span>
        </div>
        <div className={styles.endRow} style={{color: 'var(--blue)'}}>
          <span>Submitted</span>
          <span style={{fontWeight: '500'}}>Tuesday 1 Apr 2025</span>
        </div>
      </div>
      <p style={{fontSize: '12px', color: 'var(--subtle)'}}>Questions? iams@jkuat.ac.ke</p>
    </div>
  );
};

export default UsedState;
