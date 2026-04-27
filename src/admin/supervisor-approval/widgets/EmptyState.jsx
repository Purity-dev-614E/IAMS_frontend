import React from 'react';
import styles from './EmptyState.module.css';

const EmptyState = () => {
  return (
    <div className={styles.histCard}>
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>✓</div>
        <h3>All caught up</h3>
        <p>No pending supervisor approvals. New registrations will appear here.</p>
      </div>
    </div>
  );
};

export default EmptyState;
