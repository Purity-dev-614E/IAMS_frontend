import React from 'react';
import styles from './FeedbackSection.module.css';
import StatusPill from './StatusPill';

const FeedbackSection = ({ type, feedback, status }) => {
  const getColors = () => {
    if (type === 'industry') {
      return {
        bg: 'var(--amber-bg)',
        border: 'var(--amber-border)',
        color: 'var(--amber)',
        avatar: 'var(--amber)'
      };
    }
    return {
      bg: 'var(--green-bg)',
      border: 'var(--green-border)',
      color: 'var(--green)',
      avatar: 'var(--green)'
    };
  };

  const colors = getColors();

  if (status === 'awaiting') {
    return (
      <div className={styles.feedbackSection}>
        <div className={styles.fbHeader}>
          <div className={styles.fbWho}>
            <div className={styles.fbAvatar} style={{background: colors.avatar, color: colors.color}}>
              {feedback.initials}
            </div>
            <div>
              <div className={styles.fbName}>{feedback.name}</div>
              <div className={styles.fbRole}>{feedback.role}</div>
            </div>
          </div>
          <StatusPill type="pending">Awaiting feedback</StatusPill>
        </div>
        <div className={styles.fbWaiting} style={{background: 'var(--surface)', border: '0.5px solid var(--border)'}}>
          <span style={{fontSize: '14px'}}>◔</span>
          <span style={{fontSize: '12px', color: 'var(--muted)'}}>
            {feedback.awaitingMessage}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.feedbackSection}>
      <div className={styles.fbHeader}>
        <div className={styles.fbWho}>
          <div className={styles.fbAvatar} style={{background: colors.avatar, color: colors.color}}>
            {feedback.initials}
          </div>
          <div>
            <div className={styles.fbName}>{feedback.name}</div>
            <div className={styles.fbRole}>{feedback.role}</div>
          </div>
        </div>
        <StatusPill type="complete">Reviewed</StatusPill>
      </div>
      <div className={styles.fbBlock} style={{background: colors.bg, border: `0.5px solid ${colors.border}`}}>
        <div className={styles.fbLabel} style={{color: colors.color}}>
          {type === 'industry' ? 'Comments' : 'Academic feedback'}
        </div>
        <div className={styles.fbText} style={{color: colors.color}}>
          {feedback.comments}
        </div>
        {feedback.improvements && (
          <div className={styles.fbImprovements}>
            <div className={styles.fbImprLabel} style={{color: colors.color}}>
              Improvements
            </div>
            <div className={styles.fbText} style={{color: colors.color}}>
              {feedback.improvements}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackSection;
