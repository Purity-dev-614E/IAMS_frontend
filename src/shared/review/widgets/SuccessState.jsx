import React from 'react';
import styles from './SuccessState.module.css';

const SuccessState = () => {
  return (
    <div className={styles.endPage}>
      <div className={styles.endIcon} style={{background: 'var(--gbg)', border: '.5px solid var(--gb)'}}>â</div>
      <h1>Review submitted</h1>
      <p>Thank you, James. Your review for Purity Sang's Week 6 has been recorded and shared with her university supervisor at JKUAT.</p>
      <div className={styles.endCard} style={{background: 'var(--gbg)', border: '.5px solid var(--gb)'}}>
        <div style={{fontSize: '10px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--green)', marginBottom: '8px'}}>
          What you submitted
        </div>
        <div className={styles.endRow} style={{color: 'var(--green)'}}>
          <span>Student</span>
          <span style={{fontWeight: '500'}}>Purity Chelagat Sang</span>
        </div>
        <div className={styles.endRow} style={{color: 'var(--green)'}}>
          <span>Week</span>
          <span style={{fontWeight: '500'}}>Week 6 â 31 Mar to 4 Apr</span>
        </div>
        <div className={styles.endRow} style={{color: 'var(--green)'}}>
          <span>Decision</span>
          <span style={{fontWeight: '500'}}>Approved</span>
        </div>
        <div className={styles.endRow} style={{color: 'var(--green)'}}>
          <span>Submitted</span>
          <span style={{fontWeight: '500'}}>3 Apr 2025, 2:14 PM</span>
        </div>
      </div>
      <p style={{fontSize: '12px', color: 'var(--subtle)'}}>This link has been used and will no longer accept responses. You can close this tab.</p>
    </div>
  );
};

export default SuccessState;
