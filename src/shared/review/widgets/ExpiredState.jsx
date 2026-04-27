import React from 'react';
import styles from './ExpiredState.module.css';

const ExpiredState = () => {
  return (
    <div className={styles.endPage}>
      <div className={styles.endIcon} style={{background: 'var(--rbg)', border: '.5px solid var(--rb)'}}>â</div>
      <h1>This link has expired</h1>
      <p>Review links are valid for 7 days. This link has passed its expiry date and can no longer be used.</p>
      <div className={styles.endCard} style={{background: 'var(--w)', border: '.5px solid var(--border)'}}>
        <div style={{fontSize: '10px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--subtle)', marginBottom: '8px'}}>
          Review details
        </div>
        <div className={styles.endRow}>
          <span style={{color: 'var(--muted)'}}>Student</span>
          <span style={{fontWeight: '500'}}>Purity Chelagat Sang</span>
        </div>
        <div className={styles.endRow}>
          <span style={{color: 'var(--muted)'}}>Week</span>
          <span style={{fontWeight: '500'}}>Week 6 â 31 Mar to 4 Apr</span>
        </div>
        <div className={styles.endRow}>
          <span style={{color: 'var(--muted)'}}>Link sent</span>
          <span style={{fontWeight: '500'}}>Fri 4 Apr 2025</span>
        </div>
        <div className={styles.endRow}>
          <span style={{color: 'var(--muted)'}}>Expired</span>
          <span style={{fontWeight: '500'}}>Fri 11 Apr 2025</span>
        </div>
      </div>
      <p>Ask <strong>Purity Sang</strong> or her university supervisor to send a new link.</p>
      <p style={{fontSize: '12px', color: 'var(--subtle)', marginTop: '10px'}}>iams@jkuat.ac.ke</p>
    </div>
  );
};

export default ExpiredState;
