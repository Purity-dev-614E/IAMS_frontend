import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import styles from './SuccessState.module.css';

const SuccessState = ({ review }) => {
  const studentName = review?.student?.name || 'the student';
  const decision = review?.decision === 'rejected' ? 'Rejected' : 'Approved';

  return (
    <div className={styles.endPage}>
      <div className={`${styles.endIcon} ${styles.successIcon}`}>
        <CheckCircle2 size={28} />
      </div>
      <h1>Review submitted</h1>
      <p>Thank you. Your review for {studentName}{review?.week ? `, Week ${review.week}` : ''} has been recorded and shared with the university supervisor.</p>
      <div className={`${styles.endCard} ${styles.successCard}`}>
        <div className={styles.endCardTitle}>What you submitted</div>
        <div className={styles.endRow}>
          <span>Student</span>
          <span>{studentName}</span>
        </div>
        {review?.week && (
          <div className={styles.endRow}>
            <span>Week</span>
            <span>Week {review.week} - {review.period}</span>
          </div>
        )}
        <div className={styles.endRow}>
          <span>Decision</span>
          <span>{decision}</span>
        </div>
        {review?.submittedAt && (
          <div className={styles.endRow}>
            <span>Submitted</span>
            <span>{review.submittedAt}</span>
          </div>
        )}
      </div>
      <p className={styles.note}>This link has been used and will no longer accept responses. You can close this tab.</p>
    </div>
  );
};

export default SuccessState;
