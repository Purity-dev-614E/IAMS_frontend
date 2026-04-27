import React, { useState } from 'react';
import styles from './ReviewCard.module.css';
import StatusPill from './StatusPill';
import StageIndicators from './StageIndicators';
import DailyLogsSection from './DailyLogsSection';
import FeedbackSection from './FeedbackSection';

const ReviewCard = ({ 
  week, 
  title, 
  dates, 
  logsSubmitted, 
  totalLogs, 
  status, 
  stages, 
  isCurrent = false, 
  dailyLogs, 
  industryFeedback, 
  uniFeedback,
  isExpanded = false 
}) => {
  const [expanded, setExpanded] = useState(isExpanded);

  const getWeekBadgeClass = () => {
    if (status === 'complete') return styles.complete;
    if (status === 'in-progress') return styles.inprogress;
    return '';
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`${styles.reviewCard} ${isCurrent ? styles.current : ''}`}>
      <div className={styles.reviewHeader} onClick={toggleExpanded}>
        <div className={styles.rhLeft}>
          <div className={`${styles.weekBadge} ${getWeekBadgeClass()}`}>
            <div className={styles.wNum}>{week}</div>
            <div className={styles.wLabel}>week</div>
          </div>
          <div>
            <div className={styles.rhTitle}>{title}</div>
            <div className={styles.rhDates}>{dates} · {logsSubmitted} of {totalLogs} logs submitted</div>
          </div>
        </div>
        <div className={styles.rhRight}>
          {stages && <StageIndicators stages={stages} />}
          {status === 'complete' && <StatusPill type="complete">Complete</StatusPill>}
          <span className={`${styles.chevron} ${expanded ? styles.open : ''}`}>›</span>
        </div>
      </div>
      
      <div className={`${styles.reviewBody} ${expanded ? styles.open : ''}`}>
        {dailyLogs && <DailyLogsSection logs={dailyLogs} />}
        
        {industryFeedback && (
          <FeedbackSection
            type="industry"
            feedback={industryFeedback}
            status={industryFeedback.status}
          />
        )}
        
        {uniFeedback && (
          <FeedbackSection
            type="university"
            feedback={uniFeedback}
            status={uniFeedback.status}
          />
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
