import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Flag, LoaderCircle, UsersRound } from 'lucide-react';
import WeekDots from './WeekDots';
import styles from './StudentsTable.module.css';

const StudentsTable = ({ students, loading = false, activeFilter = 'all', searchTerm = '', onFlagToggle }) => {
  const navigate = useNavigate();

  const handleViewReviews = (studentId) => {
    navigate(`/supervisor/students/${studentId}/reviews`);
  };

  const getStatusPill = (status) => {
    const statusConfig = {
      'Needs my feedback': { className: styles.spAmber },
      Flagged: { className: styles.spRed },
      Reviewed: { className: styles.spGreen },
      'Industry pending': { className: styles.spGray },
    };

    const label = status || 'Industry pending';
    const config = statusConfig[label] || { className: styles.spGray };
    return <span className={`${styles.statusPill} ${config.className}`}>{label}</span>;
  };

  const emptyTitle = searchTerm
    ? 'No matching students'
    : activeFilter === 'all'
      ? 'No students assigned yet'
      : 'Nothing in this view';

  const emptyCopy = searchTerm
    ? 'Try a different name, registration number, program, or organization.'
    : activeFilter === 'all'
      ? 'Students assigned to you will appear here with their weekly log and review progress.'
      : 'Students will show here when they match the selected status.';

  const renderSkeletonRows = () => (
    Array.from({ length: 5 }).map((_, index) => (
      <tr key={`loading-${index}`} className={styles.skeletonRow}>
        <td><div className={styles.skeletonBlockWide}></div><div className={styles.skeletonBlockSmall}></div></td>
        <td><div className={styles.skeletonBlock}></div></td>
        <td><div className={styles.skeletonDots}></div><div className={styles.skeletonBlockSmall}></div></td>
        <td><div className={styles.skeletonDots}></div><div className={styles.skeletonBlockSmall}></div></td>
        <td><div className={styles.skeletonPill}></div></td>
        <td><div className={styles.skeletonIcon}></div></td>
        <td><div className={styles.skeletonButton}></div></td>
      </tr>
    ))
  );

  return (
    <div className={styles.card}>
      {loading && (
        <div className={styles.loadingBanner}>
          <LoaderCircle size={15} className={styles.spin} />
          Loading assigned students
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Student</th>
            <th>Organization</th>
            <th>This week (Mon-Fri)</th>
            <th>Weeks 1-5</th>
            <th>Review status</th>
            <th>Flag</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loading ? renderSkeletonRows() : students.map((student) => (
            <tr key={student.id} data-filter={student.filters}>
              <td>
                <div className={styles.studentName}>{student.name || 'Unknown student'}</div>
                <div className={styles.studentReg}>{student.registration || 'No registration number'}</div>
              </td>
              <td>
                <div className={styles.studentOrg}>{student.organization || 'Not assigned'}</div>
              </td>
              <td>
                <WeekDots weekData={student.currentWeek || []} showLabels={true} currentWeek={true} />
              </td>
              <td>
                <WeekDots weekData={student.previousWeeks || []} showLabels={true} currentWeek={false} />
              </td>
              <td>{getStatusPill(student.reviewStatus)}</td>
              <td>
                <button
                  className={`${styles.flagBtn} ${student.flagged ? styles.flagged : ''}`}
                  onClick={() => onFlagToggle(student.id)}
                  title={student.flagged ? 'Remove flag' : 'Flag for follow up'}
                  aria-label={student.flagged ? 'Remove flag' : 'Flag for follow up'}
                >
                  <Flag size={14} fill={student.flagged ? 'currentColor' : 'none'} />
                </button>
              </td>
              <td>
                <button
                  className={styles.viewBtn}
                  onClick={() => handleViewReviews(student.id)}
                >
                  View reviews <ArrowRight size={13} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!loading && students.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}><UsersRound size={24} /></div>
          <div className={styles.emptyTitle}>{emptyTitle}</div>
          <p>{emptyCopy}</p>
        </div>
      )}

      <div className={styles.pagination}>
        <span className={styles.paginationInfo}>
          {loading ? 'Loading students...' : `${students.length} students - all shown`}
        </span>
        <div className={styles.paginationButtons}>
          <button className={`${styles.paginationBtn} ${styles.active}`}>1</button>
        </div>
      </div>
    </div>
  );
};

export default StudentsTable;
