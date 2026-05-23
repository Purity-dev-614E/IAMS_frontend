import React from 'react';
import styles from './ApprovalOption.module.css';

const ApprovalOption = ({ 
  type, 
  isSelected, 
  onClick, 
  label, 
  sublabel 
}) => {
  return (
    <button
      type="button"
      className={`${styles.approvalOption} ${
        isSelected && type === 'approve' ? styles.selectedApprove : ''
      } ${
        isSelected && type === 'reject' ? styles.selectedReject : ''
      }`}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      <div className={styles.approvalRadio}>
        <div className={styles.approvalDot}></div>
      </div>
      <div>
        <div className={styles.approvalLabel}>{label}</div>
        <div className={styles.approvalSublabel}>{sublabel}</div>
      </div>
    </button>
  );
};

export default ApprovalOption;
