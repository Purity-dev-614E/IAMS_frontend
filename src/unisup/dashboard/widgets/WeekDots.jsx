import React from 'react';
import styles from './WeekDots.module.css';

const WeekDots = ({ data, summary }) => {
  const getDotColor = (status) => {
    switch (status) {
      case 'submitted': return styles.dotSubmitted;
      case 'missing': return styles.dotMissing;
      case 'draft': return styles.dotDraft;
      case 'upcoming': return styles.dotUpcoming;
      default: return styles.dotUpcoming;
    }
  };

  const getDotTitle = (status, day) => {
    switch (status) {
      case 'submitted': return day;
      case 'missing': return `${day} — missing`;
      case 'draft': return day;
      case 'upcoming': return `${day} — upcoming`;
      default: return day;
    }
  };

  return (
    <div className={styles.weekDots}>
      {data.map((day, index) => (
        <div
          key={index}
          className={`${styles.wd} ${getDotColor(day.status)}`}
          title={getDotTitle(day.status, day.day)}
        />
      ))}
      {summary && (
        <div style={{fontSize: '10px', color: 'var(--muted)', marginTop: '3px'}}>
          {summary}
        </div>
      )}
    </div>
  );
};

export default WeekDots;
