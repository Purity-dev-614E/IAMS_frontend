import React from 'react';
import styles from './LogCard.module.css';

const LogCard = ({ 
  log,
  onEdit,
  onDelete,
  onSubmit
}) => {
  const getStatusPillClass = (status) => {
    switch (status) {
      case 'submitted': return styles.pillSubmitted;
      case 'draft': return styles.pillDraft;
      case 'reviewed': return styles.pillReviewed;
      default: return styles.pillDraft;
    }
  };

  const canEdit = log.status !== 'submitted';
  const canSubmit = log.status === 'draft';

  return (
    <div className={styles.logCard}>
      <div className={styles.lcHeader}>
        <div className={styles.lcDate}>
          {log.logDate && new Date(log.logDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        <span className={`${styles.statusPill} ${getStatusPillClass(log.status)}`}>
          {log.status}
        </span>
      </div>
      
      <div className={styles.lcBody}>
        <div className={styles.logSection}>
          <h4>Tasks Performed</h4>
          <p>{log.tasksPerformed}</p>
        </div>
        
        <div className={styles.logSection}>
          <h4>Skills Acquired</h4>
          <p>{log.skillsAcquired}</p>
        </div>
        
        <div className={styles.logSection}>
          <h4>Observations</h4>
          <p>{log.observations}</p>
        </div>
      </div>
      
      <div className={styles.lcFooter}>
        <div className={styles.lcMeta}>
          <span className={styles.organizationName}>{log.organizationName}</span>
          {log.submittedAt && (
            <span className={styles.submittedDate}>
              Submitted: {new Date(log.submittedAt).toLocaleDateString()}
            </span>
          )}
        </div>
        
        <div className={styles.lcActions}>
          {canEdit && onEdit && (
            <button 
              className={styles.btnEdit}
              onClick={() => onEdit(log)}
            >
              Edit
            </button>
          )}
          
          {canSubmit && onSubmit && (
            <button 
              className={styles.btnSubmit}
              onClick={() => onSubmit(log.id)}
            >
              Submit
            </button>
          )}
          
          {canEdit && onDelete && (
            <button 
              className={styles.btnDelete}
              onClick={() => onDelete(log.id)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogCard;
