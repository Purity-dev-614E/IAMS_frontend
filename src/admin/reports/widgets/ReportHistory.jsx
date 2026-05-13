import React from 'react';
import styles from './ReportHistory.module.css';

const ReportHistory = ({ history, onDownload }) => {
  const getTypeBadgeClass = (type) => {
    const typeClasses = {
      cohort: styles.spBlue,
      student: styles.spGreen,
      supervisor: styles.spAmber,
      logs: styles.spPurple
    };
    return typeClasses[type] || styles.spBlue;
  };

  const getTypeLabel = (type) => {
    const labels = {
      cohort: 'Cohort',
      student: 'Student',
      supervisor: 'Supervisor',
      logs: 'Logs'
    };
    return labels[type] || type;
  };

  return (
    <div className={styles.rightCol}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Recent reports</span>
          <span className={styles.viewAll}>View all</span>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Report</th>
              <th>Type</th>
              <th>Generated</th>
              <th>By</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {history.map((report) => (
              <tr key={report.id}>
                <td>
                  <div className={styles.reportName}>{report.name}</div>
                  <div className={styles.reportDescription}>{report.description}</div>
                </td>
                <td>
                  <span className={`${styles.sp} ${getTypeBadgeClass(report.type)}`}>
                    {getTypeLabel(report.type)}
                  </span>
                </td>
                <td className={styles.muted}>{report.generated}</td>
                <td className={styles.muted}>{report.by}</td>
                <td>
                  <button 
                    className={styles.downloadBtn}
                    onClick={() => onDownload(report)}
                  >
                    <span style={{ marginRight: '4px' }}>↓</span>
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportHistory;
