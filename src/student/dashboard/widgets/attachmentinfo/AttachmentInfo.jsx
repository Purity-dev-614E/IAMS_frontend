import React from 'react';
import styles from './AttachmentInfo.module.css';

const AttachmentInfo = ({ student, attachment }) => {
  const formatDateRange = () => {
    if (!attachment?.startDate || !attachment?.endDate) return 'N/A';
    const start = new Date(attachment.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const end = new Date(attachment.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${start} – ${end}`;
  };

  // Calculate progress
  const calculateProgress = () => {
    if (!attachment?.startDate || !attachment?.endDate) return 0;
    const start = new Date(attachment.startDate);
    const end = new Date(attachment.endDate);
    const today = new Date();
    
    if (today < start) return 0;
    if (today > end) return 100;
    
    const total = end - start;
    const elapsed = today - start;
    return Math.round((elapsed / total) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>My attachment</span>
        <a href="/student/attachments" className={styles.cardAction}>View details</a>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.attachmentInfo}>
          <div className={styles.infoRow}>
            <span className={styles.infoKey}>Organization</span>
            <span className={styles.infoVal}>{attachment?.organizationName || 'Not assigned'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoKey}>Industry supervisor</span>
            <span className={styles.infoVal}>{attachment?.industrySupervisorName || 'Not assigned'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoKey}>University supervisor</span>
            <span className={styles.infoVal}>{student?.supervisorName || 'Not assigned'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoKey}>Period</span>
            <span className={styles.infoVal}>{formatDateRange()}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoKey}>Status</span>
            <span className={`${styles.statusPill} ${attachment?.status === 'active' ? styles.pillVerified : styles.pillPending}`} style={{fontSize: '11px'}}>
              {attachment?.status ? (attachment.status.charAt(0).toUpperCase() + attachment.status.slice(1)) : 'N/A'}
            </span>
          </div>
        </div>
        <div className={styles.attachmentProgress}>
          <div className={styles.progLabel}>
            <span>Attachment progress</span>
            <span>{progress}%</span>
          </div>
          <div className={styles.progTrack}>
            <div className={styles.progFill} style={{width: `${progress}%`}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttachmentInfo;
