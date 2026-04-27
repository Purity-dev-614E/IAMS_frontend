import React from 'react';
import styles from './StrengthBar.module.css';

const StrengthBar = ({ password }) => {
  const getStrength = (pwd) => {
    if (!pwd) return { width: '0%', color: '', label: '' };
    
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    const strengthMap = {
      0: { width: '0%', color: '', label: '' },
      1: { width: '30%', color: '#DC2626', label: 'Weak' },
      2: { width: '60%', color: '#D97706', label: 'Fair' },
      3: { width: '80%', color: '#2563EB', label: 'Good' },
      4: { width: '100%', color: '#166534', label: 'Strong' }
    };

    return strengthMap[strength] || strengthMap[0];
  };

  const strength = getStrength(password);

  return (
    <>
      <div className={styles.strengthBar}>
        <div 
          className={styles.strengthFill}
          style={{ 
            width: strength.width, 
            backgroundColor: strength.color || 'transparent' 
          }}
        />
      </div>
      <div 
        className={styles.strengthLabel}
        style={{ color: strength.color || 'var(--subtle)' }}
      >
        {strength.label}
      </div>
    </>
  );
};

export default StrengthBar;
