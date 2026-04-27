import React from 'react';
import styles from './HistoryTable.module.css';

const HistoryTable = ({ history }) => {
  const getStatusBadge = (decision) => {
    return (
      <span className={`${styles.sp} ${decision === 'Approved' ? styles.spGreen : styles.spRed}`}>
        {decision}
      </span>
    );
  };

  return (
    <div className={styles.histCard}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actioned</th>
            <th>Decision</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item, index) => (
            <tr key={index}>
              <td style={{fontWeight: 500}}>{item.name}</td>
              <td style={{color: 'var(--muted)'}}>{item.email}</td>
              <td style={{color: 'var(--muted)'}}>{item.department}</td>
              <td style={{color: 'var(--muted)'}}>{item.actionedDate}</td>
              <td>{getStatusBadge(item.decision)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;
