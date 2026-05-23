import React from 'react';
import { TriangleAlert } from 'lucide-react';
import styles from './ExpiredState.module.css';

const ExpiredState = ({ review }) => {
  const studentName = review?.student?.name || 'the student';

  return (
    <div className={styles.endPage}>
      <div className={`${styles.endIcon} ${styles.expiredIcon}`}>
        <TriangleAlert size={28} />
      </div>
      <h1>This link has expired</h1>
      <p>Review links are valid for 7 days. This link has passed its expiry date and can no longer be used.</p>
      <div className={styles.endCard}>
        <div className={styles.endCardTitle}>Review details</div>
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
        {review?.sentAt && (
          <div className={styles.endRow}>
            <span>Link sent</span>
            <span>{review.sentAt}</span>
          </div>
        )}
        {review?.expiresAt && (
          <div className={styles.endRow}>
            <span>Expired</span>
            <span>{review.expiresAt}</span>
          </div>
        )}
      </div>
      <p>Ask {studentName} or the university supervisor to send a new link.</p>
      <p className={styles.note}>iams@jkuat.ac.ke</p>
    </div>
  );
};

export default ExpiredState;
