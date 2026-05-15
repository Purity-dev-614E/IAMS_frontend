import React from 'react';
import styles from './AdminStatsGrid.module.css';

const AdminStatsGrid = ({ stats = [] }) => {
  const getTrendClass = (trend) => {
    switch (trend) {
      case 'up': return styles.trendUp;
      case 'warn': return styles.trendWarn;
      case 'red': return styles.trendRed;
      default: return '';
    }
  };

  if (stats.length === 0) {
    return <div className={styles.loadingStats}>No stats available</div>;
  }

  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, index) => (
        <div key={index} className={styles.statCard}>
          <div className={styles.statLabel}>{stat.label}</div>
          <div className={styles.statValue}>{stat.value}</div>
          <div className={styles.statSub}>{stat.sub}</div>
          <span className={`${styles.trend} ${getTrendClass(stat.trend)}`}>
            {stat.trendText}
          </span>
        </div>
      ))}
    </div>
  );
};

export default AdminStatsGrid;
