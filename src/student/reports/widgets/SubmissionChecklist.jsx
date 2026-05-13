import React from 'react';
import styles from './SubmissionChecklist.module.css';

const SubmissionChecklist = ({ items }) => {
  const getCheckIcon = (status) => {
    switch (status) {
      case 'done':
        return '✓';
      case 'pending':
        return '◎';
      case 'locked':
        return '○';
      default:
        return '○';
    }
  };

  const getCheckClass = (status) => {
    switch (status) {
      case 'done':
        return `${styles.clCheck} ${styles.done}`;
      case 'pending':
        return `${styles.clCheck} ${styles.pending}`;
      case 'locked':
        return `${styles.clCheck} ${styles.locked}`;
      default:
        return styles.clCheck;
    }
  };

  const getLabelClass = (status) => {
    return status === 'locked' ? `${styles.clLabel} ${styles.lockedLabel}` : styles.clLabel;
  };

  return (
    <div className={styles.checklist}>
      <div className={styles.clHeader}>
        <div className={styles.clTitle}>Submission requirements</div>
        <div className={styles.clSub}>All items must be complete before you can submit</div>
      </div>
      <div className={styles.clItems}>
        {items.map((item) => (
          <div key={item.id} className={styles.clItem}>
            <div className={getCheckClass(item.status)}>
              {getCheckIcon(item.status)}
            </div>
            <div className={getLabelClass(item.status)}>
              {item.label}
            </div>
            <div className={styles.clMeta}>{item.meta}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmissionChecklist;
