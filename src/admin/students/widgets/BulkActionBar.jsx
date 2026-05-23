import React from 'react';
import styles from './BulkActionBar.module.css';

const BulkActionBar = ({ selectedCount, onAssign, onClear }) => {
  if (selectedCount === 0) return null;

  return (
    <div className={`${styles.bulkBar} ${styles.show}`}>
      <span className={styles.bulkInfo}>
        <strong>{selectedCount}</strong> students selected
      </span>
      <div className={styles.bulkActions}>
        <button className={`${styles.bbtn} ${styles.bbtnAssign}`} onClick={onAssign}>
          Assign supervisor 
        </button>
        <button className={`${styles.bbtn} ${styles.bbtnClear}`} onClick={onClear}>
          Clear selection
        </button>
      </div>
    </div>
  );
};

export default BulkActionBar;
