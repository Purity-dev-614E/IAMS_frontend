import React from 'react';
import styles from './EmptyState.module.css';

const EmptyState = ({ onRegister }) => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>🗂</div>
      <h2>No attachment registered yet</h2>
      <p>Register your industrial attachment details to start submitting daily logs. You will need your organization's details and your industry supervisor's email address.</p>
      <button className={styles.btnRegister} onClick={onRegister}>
        Register my attachment
      </button>
    </div>
  );
};

export default EmptyState;
