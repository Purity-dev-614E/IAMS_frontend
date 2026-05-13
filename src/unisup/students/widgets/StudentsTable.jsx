import React from 'react';
import { useNavigate } from 'react-router-dom';
import WeekDots from './WeekDots';
import styles from './StudentsTable.module.css';

const StudentsTable = ({ students, onFlagToggle }) => {
  const navigate = useNavigate();

  const handleViewReviews = (studentId) => {
    navigate(`/supervisor/students/${studentId}/reviews`);
  };

  const getStatusPill = (status) => {
    const statusConfig = {
      'Needs my feedback': { className: styles.spAmber },
      'Flagged': { className: styles.spRed },
      'Reviewed': { className: styles.spGreen },
      'Industry pending': { className: styles.spGray },
    };

    const config = statusConfig[status] || { className: styles.spGray };
    return <span className={`${styles.statusPill} ${config.className}`}>{status}</span>;
  };

  return (
    <div className={styles.card}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Student</th>
            <th>Organization</th>
            <th>This week (Mon–Fri)</th>
            <th>Weeks 1–5</th>
            <th>Review status</th>
            <th>Flag</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} data-filter={student.filters}>
              <td>
                <div className={styles.studentName}>{student.name}</div>
                <div className={styles.studentReg}>{student.registration}</div>
              </td>
              <td>
                <div className={styles.studentOrg}>{student.organization}</div>
              </td>
              <td>
                <WeekDots weekData={student.currentWeek} showLabels={true} currentWeek={true} />
              </td>
              <td>
                <WeekDots weekData={student.previousWeeks} showLabels={true} currentWeek={false} />
              </td>
              <td>{getStatusPill(student.reviewStatus)}</td>
              <td>
                <button
                  className={`${styles.flagBtn} ${student.flagged ? styles.flagged : ''}`}
                  onClick={() => onFlagToggle(student.id)}
                >
                  ⚑
                </button>
              </td>
              <td>
                <button
                  className={styles.viewBtn}
                  onClick={() => handleViewReviews(student.id)}
                >
                  View reviews →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <span className={styles.paginationInfo}>
          {students.length} students · all shown
        </span>
        <div className={styles.paginationButtons}>
          <button className={`${styles.paginationBtn} ${styles.active}`}>1</button>
        </div>
      </div>
    </div>
  );
};

export default StudentsTable;
