import React from 'react';
import { CircleCheckBig } from 'lucide-react';
import styles from './UsedState.module.css';

const UsedState = ({ review }) => {
  const studentName = review?.student?.name || 'this student';
  const decision = review?.decision === 'rejected' ? 'Rejected' : review?.decision ? 'Approved' : 'Submitted';

  return (
    <div className={styles.endPage}>
      <div className={`${styles.endIcon} ${styles.usedIcon}`}>
        <CircleCheckBig size={28} />
      </div>
      <h1>Already submitted</h1>
      <p>You have already submitted your review for {studentName}{review?.week ? `, Week ${review.week}` : ''}. No further action is needed.</p>
      <div className={`${styles.endCard} ${styles.usedCard}`}>
        <div className={styles.endCardTitle}>Your submission</div>
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
      <p className={styles.note}>Questions? iams@jkuat.ac.ke</p>
    </div>
  );
};

export default UsedState;
