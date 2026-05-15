import React from 'react';
import styles from './UniSupStatsGrid.module.css';

const UniSupStatsGrid = ({ overview, statistics }) => {
  const stats = [
    {
      label: 'Assigned students',
      value: overview?.totalStudents || 0,
      sub: `${overview?.activeAttachments || 0} active, ${overview?.pendingAttachments || 0} pending`,
      pill: 'Cohort Overview',
      pillColor: 'var(--blue-light)',
      pillTextColor: 'var(--blue)'
    },
    {
      label: 'Need feedback',
      value: statistics?.pending || 0,
      sub: 'Reviews awaiting your action',
      pill: statistics?.pending > 0 ? 'Action needed' : 'All caught up',
      pillColor: statistics?.pending > 0 ? 'var(--amber-bg)' : 'var(--green-bg)',
      pillTextColor: statistics?.pending > 0 ? 'var(--amber)' : 'var(--green)'
    },
    {
      label: 'Industry reviewed',
      value: statistics?.industryReviewed || 0,
      sub: 'of total weekly reviews',
      pill: 'Supervisor ready',
      pillColor: 'var(--purple-bg)',
      pillTextColor: 'var(--purple)'
    },
    {
      label: 'Complete reviews',
      value: statistics?.complete || 0,
      sub: `of ${statistics?.total || 0} total reviews`,
      pill: 'On track',
      pillColor: 'var(--green-bg)',
      pillTextColor: 'var(--green)'
    }
  ];

  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, index) => (
        <div key={index} className={styles.statCard}>
          <div className={styles.statLabel}>{stat.label}</div>
          <div className={styles.statValue}>{stat.value}</div>
          <div className={styles.statSub}>{stat.sub}</div>
          <span 
            className={styles.statPill} 
            style={{
              background: stat.pillColor,
              color: stat.pillTextColor
            }}
          >
            {stat.pill}
          </span>
        </div>
      ))}
    </div>
  );
};

export default UniSupStatsGrid;
