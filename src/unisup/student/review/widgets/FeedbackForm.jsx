import React, { useState } from 'react';
import styles from './FeedbackForm.module.css';

const FeedbackForm = ({ week, onSubmit, onEdit, submittedFeedback, isEditing }) => {
  const [feedback, setFeedback] = useState({
    comments: submittedFeedback?.comments || '',
    improvements: submittedFeedback?.improvements || ''
  });

  const handleSubmit = () => {
    if (!feedback.comments.trim()) {
      return;
    }
    onSubmit(week, feedback);
  };

  const handleEdit = () => {
    onEdit(week);
  };

  if (submittedFeedback && !isEditing) {
    return (
      <div className={styles.mySection}>
        <div className={styles.secTitle}>Your academic feedback — {week}</div>
        <div className={styles.submittedFeedback}>
          <span style={{ fontSize: '14px', color: 'var(--green)', flexShrink: 0 }}>✓</span>
          <p>{submittedFeedback.comments}</p>
          {submittedFeedback.improvements && (
            <p style={{ marginTop: '8px' }}>
              <strong>Improvements:</strong> {submittedFeedback.improvements}
            </p>
          )}
          <button className={styles.editBtn} onClick={handleEdit}>
            Edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mySection}>
      <div className={styles.secTitle}>
        {submittedFeedback ? `Edit your feedback — ${week}` : `Your academic feedback — ${week}`}
      </div>
      <div className={styles.feedbackForm}>
        <div className={styles.ffTitle}>
          {submittedFeedback ? 'Edit your feedback for this week' : 'Submit your feedback for this week'}
        </div>
        <textarea
          rows="4"
          placeholder="Academic comments — what does this week's activity demonstrate about the student's progress and learning?"
          value={feedback.comments}
          onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
        />
        <div className={styles.ffRow}>
          <textarea
            rows="2"
            placeholder="Improvements / recommendations..."
            value={feedback.improvements}
            onChange={(e) => setFeedback({ ...feedback, improvements: e.target.value })}
          />
        </div>
        <button className={styles.submitFbBtn} onClick={handleSubmit}>
          {submittedFeedback ? 'Save changes' : `Submit feedback for ${week}`}
        </button>
      </div>
    </div>
  );
};

export default FeedbackForm;
