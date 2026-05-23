import React from 'react';
import styles from './DetailDrawer.module.css';

const formatLocalDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const normalizeStatus = (status) => String(status || 'pending').trim().toLowerCase();

const getStatusLabel = (status) => {
  const normalizedStatus = normalizeStatus(status);
  const labels = {
    pending: 'Pending',
    active: 'Active',
    inactive: 'Inactive',
    complete: 'Complete',
    completed: 'Complete'
  };

  return labels[normalizedStatus] || normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
};

const getStatusClass = (status) => {
  switch (normalizeStatus(status)) {
    case 'pending':
      return styles.spAmber;
    case 'active':
      return styles.spGreen;
    case 'complete':
    case 'completed':
      return styles.spBlue;
    case 'inactive':
      return styles.spGray;
    default:
      return styles.spGray;
  }
};

const DetailDrawer = ({
  isOpen,
  onClose,
  attachment,
  onStatusChange,
  onResendEmail
}) => {
  if (!attachment) return null;

  const status = normalizeStatus(attachment.status);
  const canActivate = status === 'pending';
  const canResendEmail = status === 'active';
  const progressPercentage = Math.min(100, Math.round(((attachment.logs || 0) / 40) * 100));

  return (
    <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
      <div className={styles.dh}>
        <span className={styles.dht}>Attachment details</span>
        <button className={styles.dclose} onClick={onClose}>
          x
        </button>
      </div>
      <div className={styles.db}>
        <div className={styles.drow}>
          <div className={styles.di}>
            <div className={styles.dil}>Student</div>
            <div className={styles.div2}>{attachment.student_name}</div>
            <div className={styles.divs}>{attachment.reg_number}</div>
          </div>
          <div className={styles.di}>
            <div className={styles.dil}>Status</div>
            <div>
              <span className={`${styles.sp} ${getStatusClass(status)}`}>
                {getStatusLabel(status)}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.di}>
          <div className={styles.dil}>Organization</div>
          <div className={styles.div2}>{attachment.organization_name}</div>
          <div className={styles.divs}>{attachment.start_date} - {attachment.end_date}</div>
        </div>
        <div className={styles.drow}>
          <div className={styles.di}>
            <div className={styles.dil}>Start date</div>
            <div className={styles.div2}>{formatLocalDate(attachment.start_date)}</div>
          </div>
          <div className={styles.di}>
            <div className={styles.dil}>End date</div>
            <div className={styles.div2}>{formatLocalDate(attachment.end_date)}</div>
          </div>
        </div>
        <div className={styles.di}>
          <div className={styles.dil}>Industry supervisor</div>
          <div className={styles.div2}>{attachment.industry_supervisor_name}</div>
          <div className={styles.divs}>{attachment.industry_supervisor_email}</div>
        </div>
        <div className={styles.di}>
          <div className={styles.dil}>University supervisor</div>
          <div className={styles.div2}>{attachment.supervisor_name}</div>
          <div className={styles.divs}>Assigned {formatLocalDate(attachment.created_at)}</div>
        </div>
        <div className={styles.drow}>
          <div className={styles.di}>
            <div className={styles.dil}>Total logs</div>
            <div className={styles.div2}>{attachment.logs || 0} submitted</div>
          </div>
          <div className={styles.di}>
            <div className={styles.dil}>Progress</div>
            <div className={styles.div2}>{progressPercentage}%</div>
          </div>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <div className={styles.di}>
          <div className={styles.dil}>Last log submitted</div>
          <div className={styles.div2}>{formatLocalDate(attachment.created_at)}</div>
        </div>

        {canActivate && (
          <>
            <div className={styles.dsep}></div>
            <div className={styles.statusChange}>
              <div className={styles.scl2}>Attachment activation</div>
              <div className={styles.statusBtns}>
                <button
                  className={`${styles.sbtn} ${styles.sbtnActivate}`}
                  onClick={() => {
                    onStatusChange(attachment, 'activate');
                    onClose();
                  }}
                >
                  Activate
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      {canResendEmail && (
        <div className={styles.df}>
          <button
            className={styles.resendBtn}
            onClick={() => {
              onResendEmail(attachment);
              onClose();
            }}
          >
            Resend weekly review email to industry supervisor
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailDrawer;
