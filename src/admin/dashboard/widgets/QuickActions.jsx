import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './QuickActions.module.css';

const QuickActions = () => {
  const navigate = useNavigate();
  
  const actions = [
    {
      icon: '⊞',
      color: 'var(--blue-light)',
      label: 'Assign supervisors',
      sub: 'Manage student assignments',
      path: '/admin/students'
    },
    {
      icon: '◎',
      color: 'var(--amber-bg)',
      label: 'Activate attachments',
      sub: 'Review pending registrations',
      path: '/admin/attachments'
    },
    {
      icon: '↓',
      color: 'var(--green-bg)',
      label: 'Generate cohort report',
      sub: 'PDF or CSV export',
      path: '/admin/reports'
    }
  ];

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Quick actions</span>
      </div>
      <div className={styles.cardBody} style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
        {actions.map((action, index) => (
          <div 
            key={index} 
            className={styles.quickAction}
            onClick={() => navigate(action.path)}
            style={{cursor: 'pointer'}}
          >
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
