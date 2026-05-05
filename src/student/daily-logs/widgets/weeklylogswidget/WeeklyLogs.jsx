import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WeeklyLogs.module.css';
import { useDailyLogs } from '../../services/useDailyLogs';
import { attachmentService } from '../../../attachments/services/attachmentService';

const WeeklyLogs = () => {
  const navigate = useNavigate();
  const { logs, loading, error, fetchLogs } = useDailyLogs();
  const [weekLogs, setWeekLogs] = useState([]);
  const [attachment, setAttachment] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    // Fetch attachment data to get start date
    const fetchAttachment = async () => {
      try {
        const attachments = await attachmentService.getMyAttachments();
        if (attachments && attachments.length > 0) {
          // Get the active attachment (first one for now)
          const activeAttachment = attachments[0];
          setAttachment(activeAttachment);
        }
      } catch (error) {
        console.error('Error fetching attachment:', error);
      }
    };
    
    fetchAttachment();
  }, []);

  useEffect(() => {
    if (logs.length > 0) {
      // Get logs for the current week
      const today = new Date();
      const currentWeek = getWeekLogs(today, logs);
      setWeekLogs(currentWeek);
    }
  }, [logs]);

  const getWeekLogs = (today, allLogs) => {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 4); // Friday

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const currentWeekLogs = [];

    for (let i = 0; i < 5; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      const dateStr = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const logForDay = allLogs.find(log => {
        const logDate = new Date(log.logDate);
        return logDate.toDateString() === currentDate.toDateString();
      });

      
      currentWeekLogs.push({
        day: weekDays[i],
        date: dateStr,
        tasks: logForDay ? logForDay.tasksPerformed : '—',
        status: logForDay ? logForDay.status : (currentDate <= today ? 'missing' : 'upcoming'),
        logId: logForDay?.id || logForDay?.logId
      });
    }

    return currentWeekLogs;
  };

  const getStatusPill = (status) => {
    switch (status) {
      case 'submitted': return styles.pillSubmitted;
      case 'reviewed': return styles.pillVerified; // Use verified styling for reviewed
      case 'missing': return styles.pillMissing;
      case 'upcoming': return styles.pillUpcoming;
      case 'draft': return styles.pillSubmitted; // Use submitted styling for draft
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
      default: return '';
    }
  };

  const getWeekNumber = () => {
    if (!attachment || !attachment.startDate) {
      return 1; // Default to week 1 if no attachment data
    }
    
    const today = new Date();
    const attachmentStart = new Date(attachment.startDate);
    
    // Calculate difference in days
    const diffTime = Math.abs(today - attachmentStart);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate week number (weeks since attachment started)
    const weekNumber = Math.ceil(diffDays / 7);
    
    // Ensure week number is at least 1
    return Math.max(1, weekNumber);
  };

  const handleEditLog = (log) => {
    if (log.logId) {
      navigate(`/logs/edit/${log.logId}`, { state: { logData: log } });
    }
  };

  if (loading) {
    return (
      <div className={styles.card} style={{marginBottom: '1.25rem'}}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>This week's logs</span>
        </div>
        <div className={styles.cardBody} style={{padding: '2rem', textAlign: 'center'}}>
          <p>Loading logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.card} style={{marginBottom: '1.25rem'}}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>This week's logs</span>
        </div>
        <div className={styles.cardBody} style={{padding: '2rem', textAlign: 'center'}}>
          <p style={{color: '#dc2626'}}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card} style={{marginBottom: '1.25rem'}}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>This week's logs — Week {getWeekNumber()}</span>
        <a href="/logs" className={styles.cardAction}>View all logs</a>
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
              {log.status === 'draft' && log.logId && (
                <button
                  onClick={() => handleEditLog(log)}
                  className={styles.editButton}
                  title="Edit draft log"
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
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyLogs;
