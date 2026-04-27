import React from 'react';
import styles from './AttachmentInfo.module.css';

const AttachmentInfo = () => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>My attachment</span>
        <a href="#" className={styles.cardAction}>View details</a>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.attachmentInfo}>
          <div className={styles.infoRow}>
            <span className={styles.infoKey}>Organization</span>
            <span className={styles.infoVal}>Safaricom PLC</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoKey}>Industry supervisor</span>
            <span className={styles.infoVal}>James Mwangi</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoKey}>University supervisor</span>
            <span className={styles.infoVal}>Dr. F. Kamau</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoKey}>Period</span>
            <span className={styles.infoVal}>17 Feb – 2 May 2025</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoKey}>Status</span>
            <span className={`${styles.statusPill} ${styles.pillVerified}`} style={{fontSize: '11px'}}>Active</span>
          </div>
        </div>
        <div className={styles.attachmentProgress}>
          <div className={styles.progLabel}>
            <span>Attachment progress</span>
            <span>74%</span>
          </div>
          <div className={styles.progTrack}>
            <div className={styles.progFill} style={{width: '74%'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttachmentInfo;
