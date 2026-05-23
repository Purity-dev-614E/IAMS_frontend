import React from 'react';
import styles from './StudentsNeedingAttention.module.css';

const NewStudents = ({ students = [], onViewStudent }) => {
  const normalizeStatus = (status, fallback = 'pending') => (
    String(status || fallback).trim().toLowerCase()
  );

  const getStatusPill = (status) => {
    switch (normalizeStatus(status)) {
      case 'active': return styles.pillActive;
      case 'pending': return styles.pillPending;
      case 'inactive': return styles.pillGray;
      case 'completed': return styles.pillActive;
      default: return styles.pillGray;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>New students</span>
        <a href="/admin/students" className={styles.cardAction}>View all students</a>
      </div>
      {students.length === 0 ? (
        <div className={styles.emptyState} style={{padding: '2rem', textAlign: 'center', color: 'var(--muted)'}}>
          No new students registered recently.
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Program</th>
              <th>Registration</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.student_id || student.id || index}>
                <td>
                  <div className={styles.studentName}>{student.student_name || 'Unknown'}</div>
                  <div className={styles.studentSub}>{student.student_email}</div>
                </td>
                <td style={{fontSize: '12px', color: 'var(--muted)'}}>{student.program || 'N/A'}</td>
                <td style={{fontSize: '12px', color: 'var(--muted)'}}>{student.reg_number || 'N/A'}</td>
                <td>
                  <span className={`${styles.statusPill} ${getStatusPill(student.status || 'pending')}`}>
                    {normalizeStatus(student.status || 'pending').replace(/\b\w/g, char => char.toUpperCase())}
                  </span>
                </td>
                <td>
                  <div className={styles.actionBtns}>
                    <button className={`${styles.tblBtn}`} onClick={() => onViewStudent?.(student)}>
                      View profile
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

export default NewStudents;
