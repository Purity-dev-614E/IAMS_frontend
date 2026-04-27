import React from 'react';
import styles from './Roles.module.css';

const Roles = () => {
  const roles = [
    {
      icon: '📚',
      name: 'Students',
      desc: 'Register your attachment, submit daily activity logs, and track your progress through weekly supervisor reviews — all in one place.',
      tag: 'Daily logging',
      bgColor: 'var(--blue-light)',
      tagColor: 'var(--blue)'
    },
    {
      icon: '🎓',
      name: 'University supervisors',
      desc: 'Monitor all your assigned students, review their weekly activity bundles, and provide structured academic feedback and improvement guidance.',
      tag: 'Weekly review',
      bgColor: 'var(--green-bg)',
      tagColor: 'var(--green)'
    },
    {
      icon: '🏢',
      name: 'Industry supervisors',
      desc: 'No account needed. Receive a weekly email link, review your intern\'s activity for the week, and submit your feedback in under two minutes.',
      tag: 'Email-only access',
      bgColor: 'var(--amber-bg)',
      tagColor: 'var(--amber)'
    },
    {
      icon: '🛡️',
      name: 'Administrators',
      desc: 'Manage user accounts, activate student attachments, assign university supervisors, approve registrations, and generate cohort-wide reports.',
      tag: 'Full system access',
      bgColor: 'var(--red-bg)',
      tagColor: 'var(--red)'
    }
  ];

  return (
    <section className={styles.rolesSection}>
      <div className={styles.max600}>
        <div className={styles.sectionLabel}>Who it's for</div>
        <h2 className={`${styles.sectionTitle} ${styles.serif}`}>
          Built for every stakeholder in the attachment process
        </h2>
      </div>
      <div className={styles.rolesGrid}>
        {roles.map((role, index) => (
          <div key={index} className={styles.roleCard}>
            <div 
              className={styles.roleIcon} 
              style={{ background: role.bgColor }}
            >
              {role.icon}
            </div>
            <div className={styles.roleName}>{role.name}</div>
            <div className={styles.roleDesc}>{role.desc}</div>
            <span 
              className={styles.roleTag}
              style={{ 
                background: role.bgColor,
                color: role.tagColor
              }}
            >
              {role.tag}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Roles;
