import React from 'react';
import styles from './GeneratingOverlay.module.css';

const GeneratingOverlay = ({ isGenerating, isSuccess, onDownload, onClose }) => {
  const getLoadingText = () => {
    // This would be passed from the report config in a real implementation
    return 'Compiling 2025 cohort data';
  };

  const getSuccessDescription = () => {
    // This would be passed from the report config in a real implementation
    return '2025 Cohort Overview · PDF · 84 students';
  };

  if (!isGenerating && !isSuccess) return null;

  return (
    <div className={`${styles.genOverlay} ${isGenerating || isSuccess ? styles.open : ''}`}>
      <div className={styles.genCard}>
        {/* Loading state */}
        <div id="gen-loading" style={{ display: isGenerating ? 'block' : 'none' }}>
          <div className={styles.genSpinner}></div>
          <div className={styles.genTitle}>Generating report...</div>
          <div className={styles.genSub}>{getLoadingText()}</div>
        </div>

        {/* Success state */}
        <div className={`${styles.successCard} ${isSuccess ? styles.show : ''}`}>
          <div className={styles.successIcon}>✓</div>
          <h3>Report ready</h3>
          <p>{getSuccessDescription()}</p>
          <button className={styles.downloadBig} onClick={onDownload}>
            <span style={{ marginRight: '8px' }}>↓</span>
            Download report
          </button>
          <button className={styles.closeBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneratingOverlay;
