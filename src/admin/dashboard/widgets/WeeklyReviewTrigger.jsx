import React, { useMemo, useState } from 'react';
import styles from './WeeklyReviewTrigger.module.css';
import { adminDashboardService } from '../services/adminDashboardService';

const getFirstValue = (source, keys) => {
  if (!source) return null;

  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }

  return null;
};

const formatLastRun = (value) => {
  if (!value) return 'Last run: Not run yet';

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return `Last run: ${value}`;

  return `Last run: ${date.toLocaleString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })}`;
};

const WeeklyReviewTrigger = ({ metrics, onTriggered }) => {
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const reviewMeta = useMemo(() => {
    const weekNumber = getFirstValue(metrics, [
      'current_week',
      'currentWeek',
      'week_number',
      'weekNumber',
      'next_week',
      'nextWeek'
    ]);
    const lastRun = getFirstValue(metrics, [
      'last_weekly_review_run',
      'lastWeeklyReviewRun',
      'weekly_review_last_run',
      'weeklyReviewLastRun',
      'last_run',
      'lastRun'
    ]);

    return {
      weekLabel: weekNumber ? `Week ${weekNumber}` : 'current week',
      lastRunText: formatLastRun(lastRun)
    };
  }, [metrics]);

  const handleTrigger = async () => {
    try {
      setIsSending(true);
      setStatusMessage('');

      const response = await adminDashboardService.sendWeeklyReviews();
      setStatusMessage(response.message || 'Weekly review notifications sent.');
      await onTriggered?.();
    } catch (error) {
      setStatusMessage(error.message || 'Failed to send weekly reviews.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.triggerCard}>
      <h3>Trigger weekly reviews</h3>
      <p>Manually bundle this week's daily logs and notify all supervisors. Run at end of each working week.</p>
      <button className={styles.triggerBtn} onClick={handleTrigger} disabled={isSending}>
        {isSending ? 'Running weekly review...' : `Run weekly review - ${reviewMeta.weekLabel}`}
      </button>
      <div className={styles.triggerMeta}>{statusMessage || reviewMeta.lastRunText}</div>
    </div>
  );
};

export default WeeklyReviewTrigger;
