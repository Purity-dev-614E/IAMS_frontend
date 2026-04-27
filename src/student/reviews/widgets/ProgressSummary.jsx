import React from 'react';
import styles from './ProgressSummary.module.css';

const ProgressSummary = () => {
  return (
    <div className={styles.progressSummary}>
      <div className={styles.psStat}>
        <div className={styles.psNum}>6</div>
        <div className={styles.psLabel}>Weeks elapsed</div>
      </div>
      <div className={styles.psDivider}></div>
      <div className={styles.psStat}>
        <div className={styles.psNum}>5</div>
        <div className={styles.psLabel}>Reviews complete</div>
      </div>
      <div className={styles.psDivider}></div>
      <div className={styles.psStat}>
        <div className={styles.psNum}>1</div>
        <div className={styles.psLabel}>In progress</div>
      </div>
      <div className={styles.psDivider}></div>
      <div className={styles.psPipeline}>
        <div className={styles.pipelineLabel}>How reviews work each week</div>
        <div className={styles.pipeline}>
          <div className={styles.pipeStep} style={{background: 'var(--blue)'}}></div>
          <span className={styles.pipeArrow}>›</span>
          <div className={styles.pipeStep} style={{background: 'var(--amber)'}}></div>
          <span className={styles.pipeArrow}>›</span>
          <div className={styles.pipeStep} style={{background: 'var(--green)'}}></div>
          <span className={styles.pipeArrow}>›</span>
          <div className={styles.pipeStep} style={{background: 'var(--purple-bg)', border: '0.5px solid var(--purple-border)'}}></div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '4px'}}>
          <span style={{fontSize: '10px', color: 'var(--subtle)'}}>Logs submitted</span>
          <span style={{fontSize: '10px', color: 'var(--subtle)'}}>Industry reviews</span>
          <span style={{fontSize: '10px', color: 'var(--subtle)'}}>Uni reviews</span>
          <span style={{fontSize: '10px', color: 'var(--subtle)'}}>Complete</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressSummary;
