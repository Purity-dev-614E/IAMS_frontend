import React from 'react';
import styles from './SupervisorCard.module.css';

const SupervisorCard = ({ 
  supervisor, 
  onApprove, 
  onReject,
  isRemoving 
}) => {
  const getWaitingTimeColor = (days) => {
    if (days < 2) return 'var(--muted)';
    if (days <= 4) return 'var(--amber)';
    return 'var(--red)';
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div 
      className={`${styles.pcard} ${isRemoving ? styles.removing : ''}`}
      style={{animationDelay: isRemoving ? '0s' : '0s'}}
    >
      <div className={styles.pcardHeader}>
        <div className={styles.supAvatar}>
          {getInitials(supervisor.name)}
        </div>
        <div className={styles.supInfo}>
          <div className={styles.sname}>{supervisor.name}</div>
          <div className={styles.semail}>{supervisor.email}</div>
          <div className={styles.srole}>
            University Supervisor · {supervisor.department} Dept
          </div>
        </div>
      </div>
      <div className={styles.pcardMeta}>
        <div className={styles.metaRow}>
          <span className={styles.metaKey}>Registered</span>
          <span className={styles.metaVal}>{supervisor.registeredDate}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaKey}>Waiting</span>
          <span 
            className={styles.metaVal} 
            style={{color: getWaitingTimeColor(supervisor.waitingDays), fontWeight: 500}}
          >
            {supervisor.waitingDays} day{supervisor.waitingDays > 1 ? 's' : ''}
          </span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaKey}>Staff ID</span>
          <span className={styles.metaVal}>{supervisor.staffId}</span>
        </div>
      </div>
      <div className={styles.pcardFooter}>
        <button 
          className={styles.btnApprove}
          onClick={() => onApprove(supervisor)}
        >
          ✓ Approve
        </button>
        <button 
          className={styles.btnReject}
          onClick={() => onReject(supervisor)}
        >
          ✕ Reject
        </button>
      </div>
    </div>
  );
};

export default SupervisorCard;
