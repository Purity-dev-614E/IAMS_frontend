import React, { useState } from 'react';
import styles from './EligibilityReviewModal.module.css';

const REASONS = [
  { value: 'deferred', label: 'Deferred' },
  { value: 'repeating', label: 'Repeating' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'readmission', label: 'Readmission' },
  { value: 'special_approval', label: 'Special approval' },
  { value: 'other', label: 'Other' }
];

const EligibilityReviewModal = ({ isOpen, isSubmitting, onClose, onSubmit }) => {
  const [reasonType, setReasonType] = useState('deferred');
  const [explanation, setExplanation] = useState('');

  if (!isOpen) return null;

  const submit = () => {
    onSubmit({
      reason_type: reasonType,
      explanation
    });
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>
            <h2>Request Attachment Eligibility Review</h2>
            <p>Share the academic context an admin should review.</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close review request">
            x
          </button>
        </div>

        <div className={styles.body}>
          <label className={styles.field}>
            <span>Reason</span>
            <select value={reasonType} onChange={(event) => setReasonType(event.target.value)}>
              {REASONS.map((reason) => (
                <option key={reason.value} value={reason.value}>{reason.label}</option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Explanation</span>
            <textarea
              rows="5"
              placeholder="I deferred in 2024 and resumed in 2025, so I am currently in year 3."
              value={explanation}
              onChange={(event) => setExplanation(event.target.value)}
            />
          </label>
        </div>

        <div className={styles.footer}>
          <button className={styles.secondaryBtn} onClick={onClose} disabled={isSubmitting}>Cancel</button>
          <button className={styles.primaryBtn} onClick={submit} disabled={isSubmitting || !explanation.trim()}>
            {isSubmitting ? 'Submitting...' : 'Submit request'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EligibilityReviewModal;
