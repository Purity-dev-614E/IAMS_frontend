import React from 'react';
import styles from './UniSupStatsGrid.module.css';

const UniSupStatsGrid = () => {
  const stats = [
    {
      label: 'Assigned students',
      value: '8',
      sub: 'this cohort',
      pill: 'All active',
      pillColor: 'var(--blue-light)',
      pillTextColor: 'var(--blue)'
    },
    {
      label: 'Need feedback',
      value: '2',
      sub: 'Week 6 reviews pending',
      pill: 'Action needed',
      pillColor: 'var(--amber-bg)',
      pillTextColor: 'var(--amber)'
    },
    {
      label: 'Fully reviewed',
      value: '5',
      sub: 'of 8 students this week',
      pill: 'On track',
      pillColor: 'var(--green-bg)',
      pillTextColor: 'var(--green)'
    },
    {
      label: 'Flagged',
      value: '1',
      sub: 'student needs attention',
      pill: 'Grace Wanjiru',
      pillColor: 'var(--red-bg)',
      pillTextColor: 'var(--red)'
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
