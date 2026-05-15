import React from 'react';
import styles from './PendingSupervisorApprovals.module.css';

const PendingSupervisorApprovals = ({ supervisors = [], onApprove, onReject }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Pending supervisor approvals</span>
        <a href="/admin/users?role=uni_supervisor" className={styles.cardAction}>View all</a>
      </div>
      {supervisors.length === 0 ? (
        <div className={styles.emptyState} style={{padding: '2rem', textAlign: 'center', color: 'var(--muted)'}}>
          No supervisors awaiting approval.
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Registered</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {supervisors.map((supervisor, index) => (
              <tr key={supervisor.id || index}>
                <td>
                  <div className={styles.studentName}>{supervisor.name}</div>
                  <div className={styles.studentSub}>{supervisor.role || 'University Supervisor'}</div>
                </td>
                <td style={{fontSize: '12px', color: 'var(--muted)'}}>{supervisor.email}</td>
                <td style={{fontSize: '12px', color: 'var(--muted)'}}>
                  {new Date(supervisor.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </td>
                <td>
                  <div className={styles.actionBtns}>
                    <button 
                      className={`${styles.tblBtn} ${styles.tblBtnApprove}`}
                      onClick={() => onApprove?.(supervisor.id)}
                    >
                      Approve
                    </button>
                    <button 
                      className={`${styles.tblBtn} ${styles.tblBtnDanger}`}
                      onClick={() => onReject?.(supervisor.id)}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingSupervisorApprovals;
