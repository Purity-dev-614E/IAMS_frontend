import React from 'react';
import styles from './StudentsNeedingAttention.module.css';

const StudentsNeedingAttention = () => {
  const students = [
    {
      name: 'Brian Otieno',
      sub: 'HDB212-0112/2022',
      supervisor: 'Unassigned',
      weeklyProgress: '0 of 3 logs',
      attachmentStatus: 'Active',
      issue: 'No supervisor assigned',
      action: 'Assign'
    },
    {
      name: 'Grace Wanjiru',
      sub: 'HDB212-0204/2022',
      supervisor: 'Dr. Omondi',
      weeklyProgress: '1 of 3 logs',
      attachmentStatus: 'Active',
      issue: 'Flagged by supervisor',
      action: 'View'
    },
    {
      name: 'Kevin Mutua',
      sub: 'HDB212-0089/2022',
      supervisor: 'Dr. Kamau',
      weeklyProgress: '0 of 3 logs',
      attachmentStatus: 'Pending',
      issue: 'Attachment not activated',
      action: 'Activate'
    },
    {
      name: 'Amina Hassan',
      sub: 'HDB212-0317/2022',
      supervisor: 'Dr. Waweru',
      weeklyProgress: '3 of 3 logs',
      attachmentStatus: 'Active',
      issue: 'Industry review overdue',
      action: 'Resend email'
    }
  ];

  const getStatusPill = (status) => {
    switch (status) {
      case 'Active': return styles.pillActive;
      case 'Pending': return styles.pillPending;
      case 'Not started': return styles.pillGray;
      default: return '';
    }
  };

  const getActionButton = (action) => {
    switch (action) {
      case 'Assign': return { text: 'Assign', class: styles.tblBtnApprove };
      case 'Activate': return { text: 'Activate', class: styles.tblBtnApprove };
      case 'View': return { text: 'View', class: '' };
      case 'Resend email': return { text: 'Resend email', class: '' };
      default: return { text: action, class: '' };
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Students needing attention</span>
        <a href="#" className={styles.cardAction}>View all students</a>
      </div>
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Supervisor</th>
            <th>This week</th>
            <th>Attachment</th>
            <th>Issue</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>
                <div className={styles.studentName}>{student.name}</div>
                <div className={styles.studentSub}>{student.sub}</div>
              </td>
              <td style={{fontSize: '12px', color: 'var(--muted)'}}>{student.supervisor}</td>
              <td>
                <span className={`${styles.statusPill} ${styles.pillMissing}`}>
                  {student.weeklyProgress}
                </span>
              </td>
              <td>
                <span className={`${styles.statusPill} ${getStatusPill(student.attachmentStatus)}`}>
                  {student.attachmentStatus}
                </span>
              </td>
              <td style={{fontSize: '12px', color: student.issue === 'No supervisor assigned' ? 'var(--red)' : 'var(--amber)', fontWeight: '500'}}>
                {student.issue}
              </td>
              <td>
                <div className={styles.actionBtns}>
                  <button className={`${styles.tblBtn} ${getActionButton(student.action).class}`}>
                    {getActionButton(student.action).text}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsNeedingAttention;
