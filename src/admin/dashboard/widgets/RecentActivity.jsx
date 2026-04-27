import React from 'react';
import styles from './RecentActivity.module.css';

const RecentActivity = () => {
  const activities = [
    {
      icon: 'var(--green)',
      text: '<strong>Purity Sang</strong> submitted Week 6 daily log',
      time: '2 min ago'
    },
    {
      icon: 'var(--blue)',
      text: '<strong>Dr. Kamau</strong> approved — Week 5 review for 4 students',
      time: '1 hr ago'
    },
    {
      icon: 'var(--amber)',
      text: '<strong>James Mwangi</strong> (industry) approved Amina Hassan — Week 5',
      time: '3 hrs ago'
    },
    {
      icon: 'var(--red)',
      text: '<strong>Brian Otieno</strong> has no supervisor assigned — flagged',
      time: 'Yesterday'
    }
  ];

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Recent activity</span>
      </div>
      {activities.map((activity, index) => (
        <div key={index} className={styles.activityItem}>
          <div className={styles.activityDot} style={{background: activity.icon}}></div>
          <div style={{flex: 1}}>
            <div className={styles.activityText} dangerouslySetInnerHTML={{__html: activity.text}}></div>
            <div className={styles.activityTime}>{activity.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
