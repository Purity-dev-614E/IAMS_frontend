import React from 'react';
import styles from './Topbar.module.css';

const Topbar = ({ student }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const firstName = student?.name ? student.name.split(' ')[0] : 'Student';

  return (
    <div className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <h1>{getGreeting()}, {firstName}</h1>
        <p>{getFormattedDate()} · Active attachment</p>
      </div>
      <div className={styles.topbarRight}>
        <div className={styles.notifBtn}>
          🔔
          <div className={styles.notifDot}></div>
        </div>
        <div className={styles.dateBadge}>{student?.program || 'Student'}</div>
      </div>
    </div>
  );
};

export default Topbar;
