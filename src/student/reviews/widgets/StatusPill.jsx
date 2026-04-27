import React from 'react';
import styles from './StatusPill.module.css';

const StatusPill = ({ type, children }) => {
  const getPillClass = () => {
    switch (type) {
      case 'complete': return styles.spillComplete;
      case 'pending': return styles.spillPending;
      case 'active': return styles.spillActive;
      case 'industry': return styles.spillIndustry;
      case 'in-progress': return styles.spillInprogress;
      case 'missing': return styles.spillMissing;
      case 'upcoming': return styles.spillUpcoming;
      default: return '';
    }
  };

  return (
    <span className={`${styles.spill} ${getPillClass()}`}>
      {children}
    </span>
  );
};

export default StatusPill;
