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
  const normalizedStatus = String(status || 'pending').trim().toLowerCase();

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Active',
      pending: 'Pending',
      complete: 'Complete',
      completed: 'Complete',
      inactive: 'Inactive'
    };

    return labels[status] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusPillClass = (status) => {
    switch (status) {
      case 'active': return styles.pillActive;
      case 'pending': return styles.pillPending;
      case 'complete':
      case 'completed':
        return styles.pillComplete;
      case 'inactive': return styles.pillInactive;
      default: return '';
    }
  };

  const getFooterText = () => {
    switch (normalizedStatus) {
      case 'active':
        return `${activationDate} - ${lastLogDate}`;
      case 'pending':
        return `${submissionDate} - Awaiting admin activation`;
      case 'complete':
      case 'completed':
        return 'Attachment complete';
      case 'inactive':
        return 'Attachment inactive';
      default:
        return '';
    }
  };

  return (
    <div className={styles.attachmentCard}>
      <div className={styles.acHeader}>
        <div>
          <div className={styles.acOrg}>{organization}</div>
          <div className={styles.acSub}>{department}</div>
        </div>
        <span className={`${styles.statusPill} ${getStatusPillClass(normalizedStatus)}`}>
          {getStatusLabel(normalizedStatus)}
        </span>
      </div>
      <div className={styles.acBody}>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <div className={styles.infoKey}>Industry supervisor</div>
            <div className={styles.infoVal}>{industrySupervisor}</div>
            {industrySupervisorEmail && (
              <div className={styles.infoValLight} style={{ fontSize: '12px', marginTop: '2px' }}>
                {industrySupervisorEmail}
              </div>
            )}
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoKey}>University supervisor</div>
            <div className={styles.infoVal}>{universitySupervisor || 'Not yet assigned'}</div>
            {universitySupervisor && (
              <div className={styles.infoValLight} style={{ fontSize: '12px', marginTop: '2px' }}>
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
              <div className={styles.progFill} style={{ width: `${progress.percentage}%` }}></div>
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
        <p>{getFooterText()}</p>
        {normalizedStatus === 'active' && onViewLogs && (
          <button className={styles.btnSmOutline} onClick={onViewLogs}>
            View all logs
          </button>
        )}
      </div>
    </div>
  );
};

export default AttachmentCard;
