import React from 'react';
import styles from './WeeklyReviewTrigger.module.css';

const WeeklyReviewTrigger = () => {
  return (
    <div className={styles.triggerCard}>
      <h3>Trigger weekly reviews</h3>
      <p>Manually bundle this week's daily logs and notify all supervisors. Run at end of each working week.</p>
      <button className={styles.triggerBtn}>Run weekly review — Week 6</button>
      <div className={styles.triggerMeta}>Last run: Friday 28 Mar 2025 at 5:00 PM</div>
    </div>
  );
};

export default WeeklyReviewTrigger;
