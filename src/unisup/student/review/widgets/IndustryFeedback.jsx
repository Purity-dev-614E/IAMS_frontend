import React from 'react';
import styles from './IndustryFeedback.module.css';

const IndustryFeedback = ({ feedback }) => {
  const getStatusPill = (status) => {
    const statusConfig = {
      'Approved': { className: styles.spGreen },
      'Pending': { className: styles.spAmber },
      'Rejected': { className: styles.spRed },
    };

    const config = statusConfig[status] || { className: styles.spGray };
    return <span className={`${styles.statusPill} ${config.className}`}>{status}</span>;
  };

  if (feedback.waiting) {
    return (
      <div className={styles.industrySection}>
        <div className={styles.secTitle}>Industry supervisor feedback</div>
        <div className={styles.fbWaiting}>
          <span className={styles.waitingIcon}>⏳</span>
          <div>
            <div className={styles.waitingTitle}>Waiting for industry feedback</div>
            <div className={styles.waitingDesc}>Industry supervisor has not yet provided feedback for this week</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.industrySection}>
      <div className={styles.secTitle}>Industry supervisor feedback</div>
      <div className={styles.fbBlock} style={{ 
        background: feedback.color === 'amber' ? 'var(--abg)' : 'var(--gbg)', 
        border: `0.5px solid ${feedback.color === 'amber' ? 'var(--ab)' : 'var(--gb)'}` 
      }}>
        <div className={styles.fbWho}>
          <div className={styles.fbAvatar} style={{ 
            background: feedback.color === 'amber' ? 'rgba(146,64,14,.2)' : 'rgba(22,101,52,.2)',
            color: feedback.color === 'amber' ? 'var(--amber)' : 'var(--green)'
          }}>
            {feedback.supervisorInitials}
          </div>
          <div>
            <div className={styles.fbName} style={{ color: feedback.color === 'amber' ? 'var(--amber)' : 'var(--green)' }}>
              {feedback.supervisorName}
            </div>
            <div className={styles.fbRole}>{feedback.supervisorRole}</div>
          </div>
          {getStatusPill(feedback.status)}
        </div>
        <div className={styles.fbLabel} style={{ color: feedback.color === 'amber' ? 'var(--amber)' : 'var(--green)' }}>
          Comments
        </div>
        <div className={styles.fbText} style={{ color: feedback.color === 'amber' ? 'var(--amber)' : 'var(--green)' }}>
          {feedback.comments}
        </div>
        {feedback.improvements && (
          <div className={styles.fbImprovements}>
            <div className={styles.fbImprLabel} style={{ color: feedback.color === 'amber' ? 'var(--amber)' : 'var(--green)' }}>
              Improvements
            </div>
            <div className={styles.fbText} style={{ color: feedback.color === 'amber' ? 'var(--amber)' : 'var(--green)' }}>
              {feedback.improvements}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndustryFeedback;
