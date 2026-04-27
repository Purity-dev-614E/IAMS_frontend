import React from 'react';
import styles from './ConfirmModal.module.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, type = 'delete', userName = '' }) => {
  if (!isOpen) return null;

  const getModalContent = () => {
    switch (type) {
      case 'delete':
        return {
          icon: 'â',
          iconBg: 'var(--rbg)',
          iconBorder: 'var(--rb)',
          title: 'Delete this account?',
          message: `${userName}'s account will be permanently deleted. This cannot be undone. Accounts with associated logs or attachments cannot be deleted.`
        };
      default:
        return {
          icon: 'â',
          iconBg: 'var(--rbg)',
          iconBorder: 'var(--rb)',
          title: 'Confirm action?',
          message: 'This action cannot be undone.'
        };
    }
  };

  const content = getModalContent();

  return (
    <div className={`${styles.overlay} ${styles.open}`}>
      <div className={styles.modal}>
        <div className={styles.confirmBody}>
          <div 
            className={styles.confirmIcon}
            style={{
              background: content.iconBg,
              border: `0.5px solid ${content.iconBorder}`
            }}
          >
            {content.icon}
          </div>
          <h3>{content.title}</h3>
          <p>{content.message}</p>
          <div className={styles.confirmBtns}>
            <button className={styles.btnCancel} onClick={onClose}>
              Cancel
            </button>
            <button className={styles.btnDanger} onClick={onConfirm}>
              {type === 'delete' ? 'Delete account' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
