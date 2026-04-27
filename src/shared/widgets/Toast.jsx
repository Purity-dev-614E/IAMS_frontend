import React, { useState, useEffect } from 'react';
import styles from './Toast.module.css';

const Toast = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.toast} ${type === 'error' ? styles.errorToast : ''}`}>
      <div className={styles.toastDot}></div>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
