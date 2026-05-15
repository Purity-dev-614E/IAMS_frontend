import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WeeklyLogs.module.css';
import { useDailyLogs } from '../../services/useDailyLogs';
import { attachmentService } from '../../../attachments/services/attachmentService';
import { weeklyReviewService } from '../../../reviews/services/weeklyReviewService';

const WeeklyLogs = ({ currentDate = new Date(), attachment = null }) => {
  const navigate = useNavigate();
  const { logs, loading, error, fetchLogs } = useDailyLogs();
  const [weekLogs, setWeekLogs] = useState([]);
  const [weeklyReviews, setWeeklyReviews] = useState([]);
  const [isRequestingReview, setIsRequestingReview] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState({ allowed: true, reason: '' });

  // Helper to parse YYYY-MM-DD or ISO string to local Date at midnight
  const parseLocalDate = (dateInput) => {
    if (!dateInput) return new Date();
    if (dateInput instanceof Date) {
      const d = new Date(dateInput);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    
    // Handle "YYYY-MM-DD" string specifically to avoid timezone shifts
    if (typeof dateInput === 'string' && dateInput.includes('-')) {
      const parts = dateInput.split('T')[0].split('-');
      if (parts.length === 3) {
        return new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
      }
    }
    
    const d = new Date(dateInput);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Helper to get attachment ID safely
  const getAttachmentId = () => attachment?.attachmentId || attachment?.id;

  // Rate limiting helpers
  const getRateLimitKey = (attachmentId, weekNum) => `weekly_review_limit_${attachmentId}_w${weekNum}`;

  const checkRateLimit = (attachmentId, weekNum) => {
    if (!attachmentId) return { allowed: true };
    const key = getRateLimitKey(attachmentId, weekNum);
    const stored = localStorage.getItem(key);
    if (!stored) return { allowed: true };
    
    const data = JSON.parse(stored);
    if (data.success) {
      return { allowed: false, reason: 'A review has already been successfully created for this week.' };
    }
    if (data.errors >= 5) {
      return { allowed: false, reason: 'Maximum retry attempts (5) reached for this week.' };
    }
    return { allowed: true, data };
  };

  const updateRateLimit = (attachmentId, weekNum, isSuccess) => {
    if (!attachmentId) return;
    const key = getRateLimitKey(attachmentId, weekNum);
    const stored = localStorage.getItem(key);
    const data = stored ? JSON.parse(stored) : { success: false, errors: 0 };
    
    if (isSuccess) {
      data.success = true;
    } else {
      data.errors += 1;
    }
    
    localStorage.setItem(key, JSON.stringify(data));
    // Update local state to reflect change immediately
    const check = checkRateLimit(attachmentId, weekNum);
    setRateLimitInfo(check);
  };

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    const aid = getAttachmentId();
    if (aid) {
      const weekNum = getWeekNumber();
      // Check if review already exists in fetched list to sync rate limit
      const exists = weeklyReviews.some(r => Number(r.week_number) === Number(weekNum));
      if (exists) {
        updateRateLimit(aid, weekNum, true);
      }
      
      const check = checkRateLimit(aid, weekNum);
      setRateLimitInfo(check);
    }
  }, [attachment, currentDate, weeklyReviews]);

  useEffect(() => {
    const fetchReviews = async () => {
      const aid = getAttachmentId();
      if (aid) {
        try {
          const reviewsResponse = await weeklyReviewService.getReviewsByAttachment(aid);
          const reviewsArray = Array.isArray(reviewsResponse) ? reviewsResponse : reviewsResponse.data || reviewsResponse.reviews || [];
          setWeeklyReviews(reviewsArray);

          // Check if localStorage says a review was created but database doesn't have it
          const weekNum = getWeekNumber();
          const key = getRateLimitKey(aid, weekNum);
          const stored = localStorage.getItem(key);
          
          if (stored) {
            const data = JSON.parse(stored);
            const reviewExistsInDb = reviewsArray.some(r => Number(r.week_number) === Number(weekNum));
            
            // If localStorage says success but database doesn't have the review, clear the rate limit
            if (data.success && !reviewExistsInDb) {
              console.log('🔄 Review was deleted from database, clearing rate limit to allow re-request');
              localStorage.removeItem(key);
              setRateLimitInfo({ allowed: true, reason: '' });
            }
          }
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      }
    };
    fetchReviews();
  }, [attachment, currentDate]);

  useEffect(() => {
    // Get logs for the selected week
    const selectedWeek = getWeekLogs(currentDate, logs);
    setWeekLogs(selectedWeek);
  }, [logs, currentDate, attachment]);

  const getWeekLogs = (referenceDate, allLogs) => {
    const today = new Date();
    const startOfWeek = new Date(referenceDate);
    // Adjust to Monday
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const currentWeekLogs = [];

    for (let i = 0; i < 5; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      const dateStr = currentDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const year = currentDay.getFullYear();
      const month = String(currentDay.getMonth() + 1).padStart(2, '0');
      const dayNum = String(currentDay.getDate()).padStart(2, '0');
      const fullDate = `${year}-${month}-${dayNum}`;
      
      const logForDay = allLogs.find(log => {
        const logDate = new Date(log.logDate);
        return logDate.toDateString() === currentDay.toDateString();
      });

      let status = logForDay ? logForDay.status : (currentDay <= today ? 'missing' : 'upcoming');
      
      const startStr = attachment?.startDate || attachment?.start_date;
      const endStr = attachment?.endDate || attachment?.end_date;

      if (startStr && endStr) {
        const start = parseLocalDate(startStr);
        const end = parseLocalDate(endStr);
        end.setHours(23, 59, 59, 999);
        const current = new Date(currentDay);
        current.setHours(12, 0, 0, 0);

        if (current < start || current > end) {
          status = 'irrelevant';
        }
      }

      currentWeekLogs.push({
        day: weekDays[i],
        date: dateStr,
        fullDate: fullDate,
        isPastOrToday: currentDay <= today,
        tasks: status === 'irrelevant' ? 'Not part of attachment period' : (logForDay ? logForDay.tasksPerformed : '—'),
        status: status,
        logId: logForDay?.id || logForDay?.logId
      });
    }

    return currentWeekLogs;
  };

  const getStatusPill = (status) => {
    switch (status) {
      case 'submitted': return styles.pillSubmitted;
      case 'reviewed': return styles.pillVerified;
      case 'missing': return styles.pillMissing;
      case 'upcoming': return styles.pillUpcoming;
      case 'draft': return styles.pillSubmitted;
      case 'irrelevant': return styles.pillIrrelevant;
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'submitted': return 'Submitted';
      case 'reviewed': return 'Verified';
      case 'missing': return 'Not logged';
      case 'upcoming': return 'Upcoming';
      case 'draft': return 'Draft';
      case 'irrelevant': return 'N/A';
      default: return '';
    }
  };

  const getWeekNumber = () => {
    const startStr = attachment?.startDate || attachment?.start_date;
    if (!startStr) return 1;
    
    // Normalize dates to Monday of their respective weeks at midnight
    const getMonday = (date) => {
      const d = parseLocalDate(date);
      const day = d.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      d.setDate(d.getDate() + diff);
      return d;
    };

    const startMonday = getMonday(startStr);
    const currentMonday = getMonday(currentDate);
    
    const diffTime = currentMonday.getTime() - startMonday.getTime();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    
    const diffWeeks = Math.round(diffTime / oneWeekMs);
    
    const weekNum = Math.max(1, diffWeeks + 1);
    
    return Math.max(1, diffWeeks);
  };

  const handleEditLog = (log) => {
    if (log.logId) {
      navigate(`/logs/edit/${log.logId}`, { state: { logData: log } });
    }
  };

  const handleCreateLog = (date) => {
    navigate('/logs/new', { state: { date } });
  };

  const handleRequestReview = async () => {
    console.log('🚀 Request Review clicked');
    if (!attachment) {
      console.warn('⚠️ No attachment found');
      return;
    }
    
    const aid = getAttachmentId();
    const weekNum = getWeekNumber();
    console.log('📦 Attachment ID:', aid, 'Week Number:', weekNum);

    // Double safety: check if review already exists in the fetched reviews list
    const existingReview = weeklyReviews.find(r => Number(r.week_number) === Number(weekNum));
    if (existingReview) {
      console.warn('🛑 Review already exists for this week (Double Safety)');
      // Sync rate limit if it wasn't already marked successful
      updateRateLimit(aid, weekNum, true);
      alert('A review has already been created for this week.');
      return;
    }

    const rateLimit = checkRateLimit(aid, weekNum);
    if (!rateLimit.allowed) {
      console.warn('🛑 Rate limited:', rateLimit.reason);
      alert(rateLimit.reason);
      return;
    }
    
    setIsRequestingReview(true);
    try {
      // Calculate Monday and Friday for the selected week
      const getMonday = (date) => {
        const d = parseLocalDate(date);
        const day = d.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        d.setDate(d.getDate() + diff);
        return d;
      };

      const mondayDate = getMonday(currentDate);
      const fridayDate = new Date(mondayDate);
      fridayDate.setDate(mondayDate.getDate() + 4);

      const payload = {
        attachment_id: aid,
        week_number: weekNum,
        week_start_date: mondayDate.toISOString().split('T')[0],
        week_end_date: fridayDate.toISOString().split('T')[0]
      };
      console.log('📤 Sending payload:', payload);

      const response = await weeklyReviewService.createWeeklyReview(payload);
      console.log('✅ Response received:', response);
      
      // Update rate limit on success
      updateRateLimit(aid, weekNum, true);

      // Refresh reviews list
      const reviewsResponse = await weeklyReviewService.getReviewsByAttachment(aid);
      const reviewsArray = Array.isArray(reviewsResponse) ? reviewsResponse : reviewsResponse.data || reviewsResponse.reviews || [];
      setWeeklyReviews(reviewsArray);
      alert('Weekly review requested successfully!');
    } catch (error) {
      console.error('❌ Error requesting weekly review:', error);
      // Update rate limit on error
      updateRateLimit(aid, weekNum, false);
      alert(error.response?.data?.message || 'Failed to request weekly review. Please try again.');
    } finally {
      setIsRequestingReview(false);
    }
  };

  const allLogsFilled = weekLogs.length === 5 && 
                    weekLogs.every(log => log.status === 'submitted' || log.status === 'reviewed' || log.status === 'irrelevant') &&
                    weekLogs.some(log => log.status === 'submitted' || log.status === 'reviewed');
   const reviewExists = weeklyReviews.some(r => Number(r.week_number) === Number(getWeekNumber()));

  if (loading) {
    return (
      <div className={styles.card} style={{marginBottom: '1.25rem'}}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Loading logs...</span>
        </div>
        <div className={styles.cardBody} style={{padding: '2rem', textAlign: 'center'}}>
          <p>Please wait while we fetch your activity logs.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.card} style={{marginBottom: '1.25rem'}}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Error loading logs</span>
        </div>
        <div className={styles.cardBody} style={{padding: '2rem', textAlign: 'center'}}>
          <p style={{color: '#dc2626'}}>{error}</p>
        </div>
      </div>
    );
  }

  const isCurrentWeek = () => {
    const today = new Date();
    const startOfTodayWeek = new Date(today);
    const day = startOfTodayWeek.getDay();
    const diff = startOfTodayWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfTodayWeek.setDate(diff);
    startOfTodayWeek.setHours(0, 0, 0, 0);

    const startOfSelectedWeek = new Date(currentDate);
    const selDay = startOfSelectedWeek.getDay();
    const selDiff = startOfSelectedWeek.getDate() - selDay + (selDay === 0 ? -6 : 1);
    startOfSelectedWeek.setDate(selDiff);
    startOfSelectedWeek.setHours(0, 0, 0, 0);

    return startOfTodayWeek.getTime() === startOfSelectedWeek.getTime();
  };

  return (
    <div className={styles.card} style={{marginBottom: '1.25rem'}}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>
          {isCurrentWeek() ? "This week's logs" : "Weekly logs"} — Week {getWeekNumber()}
        </span>
      </div>
      <div className={styles.cardBody} style={{padding: '0.5rem 1.25rem'}}>
        {weekLogs.map((log, index) => (
          <div key={index} className={styles.logRow}>
            <div className={styles.logDateCol}>
              <div className={styles.logDay}>{log.day}</div>
              <div className={styles.logDate}>{log.date}</div>
            </div>
            <div className={styles.logTasks}>{log.tasks}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={`${styles.statusPill} ${getStatusPill(log.status)}`}>
                {getStatusText(log.status)}
              </span>
              {(log.status === 'draft' || log.status === 'missing') && log.status !== 'irrelevant' && (
                <button
                  onClick={() => log.status === 'draft' ? handleEditLog(log) : handleCreateLog(log.fullDate)}
                  className={styles.editButton}
                  title={log.status === 'draft' ? "Edit draft log" : "Create log"}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    borderRadius: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: '#6b7280' }}
                  >
                    {log.status === 'draft' ? (
                      <>
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </>
                    ) : (
                      <path d="M12 5v14M5 12h14" strokeWidth="2.5"></path>
                    )}
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}

        {attachment && allLogsFilled && !reviewExists && (
          <div className={styles.reviewRequestSection} style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '0.5px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--navy)' }}>Ready for weekly review</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--subtle)' }}>
                  All logs for Week {getWeekNumber()} are submitted.
                </p>
                {!rateLimitInfo.allowed && (
                  <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#dc2626' }}>
                    {rateLimitInfo.reason}
                  </p>
                )}
              </div>
              <button 
                className={styles.requestReviewBtn}
                onClick={handleRequestReview}
                disabled={isRequestingReview || !rateLimitInfo.allowed}
                style={{
                  padding: '0.6rem 1.2rem',
                  background: !rateLimitInfo.allowed ? '#9ca3af' : 'var(--blue)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: (isRequestingReview || !rateLimitInfo.allowed) ? 'not-allowed' : 'pointer',
                  opacity: isRequestingReview ? 0.7 : 1,
                  transition: 'all 0.2s',
                  marginLeft: '1rem'
                }}
              >
                {isRequestingReview ? 'Requesting...' : 'Request Weekly Review'}
              </button>
            </div>
          </div>
        )}

        {attachment && reviewExists && (
          <div className={styles.reviewRequestSection} style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '0.5px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--navy)' }}>Weekly review in progress</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--subtle)' }}>Your supervisors have been notified to review Week {getWeekNumber()}.</p>
              </div>
              <a 
                href="/student/reviews" 
                style={{
                  fontSize: '13px',
                  color: 'var(--blue)',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                View status →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyLogs;
