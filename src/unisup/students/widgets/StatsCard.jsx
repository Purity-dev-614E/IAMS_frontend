import React from 'react';
import styles from './StatsCard.module.css';

const StatsCard = ({ label, value, subtitle, pill, pillColor }) => {
  return (
    <div className={styles.statsCard}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
      <div className={styles.subtitle}>{subtitle}</div>
      {pill && (
        <span className={styles.pill} style={{ background: pillColor }}>
          {pill}
        </span>
      )}
    </div>
  );
};

export default StatsCard;
