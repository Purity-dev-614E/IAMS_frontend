import React from 'react';
import styles from './StageIndicators.module.css';

const StageIndicators = ({ stages }) => {
  const getStageClass = (stage) => {
    switch (stage.status) {
      case 'done': return styles.stageDone;
      case 'waiting': return styles.stageWait;
      case 'pending': return styles.stagePending;
      default: return '';
    }
  };

  const getDotColor = (stage) => {
    switch (stage.status) {
      case 'done': return 'var(--green)';
      case 'waiting': return 'var(--amber)';
      case 'pending': return 'var(--subtle)';
      default: return 'var(--subtle)';
    }
  };

  return (
    <div className={styles.stages}>
      {stages.map((stage, index) => (
        <span key={index} className={`${styles.stage} ${getStageClass(stage)}`}>
          <span 
            className={styles.stageDot} 
            style={{background: getDotColor(stage)}}
          ></span>
          {stage.label}
        </span>
      ))}
    </div>
  );
};

export default StageIndicators;
