import React from 'react';
import styles from './AttachmentTable.module.css';

// Helper function to format date to local readable format
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

// Helper function to calculate duration in weeks
const calculateWeeks = (startDate, endDate) => {
  if (!startDate || !endDate) return 'N/A';
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''}`;
};

const AttachmentTable = ({ 
  attachments, 
  onActivate, 
  onView, 
  onResend,
  loading = false
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
          {loading ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                Loading attachments...
              </td>
            </tr>
          ) : (
            attachments.map((attachment) => (
              <tr key={attachment.id}>
                <td>
                  <div className={styles.sname}>{attachment.student_name}</div>
                  <div className={styles.sreg}>{attachment.reg_number}</div>
                </td>
                <td>
                  <div className={styles.org}>{attachment.organization_name}</div>
                  <div className={styles.orgSup}>{formatLocalDate(attachment.start_date)} · {formatLocalDate(attachment.end_date)}</div>
                </td>
                <td style={{fontSize: '12px', color: 'var(--muted)'}}>
                  {attachment.industry_supervisor_name}
                </td>
                <td style={{fontSize: '12px', color: 'var(--muted)', whiteSpace: 'nowrap'}}>
                  {calculateWeeks(attachment.start_date, attachment.end_date)}
                </td>
                <td>{getStatusBadge(attachment.status)}</td>
                <td>{getLogsBadge(attachment.logs || 0, attachment.status)}</td>
                <td>{getActionButtons(attachment)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttachmentTable;
