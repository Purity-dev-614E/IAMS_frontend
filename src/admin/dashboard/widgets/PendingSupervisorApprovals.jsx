import React from 'react';
import styles from './PendingSupervisorApprovals.module.css';

const PendingSupervisorApprovals = () => {
  const supervisors = [
    {
      name: 'Dr. Alice Njoroge',
      role: 'University Supervisor',
      email: 'a.njoroge@jkuat.ac.ke',
      registered: '2 days ago',
      department: 'ETLM'
    },
    {
      name: 'Mr. Samuel Kibet',
      role: 'University Supervisor',
      email: 's.kibet@jkuat.ac.ke',
      registered: '3 days ago',
      department: 'Computing'
    },
    {
      name: 'Dr. Mary Achieng',
      role: 'University Supervisor',
      email: 'm.achieng@jkuat.ac.ke',
      registered: '5 days ago',
      department: 'ETLM'
    }
  ];

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Pending supervisor approvals</span>
        <a href="#" className={styles.cardAction}>View all</a>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Registered</th>
            <th>Department</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {supervisors.map((supervisor, index) => (
            <tr key={index}>
              <td>
                <div className={styles.studentName}>{supervisor.name}</div>
                <div className={styles.studentSub}>{supervisor.role}</div>
              </td>
              <td style={{fontSize: '12px', color: 'var(--muted)'}}>{supervisor.email}</td>
              <td style={{fontSize: '12px', color: 'var(--muted)'}}>{supervisor.registered}</td>
              <td style={{fontSize: '12px', color: 'var(--muted)'}}>{supervisor.department}</td>
              <td>
                <div className={styles.actionBtns}>
                  <button className={`${styles.tblBtn} ${styles.tblBtnApprove}`}>Approve</button>
                  <button className={`${styles.tblBtn} ${styles.tblBtnDanger}`}>Reject</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingSupervisorApprovals;
