import React from 'react';
import styles from './AttachmentCard.module.css';

const AttachmentCard = ({ 
  organization, 
  department, 
  status, 
  industrySupervisor, 
  industrySupervisorEmail, 
  universitySupervisor, 
  startDate, 
  endDate, 
  duration, 
  currentWeek, 
  progress, 
  activationDate, 
  lastLogDate, 
  submissionDate,
  onViewLogs 
}) => {
  const getStatusPillClass = (status) => {
    switch (status) {
      case 'active': return styles.pillActive;
      case 'pending': return styles.pillPending;
      case 'complete': return styles.pillComplete;
      default: return '';
    }
  };

  return (
    <div className={styles.attachmentCard}>
      <div className={styles.acHeader}>
        <div>
          <div className={styles.acOrg}>{organization}</div>
          <div className={styles.acSub}>{department}</div>
        </div>
        <span className={`${styles.statusPill} ${getStatusPillClass(status)}`}>
          {status}
        </span>
      </div>
      <div className={styles.acBody}>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <div className={styles.infoKey}>Industry supervisor</div>
            <div className={styles.infoVal}>{industrySupervisor}</div>
            {industrySupervisorEmail && (
              <div className={styles.infoValLight} style={{fontSize: '12px', marginTop: '2px'}}>
                {industrySupervisorEmail}
              </div>
            )}
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoKey}>University supervisor</div>
            <div className={styles.infoVal}>{universitySupervisor || 'Not yet assigned'}</div>
            {universitySupervisor && (
              <div className={styles.infoValLight} style={{fontSize: '12px', marginTop: '2px'}}>
                Assigned by admin
              </div>
            )}
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoKey}>Start date</div>
            <div className={styles.infoVal}>{startDate}</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoKey}>End date</div>
            <div className={styles.infoVal}>{endDate}</div>
          </div>
          {duration && (
            <div className={styles.infoItem}>
              <div className={styles.infoKey}>Duration</div>
              <div className={styles.infoVal}>{duration} days</div>
            </div>
          )}
          {currentWeek && (
            <div className={styles.infoItem}>
              <div className={styles.infoKey}>Week</div>
              <div className={styles.infoVal}>{currentWeek}</div>
            </div>
          )}
        </div>
        
        {progress && (
          <div className={styles.progressSection}>
            <div className={styles.progHeader}>
              <span>Attachment progress</span>
              <strong>{progress.percentage}% complete</strong>
            </div>
            <div className={styles.progTrack}>
              <div className={styles.progFill} style={{width: `${progress.percentage}%`}}></div>
            </div>
            <div className={styles.progMarkers}>
              <span>Start</span>
              <span>{progress.currentLabel}</span>
              <span>End</span>
            </div>
          </div>
        )}
      </div>
      <div className={styles.acFooter}>
        <p>
          {status === 'active' && `${activationDate} · ${lastLogDate}`}
          {status === 'pending' && `${submissionDate} · Awaiting admin activation`}
        </p>
        {status === 'active' && onViewLogs && (
          <button className={styles.btnSmOutline} onClick={onViewLogs}>
            View all logs →
          </button>
        )}
      </div>
    </div>
  );
};

export default AttachmentCard;
