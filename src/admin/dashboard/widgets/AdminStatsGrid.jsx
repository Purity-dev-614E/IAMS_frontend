import React from 'react';
import styles from './AdminStatsGrid.module.css';

const AdminStatsGrid = () => {
  const stats = [
    {
      label: 'Total students',
      value: '84',
      sub: 'registered this cohort',
      trend: 'up',
      trendText: '↑ 12 from last cohort'
    },
    {
      label: 'Active attachments',
      value: '71',
      sub: 'of 84 students',
      trend: 'warn',
      trendText: '13 pending activation'
    },
    {
      label: 'Logs this week',
      value: '289',
      sub: 'across all students',
      trend: 'up',
      trendText: '↑ 94% submission rate'
    },
    {
      label: 'Pending approvals',
      value: '3',
      sub: 'supervisors waiting',
      trend: 'red',
      trendText: 'Action required'
    },
    {
      label: 'Reviews complete',
      value: '67%',
      sub: 'of Week 5 reviews',
      trend: 'warn',
      trendText: '33% still pending'
    }
  ];

  const getTrendClass = (trend) => {
    switch (trend) {
      case 'up': return styles.trendUp;
      case 'warn': return styles.trendWarn;
      case 'red': return styles.trendRed;
      default: return '';
    }
  };

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
