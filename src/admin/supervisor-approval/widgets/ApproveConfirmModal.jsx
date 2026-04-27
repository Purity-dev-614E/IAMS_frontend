import React from 'react';
import styles from './ApproveConfirmModal.module.css';

const ApproveConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  supervisorName 
}) => {
  if (!isOpen) return null;

  return (
    <div className={`${styles.overlay} ${styles.open}`}>
      <div className={styles.modal}>
        <div className={styles.mh}>
          <span className={styles.mht}>Approve supervisor</span>
          <button className={styles.mclose} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.confirmBody}>
          <div className={styles.ci} style={{background: 'var(--gbg)', border: '0.5px solid var(--gb)'}}>
            ✓
          </div>
          <h3>Approve {supervisorName}?</h3>
          <p>
            They will receive an email notification and can log in immediately. 
            You can assign them to students from the Students screen.
          </p>
          <div className={styles.cbts}>
            <button className={styles.bcl} onClick={onClose}>
              Cancel
            </button>
            <button className={styles.bcaGreen} onClick={onConfirm}>
              Yes, approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveConfirmModal;
