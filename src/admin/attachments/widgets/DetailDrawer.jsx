import React from 'react';
import styles from './DetailDrawer.module.css';

const DetailDrawer = ({ 
  isOpen, 
  onClose, 
  attachment,
  onStatusChange,
  onResendEmail 
}) => {
  if (!attachment) return null;

  const getAvailableActions = (status) => {
    switch (status) {
      case 'pending':
        return [
          { type: 'activate', label: 'Activate', class: styles.sbtnActivate },
          { type: 'deact', label: 'Deactivate', class: styles.sbtnDeact }
        ];
      case 'active':
        return [
          { type: 'complete', label: 'Complete', class: styles.sbtnComplete },
          { type: 'deact', label: 'Deactivate', class: styles.sbtnDeact }
        ];
      case 'completed':
        return [
          { type: 'activate', label: 'Reactivate', class: styles.sbtnActivate }
        ];
      default:
        return [];
    }
  };

  const availableActions = getAvailableActions(attachment.status);
  const progressPercentage = Math.min(100, Math.round((attachment.logs / 40) * 100));

  return (
    <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
      <div className={styles.dh}>
        <span className={styles.dht}>Attachment details</span>
        <button className={styles.dclose} onClick={onClose}>
          ×
        </button>
      </div>
      <div className={styles.db}>
        <div className={styles.drow}>
          <div className={styles.di}>
            <div className={styles.dil}>Student</div>
            <div className={styles.div2}>{attachment.studentName}</div>
            <div className={styles.divs}>{attachment.regNumber}</div>
          </div>
          <div className={styles.di}>
            <div className={styles.dil}>Status</div>
            <div>
              <span className={`${styles.sp} ${attachment.status === 'pending' ? styles.spAmber : 
                            attachment.status === 'active' ? styles.spGreen : styles.spBlue}`}>
                {attachment.status.charAt(0).toUpperCase() + attachment.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.di}>
          <div className={styles.dil}>Organization</div>
          <div className={styles.div2}>{attachment.organization}</div>
          <div className={styles.divs}>{attachment.orgLocation} · {attachment.orgDept}</div>
        </div>
        <div className={styles.drow}>
          <div className={styles.di}>
            <div className={styles.dil}>Start date</div>
            <div className={styles.div2}>{attachment.startDate}</div>
          </div>
          <div className={styles.di}>
            <div className={styles.dil}>End date</div>
            <div className={styles.div2}>{attachment.endDate}</div>
          </div>
        </div>
        <div className={styles.di}>
          <div className={styles.dil}>Industry supervisor</div>
          <div className={styles.div2}>{attachment.industrySupervisorName}</div>
          <div className={styles.divs}>{attachment.industrySupervisor}</div>
        </div>
        <div className={styles.di}>
          <div className={styles.dil}>University supervisor</div>
          <div className={styles.div2}>{attachment.uniSupervisor}</div>
          <div className={styles.divs}>Assigned {attachment.assignedDate}</div>
        </div>
        <div className={styles.drow}>
          <div className={styles.di}>
            <div className={styles.dil}>Total logs</div>
            <div className={styles.div2}>{attachment.logs} submitted</div>
          </div>
          <div className={styles.di}>
            <div className={styles.dil}>Progress</div>
            <div className={styles.div2}>{progressPercentage}%</div>
          </div>
        </div>
        <div style={{
          height: '5px',
          background: 'var(--surface)',
          borderRadius: '100px',
          border: '0.5px solid var(--border)',
          marginBottom: '16px'
        }}>
          <div style={{
            height: '100%',
            width: `${progressPercentage}%`,
            background: 'var(--blue)',
            borderRadius: '100px'
          }}></div>
        </div>
        <div className={styles.di}>
          <div className={styles.dil}>Last log submitted</div>
          <div className={styles.div2}>{attachment.lastLogDate}</div>
        </div>
        <div className={styles.dsep}></div>
        <div className={styles.statusChange}>
          <div className={styles.scl2}>Change attachment status</div>
          <div className={styles.statusBtns}>
            {availableActions.map((action) => (
              <button
                key={action.type}
                className={`${styles.sbtn} ${action.class}`}
                onClick={() => {
                  onStatusChange(attachment, action.type);
                  onClose();
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.df}>
        <button
          style={{
            width: '100%',
            padding: '9px',
            borderRadius: '8px',
            background: 'var(--abg)',
            border: '0.5px solid rgba(146, 64, 14, 0.2)',
            color: 'var(--amber)',
            fontSize: '12px',
            fontWeight: '500',
            fontFamily: "'DM Sans', sans-serif",
            cursor: pointer
          }}
          onClick={() => {
            onResendEmail(attachment);
            onClose();
          }}
        >
          Resend weekly review email to industry supervisor
        </button>
      </div>
    </div>
  );
};

export default DetailDrawer;
