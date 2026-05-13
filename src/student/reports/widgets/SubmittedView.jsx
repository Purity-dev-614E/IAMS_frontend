import React from 'react';
import styles from './SubmittedView.module.css';

const SubmittedView = ({ submittedData }) => {
  return (
    <>
      <div className={styles.svBanner}>
        <span style={{ fontSize: '16px' }}>✓</span>
        <p>
          <strong>Your final report has been submitted.</strong> Dr. F. Kamau and admin team have been notified. You will receive feedback once it has been reviewed.
        </p>
      </div>
      
      <div className={styles.submittedCard}>
        <div className={styles.scHeader}>
          <span className={styles.scTitle}>Submitted report</span>
          <span className={`${styles.sp} ${styles.spGreen}`}>Submitted</span>
        </div>
        
        <div className={styles.scBody}>
          <div className={styles.srRow}>
            <div className={styles.srLabel}>Report title</div>
            <div className={styles.srVal}>{submittedData.reportTitle}</div>
          </div>
          
          <div className={styles.scDivider}></div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className={styles.srRow}>
              <div className={styles.srLabel}>Organization</div>
              <div className={styles.srVal}>{submittedData.organization}</div>
            </div>
            <div className={styles.srRow}>
              <div className={styles.srLabel}>Department</div>
              <div className={styles.srVal}>{submittedData.department}</div>
            </div>
            <div className={styles.srRow}>
              <div className={styles.srLabel}>Period</div>
              <div className={styles.srVal}>{submittedData.startDate} – {submittedData.endDate}</div>
            </div>
            <div className={styles.srRow}>
              <div className={styles.srLabel}>Submitted</div>
              <div className={styles.srVal}>{submittedData.submittedDate}</div>
            </div>
          </div>
          
          <div className={styles.scDivider}></div>
          
          <div className={styles.srRow}>
            <div className={styles.srLabel}>Uploaded document</div>
            <div 
              className={styles.srVal} 
              style={{ color: 'var(--blue)', cursor: 'pointer' }}
            >
              📄 {submittedData.fileName}
            </div>
          </div>
          
          <div className={styles.scDivider}></div>
          
          <div className={styles.srRow}>
            <div className={styles.srLabel}>Review status</div>
            <div>
              <span className={`${styles.sp} ${styles.spAmber}`}>
                Awaiting review from Dr. F. Kamau
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubmittedView;
