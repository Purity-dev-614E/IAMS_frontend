import React, { useState } from 'react';
import DailyLogs from './DailyLogs';
import IndustryFeedback from './IndustryFeedback';
import FeedbackForm from './FeedbackForm';
import styles from './ReviewCard.module.css';

const ReviewCard = ({ week, data, onFeedbackSubmit, onFeedbackEdit }) => {
  const [isOpen, setIsOpen] = useState(data.isOpen || false);
  const [isEditingFeedback, setIsEditingFeedback] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleFeedbackSubmit = (weekId, feedback) => {
    onFeedbackSubmit(weekId, feedback);
    setIsEditingFeedback(false);
  };

  const handleFeedbackEdit = (weekId) => {
    setIsEditingFeedback(true);
    onFeedbackEdit(weekId);
  };

  const getWeekBadgeColor = () => {
    if (data.isCurrent) return 'var(--blue)';
    if (data.status === 'complete') return 'var(--green)';
    return 'var(--amber)';
  };

  const getStatusPill = () => {
    const statusConfig = {
      'Complete': { className: styles.spGreen, text: 'Complete' },
      'Needs feedback': { className: styles.spAmber, text: 'Needs feedback' },
      'Pending': { className: styles.spAmber, text: 'Pending' },
    };

    const config = statusConfig[data.status] || { className: styles.spGray, text: data.status };
    return <span className={`${styles.statusPill} ${config.className}`}>{config.text}</span>;
  };

  const getStageBadge = (stage, status) => {
    const stageConfig = {
      'done': { className: styles.sDone, dotColor: 'var(--green)' },
      'wait': { className: styles.sWait, dotColor: 'var(--amber)' },
      'none': { className: styles.sNone, dotColor: 'transparent' },
    };

    const config = stageConfig[status] || stageConfig.none;
    return (
      <span className={`${styles.stage} ${config.className}`}>
        <span className={styles.sDot} style={{ background: config.dotColor }}></span>
        {stage}
      </span>
    );
  };

  return (
    <div className={`${styles.reviewCard} ${data.needsFeedback ? styles.needsFeedback : ''}`}>
      <div className={styles.rh} onClick={toggleOpen}>
        <div className={styles.rhLeft}>
          <div className={styles.weekBadge} style={{ background: getWeekBadgeColor() }}>
            <div className={styles.wbNum}>{week}</div>
            <div className={styles.wbLbl}>week</div>
          </div>
          <div>
            <div className={styles.rhTitle}>
              Week {week} {data.isCurrent && '— current'}
            </div>
            <div className={styles.rhDates}>{data.dates}</div>
          </div>
        </div>
        <div className={styles.rhRight}>
          {data.stages && (
            <div className={styles.stages}>
              {getStageBadge('Logs', data.stages.logs)}
              {getStageBadge('Industry', data.stages.industry)}
              {getStageBadge('My feedback', data.stages.feedback)}
            </div>
          )}
          {getStatusPill()}
          <span className={`${styles.chev} ${isOpen ? styles.open : ''}`}>›</span>
        </div>
      </div>
      <div className={`${styles.rb} ${isOpen ? styles.open : ''}`}>
        {isOpen && (
          <>
            {data.dailyLogs && <DailyLogs logs={data.dailyLogs} />}
            {data.industryFeedback && <IndustryFeedback feedback={data.industryFeedback} />}
            <FeedbackForm
              week={`Week ${week}`}
              onSubmit={handleFeedbackSubmit}
              onEdit={handleFeedbackEdit}
              submittedFeedback={data.myFeedback}
              isEditing={isEditingFeedback}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
