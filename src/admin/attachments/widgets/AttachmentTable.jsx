import React from 'react';
import styles from './AttachmentTable.module.css';

const AttachmentTable = ({ 
  attachments, 
  onActivate, 
  onView, 
  onResend 
}) => {
  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: styles.spAmber,
      active: styles.spGreen,
      completed: styles.spBlue
    };
    return (
      <span className={`${styles.sp} ${statusClasses[status] || styles.spGray}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getLogsBadge = (logs, status) => {
    if (status === 'pending') {
      return <span style={{color: 'var(--subtle)'}}>â</span>;
    }
    if (logs === 0) {
      return <span className={`${styles.sp} ${styles.spGray}`}>0 logs</span>;
    }
    if (logs >= 20) {
      return <span className={`${styles.sp} ${styles.spBlue}`}>{logs} logs</span>;
    }
    return <span className={`${styles.sp} ${styles.spAmber}`}>{logs} logs</span>;
  };

  const getActionButtons = (attachment) => {
    if (attachment.status === 'pending') {
      return (
        <div className={styles.acts}>
          <button 
            className={`${styles.abtn} ${styles.abtnActivate}`}
            onClick={() => onActivate(attachment)}
          >
            Activate
          </button>
          <button 
            className={`${styles.abtn} ${styles.abtnView}`}
            onClick={() => onView(attachment)}
          >
            View
          </button>
        </div>
      );
    }
    
    if (attachment.status === 'active') {
      return (
        <div className={styles.acts}>
          <button 
            className={`${styles.abtn} ${styles.abtnResend}`}
            onClick={() => onResend(attachment)}
          >
            Resend email
          </button>
          <button 
            className={`${styles.abtn} ${styles.abtnView}`}
            onClick={() => onView(attachment)}
          >
            View
          </button>
        </div>
      );
    }
    
    // completed
    return (
      <div className={styles.acts}>
        <button 
          className={`${styles.abtn} ${styles.abtnView}`}
          onClick={() => onView(attachment)}
        >
          View
        </button>
      </div>
    );
  };

  return (
    <div className={styles.card}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Student</th>
            <th>Organization</th>
            <th>Industry supervisor</th>
            <th>Period</th>
            <th>Status</th>
            <th>Logs</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {attachments.map((attachment) => (
            <tr key={attachment.id}>
              <td>
                <div className={styles.sname}>{attachment.studentName}</div>
                <div className={styles.sreg}>{attachment.regNumber}</div>
              </td>
              <td>
                <div className={styles.org}>{attachment.organization}</div>
                <div className={styles.orgSup}>{attachment.orgLocation} · {attachment.orgDept}</div>
              </td>
              <td style={{fontSize: '12px', color: 'var(--muted)'}}>
                {attachment.industrySupervisor}
              </td>
              <td style={{fontSize: '12px', color: 'var(--muted)', whiteSpace: 'nowrap'}}>
                {attachment.period}
              </td>
              <td>{getStatusBadge(attachment.status)}</td>
              <td>{getLogsBadge(attachment.logs, attachment.status)}</td>
              <td>{getActionButtons(attachment)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttachmentTable;
