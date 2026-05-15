import React from 'react';
import styles from './RecentActivity.module.css';

const RecentActivity = ({ activities = [] }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Recent activity</span>
      </div>
      <div className={styles.cardBody}>
        {activities.length === 0 ? (
          <div className={styles.emptyActivity}>No recent activity found.</div>
        ) : (
          activities.map((activity, index) => (
            <div key={activity.id || index} className={styles.activityItem}>
              <div className={styles.activityDot} style={{background: activity.icon}}></div>
              <div style={{flex: 1}}>
                <div className={styles.activityText} dangerouslySetInnerHTML={{__html: activity.text}}></div>
                <div className={styles.activityTime}>{activity.time}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
