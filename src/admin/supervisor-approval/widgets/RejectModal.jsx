import React, { useState } from 'react';
import styles from './RejectModal.module.css';

const RejectModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  supervisorName 
}) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason);
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.overlay} ${styles.open}`}>
      <div className={styles.modal}>
        <div className={styles.mh}>
          <span className={styles.mht}>Reject {supervisorName}</span>
          <button className={styles.mclose} onClick={handleClose}>
            ×
          </button>
        </div>
        <div className={styles.rejectBody}>
          <div className={styles.rfl}>
            Reason for rejection 
            <span style={{color: 'var(--subtle)', fontWeight: 400, fontSize: '11px'}}>
              (optional)
            </span>
          </div>
          <div className={styles.rfh}>
            This will be included in the rejection email sent to the supervisor.
          </div>
          <textarea 
            rows="3"
            placeholder="e.g. Cannot verify staff credentials. Please contact the department office."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className={styles.mf}>
          <button className={styles.bcl} onClick={handleClose}>
            Cancel
          </button>
          <button className={styles.bcaRed} onClick={handleConfirm}>
            Reject account
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
