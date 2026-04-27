import React from 'react';
import styles from './Reminders.module.css';

const Reminders = () => {
  const reminders = [
    {
      icon: '◎',
      color: 'var(--amber)',
      text: 'Log today before midnight — logs cannot be backdated beyond 24 hours.'
    },
    {
      icon: '◎',
      color: 'var(--blue)',
      text: 'Week 6 review is in progress. Both supervisors will be notified at week\'s end.'
    },
    {
      icon: '◎',
      color: 'var(--green)',
      text: '3 weeks remaining. Stay consistent with daily submissions.'
    }
  ];

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Reminders</span>
      </div>
      <div className={styles.cardBody} style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
        {reminders.map((reminder, index) => (
          <div key={index} style={{display: 'flex', gap: '10px', alignItems: 'flex-start'}}>
            <span style={{fontSize: '13px', color: reminder.color, flexShrink: 0}}>{reminder.icon}</span>
            <p style={{fontSize: '12px', color: 'var(--muted)', lineHeight: '1.55'}}>{reminder.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reminders;
