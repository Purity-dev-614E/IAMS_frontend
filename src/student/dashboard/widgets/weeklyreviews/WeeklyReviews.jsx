import React from 'react';
import styles from './WeeklyReviews.module.css';

const WeeklyReviews = () => {
  const reviews = [
    {
      week: 'Week 5',
      dates: '24 Mar – 28 Mar 2025',
      status: 'complete',
      supervisor: 'Dr. Kamau',
      feedback: '"Good progress this week. Focus on writing cleaner commit messages and documenting your API endpoints more thoroughly."',
      progress: ['blue', 'green', 'purple']
    },
    {
      week: 'Week 6 — current',
      dates: '31 Mar – 4 Apr 2025',
      status: 'pending',
      supervisor: 'Awaiting industry supervisor',
      feedback: 'Weekly review email sent to supervisor. Awaiting their response before academic review begins.',
      progress: ['blue', 'amber', 'surface']
    }
  ];

  const getStatusPill = (status) => {
    switch (status) {
      case 'complete': return styles.pillComplete;
      case 'pending': return styles.pillPending;
      default: return '';
    }
  };

  const getProgressStyle = (type) => {
    switch (type) {
      case 'blue': return { background: 'var(--blue)' };
      case 'green': return { background: 'var(--green)' };
      case 'purple': return { background: 'var(--purple-bg)', border: '0.5px solid #DDD8FE' };
      case 'amber': return { background: 'var(--amber-bg)', border: '0.5px solid var(--amber-border)' };
      case 'surface': return { background: 'var(--surface)', border: '0.5px solid var(--border)' };
      default: return {};
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Weekly reviews</span>
        <a href="#" className={styles.cardAction}>View all</a>
      </div>
      <div className={styles.cardBody} style={{padding: '0.25rem 1.25rem'}}>
        {reviews.map((review, index) => (
          <div key={index} className={styles.reviewItem}>
            <div className={styles.reviewTop}>
              <div>
                <div className={styles.reviewWeek}>{review.week}</div>
                <div className={styles.reviewDates}>{review.dates}</div>
              </div>
              <span className={`${styles.statusPill} ${getStatusPill(review.status)}`}>
                {review.status === 'complete' ? 'Complete' : 'In progress'}
              </span>
            </div>
            <div className={styles.reviewProgress}>
              {review.progress.map((step, stepIndex) => (
                <div key={stepIndex} className={styles.progressStep} style={getProgressStyle(step)}></div>
              ))}
            </div>
            <div className={`${styles.reviewFeedback} ${review.status === 'pending' ? styles.pendingFeedback : ''}`}>
              <div className={styles.feedbackLabel} style={{color: review.status === 'pending' ? 'var(--amber)' : 'var(--subtle)'}}>
                {review.supervisor}
              </div>
              <div className={styles.feedbackText} style={{color: review.status === 'pending' ? 'var(--amber)' : 'var(--muted)'}}>
                {review.feedback}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyReviews;
