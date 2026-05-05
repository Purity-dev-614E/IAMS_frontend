import React from 'react';
import styles from './StudentTable.module.css';

const StudentTable = ({ 
  students, 
  selectedStudents, 
  onSelectionChange, 
  onAssignSingle, 
  onViewStudent 
}) => {
  const handleCheckboxChange = (studentId, checked) => {
    const newSelection = checked 
      ? [...selectedStudents, studentId]
      : selectedStudents.filter(id => id !== studentId);
    onSelectionChange(newSelection);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(students.map(s => s.id));
    } else {
      onSelectionChange([]);
    }
  };

  const getProgramBadge = (program) => {
    const programClasses = {
      'BBIT': styles.spBlue,
      'BSc CS': styles.spGreen,
      'BSc IT': styles.spAmber
    };
    return (
      <span className={`${styles.sp} ${programClasses[program] || styles.spGray}`}>
        {program}
      </span>
    );
  };

  const getAttachmentBadge = (status) => {
    const statusClasses = {
      active: styles.spGreen,
      pending: styles.spAmber
    };
    return (
      <span className={`${styles.sp} ${statusClasses[status] || styles.spGray}`}>
        {status === 'active' ? 'Active' : 'Pending'}
      </span>
    );
  };

  const getLogsBadge = (current, total) => {
    if (current === 0 && total > 0) {
      return <span className={`${styles.sp} ${styles.spRed}`}>0 of {total}</span>;
    } else if (current === total && total > 0) {
      return <span className={`${styles.sp} ${styles.spBlue}`}>{current} of {total}</span>;
    } else if (current < total) {
      return <span className={`${styles.sp} ${styles.spAmber}`}>{current} of {total}</span>;
    }
    return <span className={styles.sp}>â</span>;
  };

  const isAllSelected = students.length > 0 && selectedStudents.length === students.length;

  return (
    <div className={styles.card}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.checkCol}>
              <input 
                type="checkbox" 
                checked={isAllSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </th>
            <th>Student</th>
            <th>Program</th>
            <th>Supervisor</th>
            <th>Attachment</th>
            <th>Logs this week</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr 
              key={student.id}
              className={selectedStudents.includes(student.id) ? styles.selected : ''}
            >
              <td>
                <input 
                  type="checkbox" 
                  className={styles.rowCheck}
                  checked={selectedStudents.includes(student.id)}
                  onChange={(e) => handleCheckboxChange(student.id, e.target.checked)}
                />
              </td>
              <td className={styles.nameCell}>
                <div className={styles.sname}>{student.name}</div>
                <div className={styles.sreg}>{student.regNumber}</div>
              </td>
              <td style={{color: 'var(--muted)'}}>
                {student.program} · Year {student.year || 'N/A'}
              </td>
              <td>
                {student.supervisor ? (
                  <span style={{fontSize: '12px'}}>{student.supervisor}</span>
                ) : (
                  <span className={styles.warnText}> Unassigned</span>
                )}
              </td>
              <td>{getAttachmentBadge(student.attachmentStatus)}</td>
              <td>{getLogsBadge(student.logsThisWeek, student.totalLogs)}</td>
              <td>
                <div style={{display: 'flex', gap: '6px'}}>
                  <button 
                    className={`${styles.abtn} ${styles.abtnAssign}`}
                    onClick={() => onAssignSingle(student)}
                  >
                    {student.supervisor ? 'Reassign' : 'Assign'}
                  </button>
                  <button 
                    className={`${styles.abtn} ${styles.abtnView}`}
                    onClick={() => onViewStudent(student)}
                  >
                    View
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

export default StudentTable;
