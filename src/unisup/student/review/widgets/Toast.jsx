import React, { useState, useEffect } from 'react';
import styles from './Toast.module.css';

const Toast = ({ message, show, duration = 2500 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  return (
    <div className={`${styles.toast} ${isVisible ? styles.show : ''}`}>
      <div className={styles.toastDot}></div>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
