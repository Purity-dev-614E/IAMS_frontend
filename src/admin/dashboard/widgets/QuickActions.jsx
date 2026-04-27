import React from 'react';
import styles from './QuickActions.module.css';

const QuickActions = () => {
  const actions = [
    {
      icon: '⊞',
      color: 'var(--blue-light)',
      label: 'Assign supervisors',
      sub: '13 students unassigned'
    },
    {
      icon: '◎',
      color: 'var(--amber-bg)',
      label: 'Activate attachments',
      sub: '13 pending activation'
    },
    {
      icon: '↓',
      color: 'var(--green-bg)',
      label: 'Generate cohort report',
      sub: 'PDF or CSV export'
    }
  ];

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Quick actions</span>
      </div>
      <div className={styles.cardBody} style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
        {actions.map((action, index) => (
          <div key={index} className={styles.quickAction}>
            <div className={styles.qaIcon} style={{background: action.color}}>
              {action.icon}
            </div>
            <div className={styles.qaText}>
              <div className={styles.qaLabel}>{action.label}</div>
              <div className={styles.qaSub}>{action.sub}</div>
            </div>
            <span className={styles.qaArrow}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
