import React, { useState } from 'react';
import styles from './StudentDetailPanel.module.css';

const StudentDetailPanel = ({ student }) => {
  const [expandedWeeks, setExpandedWeeks] = useState(new Set(['6']));
  
  if (!student) {
    return (
      <div className={styles.detailPanel}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>⊞</div>
          <h3>Select a student</h3>
          <p>Click on a student from the list to view their detailed information and weekly reviews.</p>
        </div>
      </div>
    );
  }

  const toggleWeek = (weekNum) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekNum)) {
      newExpanded.delete(weekNum);
    } else {
      newExpanded.add(weekNum);
    }
    setExpandedWeeks(newExpanded);
  };

  const weeks = [
    {
      num: '6',
      label: 'Week 6 — current',
      dates: '31 Mar – 4 Apr 2025',
      status: 'Needs feedback',
      logs: [
        { day: 'Monday 31 Mar', status: 'Submitted', content: 'Attended morning stand-up, reviewed codebase documentation, set up local dev environment for new microservice.' },
        { day: 'Tuesday 1 Apr', status: 'Submitted', content: 'Implemented user authentication module using JWT. Fixed session timeout bug affecting mobile clients.' },
        { day: 'Wednesday 2 Apr', status: 'Submitted', content: 'Wrote unit tests for API endpoints. Attended code review session, received feedback on naming conventions.' },
        { day: 'Thursday 3 Apr', status: 'Not logged', content: 'No log submitted for this day.', contentStyle: 'italic' },
        { day: 'Friday 4 Apr', status: 'Upcoming', content: '' }
      ],
      industryFeedback: {
        supervisor: 'Industry supervisor · James Mwangi',
        text: 'Good progress on the authentication module. Encourage her to ask more questions during stand-ups — she is clearly capable but holds back.'
      }
    },
    {
      num: '5',
      label: 'Week 5',
      dates: '24 Mar – 28 Mar 2025',
      status: 'Complete',
      logs: [],
      submittedFeedback: {
        date: '29 Mar 2025',
        text: 'Good progress this week. Focus on cleaner commit messages and better API documentation.'
      }
    },
    {
      num: '4',
      label: 'Week 4',
      dates: '17 Mar – 21 Mar 2025',
      status: 'Complete',
      logs: []
    }
  ];

  return (
    <div className={styles.detailPanel}>
      {/* Student header */}
      <div className={styles.studentHeader}>
        <div className={styles.shTop}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <div className={styles.shAvatar}>PS</div>
            <div>
              <div className={styles.shName}>{student.name}</div>
              <div className={styles.shSub}>{student.sub}</div>
            </div>
          </div>
        </div>
        <span className={`${styles.statusPill} ${styles.pillActive}`} style={{flexShrink: 0}}>Active</span>
      </div>
      <div className={styles.shMeta}>
        <div className={styles.shRow}>
          <span className={styles.shKey}>Organization</span>
          <span className={styles.shVal}>{student.org || 'Safaricom PLC'}</span>
        </div>
        <div className={styles.shRow}>
          <span className={styles.shKey}>Industry sup.</span>
          <span className={styles.shVal}>{student.industrySup || 'James Mwangi'}</span>
        </div>
        <div className={styles.shRow}>
          <span className={styles.shKey}>Period</span>
          <span className={styles.shVal}>{student.period || '17 Feb – 2 May 2025'}</span>
        </div>
      </div>
      <div className={styles.progWrap}>
        <div className={styles.progLabelRow}>
          <span>Attachment progress</span>
          <span style={{fontWeight: '500', color: 'var(--navy)'}}>74%</span>
        </div>
        <div className={styles.progTrack}>
          <div className={styles.progFill} style={{width: '74%'}}></div>
        </div>
      </div>

      {/* Weekly reviews accordion */}
      <div className={styles.reviewPanel}>
        <div className={styles.rpHeader}>
          <span className={styles.rpTitle}>Weekly reviews</span>
          <span className={`${styles.statusPill} ${styles.pillNeeds}`}>2 need feedback</span>
        </div>

        {weeks.map(week => (
          <div key={week.num} className={styles.weekItem}>
            <div 
              className={styles.weekToggle} 
              onClick={() => toggleWeek(week.num)}
            >
              <div className={styles.wtLeft}>
                <div>
                  <div className={styles.wtNum}>{week.label}</div>
                  <div className={styles.wtDates}>{week.dates}</div>
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span className={`${styles.statusPill} ${week.status === 'Needs feedback' ? styles.pillNeeds : week.status === 'Complete' ? styles.pillComplete : ''}`}>
                  {week.status}
                </span>
                <span className={`${styles.wtChevron} ${expandedWeeks.has(week.num) ? styles.open : ''}`}>›</span>
              </div>
            </div>
            
            <div className={`${styles.weekBody} ${expandedWeeks.has(week.num) ? styles.open : ''}`}>
              {/* Daily logs */}
              {week.logs.map((log, index) => (
                <div key={index} className={styles.logEntry}>
                  <div className={styles.leTop}>
                    <span className={styles.leDay}>{log.day}</span>
                    <span className={`${styles.statusPill} ${log.status === 'Submitted' ? styles.pillActive : log.status === 'Not logged' ? styles.pillMissing : ''}`} style={{fontSize: '10px'}}>
                      {log.status}
                    </span>
                  </div>
                  <div 
                    className={styles.leContent} 
                    style={{
                      color: log.contentStyle === 'italic' ? 'var(--subtle)' : 'var(--muted)',
                      fontStyle: log.contentStyle || 'normal'
                    }}
                  >
                    {log.content}
                  </div>
                </div>
              ))}

              {/* Industry feedback block */}
              {week.industryFeedback && (
                <div className={styles.industryBlock}>
                  <div className={styles.ibLabel}>{week.industryFeedback.supervisor}</div>
                  <div className={styles.ibText}>{week.industryFeedback.text}</div>
                </div>
              )}

              {/* Feedback form */}
              {week.status === 'Needs feedback' && (
                <div className={styles.feedbackForm}>
                  <div className={styles.ffLabel}>Your feedback — Week {week.num}</div>
                  <textarea placeholder="Academic comments for this week…"></textarea>
                  <div className={styles.ffRow}>
                    <textarea placeholder="Improvements / recommendations…" style={{minHeight: '55px'}}></textarea>
                  </div>
                  <button className={styles.submitBtn}>Submit feedback for Week {week.num}</button>
                </div>
              )}

              {/* Awaiting state */}
              {week.submittedFeedback && (
                <div className={styles.awaitingBlock}>
                  <span>✓</span>
                  <span>You submitted feedback on {week.submittedFeedback.date}. "{week.submittedFeedback.text}"</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDetailPanel;
