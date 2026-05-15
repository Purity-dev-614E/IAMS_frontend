import React from 'react';
import styles from './WeeklyReviews.module.css';

const WeeklyReviews = ({ reviews = [] }) => {
  const getStatusPill = (status) => {
    switch (status?.toLowerCase()) {
      case 'complete': return styles.pillComplete;
      case 'pending': return styles.pillPending;
      default: return '';
    }
  };

  const getProgressSteps = (review) => {
    const steps = ['blue']; // Log submission is always blue/done
    
    if (review.industryApproval === 'approved') {
      steps.push('green');
    } else if (review.status === 'pending') {
      steps.push('amber');
    } else {
      steps.push('surface');
    }

    if (review.uniRating > 0) {
      steps.push('purple');
    } else {
      steps.push('surface');
    }

    return steps;
  };

  const getProgressStyle = (type) => {
    switch (type) {
      case 'blue': return { background: 'var(--blue)' };
      case 'green': return { background: 'var(--green)' };
      case 'purple': return { background: 'var(--purple)', border: '0.5px solid #DDD8FE' };
      case 'amber': return { background: 'var(--amber)', border: '0.5px solid var(--amber-border)' };
      case 'surface': return { background: 'var(--surface)', border: '0.5px solid var(--border)' };
      default: return {};
    }
  };

  const formatDateRange = (start, end) => {
    if (!start || !end) return 'N/A';
    const s = new Date(start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const e = new Date(end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${s} – ${e}`;
  };

  // Only show the latest 2 reviews on dashboard
  const displayReviews = [...reviews].sort((a, b) => b.weekNumber - a.weekNumber).slice(0, 2);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Weekly reviews</span>
        <a href="/student/reviews" className={styles.cardAction}>View all</a>
      </div>
      <div className={styles.cardBody} style={{padding: '0.25rem 1.25rem'}}>
        {displayReviews.length === 0 ? (
          <div className={styles.emptyState}>No weekly reviews generated yet.</div>
        ) : (
          displayReviews.map((review, index) => (
            <div key={review.id || index} className={styles.reviewItem}>
              <div className={styles.reviewTop}>
                <div>
                  <div className={styles.reviewWeek}>Week {review.weekNumber}</div>
                  <div className={styles.reviewDates}>{formatDateRange(review.weekStartDate, review.weekEndDate)}</div>
                </div>
                <span className={`${styles.statusPill} ${getStatusPill(review.status)}`}>
                  {review.status === 'complete' ? 'Complete' : 'In progress'}
                </span>
              </div>
              <div className={styles.reviewProgress}>
                {getProgressSteps(review).map((step, stepIndex) => (
                  <div key={stepIndex} className={styles.progressStep} style={getProgressStyle(step)}></div>
                ))}
              </div>
              <div className={`${styles.reviewFeedback} ${review.status !== 'complete' ? styles.pendingFeedback : ''}`}>
                <div className={styles.feedbackLabel} style={{color: review.status !== 'complete' ? 'var(--amber)' : 'var(--subtle)'}}>
                  {review.status === 'complete' ? (review.uniSupervisorName || 'University Supervisor') : 'Awaiting feedback'}
                </div>
                <div className={styles.feedbackText} style={{color: review.status !== 'complete' ? 'var(--amber)' : 'var(--muted)'}}>
                  {review.uniComments || review.industryComments || (review.status === 'complete' ? 'No feedback comments provided.' : 'Weekly review is currently being processed.')}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WeeklyReviews;
