import React from 'react';
import styles from './ActivateConfirmModal.module.css';

const ActivateConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  studentName,
  organization 
}) => {
  if (!isOpen) return null;

  return (
    <div className={`${styles.overlay} ${styles.open}`}>
      <div className={styles.modal}>
        <div className={styles.mh2}>
          <span className={styles.mht}>Activate attachment</span>
          <button className={styles.mclose} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.confirmBody}>
          <div className={styles.ci} style={{background: 'var(--gbg)', border: '0.5px solid var(--gb)'}}>
            ✓
          </div>
          <h3>Activate {studentName}'s attachment?</h3>
          <p>
            This will allow {studentName} to start submitting daily logs at {organization}. 
            Make sure a university supervisor has been assigned before activating.
          </p>
          <div className={styles.cbts}>
            <button className={styles.bcl} onClick={onClose}>
              Cancel
            </button>
            <button className={styles.bca} onClick={onConfirm}>
              Yes, activate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivateConfirmModal;
