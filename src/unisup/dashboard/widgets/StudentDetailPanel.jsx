import React, { useState, useEffect } from 'react';
import { Check, ChevronRight, FileText, LoaderCircle } from 'lucide-react';
import styles from './StudentDetailPanel.module.css';
import { studentDataService } from '../../../student/reports/services/studentDataService';
import { supervisorReviewService } from '../../student/review/services/supervisorReviewService';

const StudentDetailPanel = ({ student }) => {
  const [expandedWeeks, setExpandedWeeks] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [activeAttachment, setActiveAttachment] = useState(null);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [weeklyReviews, setWeeklyReviews] = useState([]);
  const [progress, setProgress] = useState(0);
  const [feedbackDrafts, setFeedbackDrafts] = useState({});
  const [submittingReviewId, setSubmittingReviewId] = useState(null);

  useEffect(() => {
    if (student?.id) {
      loadStudentDetails();
    }
  }, [student?.id]);

  const loadStudentDetails = async () => {
    try {
      setLoading(true);
      // 1. Get attachments to find the active one
      const attachmentsRes = await studentDataService.getStudentAttachments(student.id);
      const active = attachmentsRes.attachments?.find(att => att.status === 'active') || attachmentsRes.attachments?.[0];
      
      if (active) {
        setActiveAttachment(active);
        
        // 2. Calculate progress
        const start = new Date(active.start_date);
        const end = new Date(active.end_date);
        const today = new Date();
        if (today > end) setProgress(100);
        else if (today < start) setProgress(0);
        else {
          const total = end - start;
          const elapsed = today - start;
          setProgress(Math.round((elapsed / total) * 100));
        }

        // 3. Get daily logs and weekly reviews for this attachment
        const [logsRes, reviewsRes] = await Promise.all([
          studentDataService.getDailyLogs({ attachmentId: active.id, limit: 100 }),
          studentDataService.getWeeklyReviews({ attachmentId: active.id })
        ]);

        setDailyLogs(logsRes.logs || []);
        
        const sortedReviews = (reviewsRes.reviews || []).sort((a, b) => b.week_number - a.week_number);
        setWeeklyReviews(sortedReviews);

        // Auto-expand the latest week
        if (sortedReviews.length > 0) {
          setExpandedWeeks(new Set([sortedReviews[0].week_number.toString()]));
        }
      } else {
        setActiveAttachment(null);
        setDailyLogs([]);
        setWeeklyReviews([]);
        setProgress(0);
      }
    } catch (error) {
      console.error('Error loading student details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (!student) {
    return (
      <div className={styles.detailPanel}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}><FileText size={28} /></div>
          <h3>Select a student</h3>
          <p>Click on a student from the list to view their detailed information and weekly reviews.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.detailPanel}>
        <div className={styles.loadingState}>
          <LoaderCircle size={18} className={styles.spin} />
          Loading student details
        </div>
      </div>
    );
  }

  const toggleWeek = (weekNum) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekNum.toString())) {
      newExpanded.delete(weekNum.toString());
    } else {
      newExpanded.add(weekNum.toString());
    }
    setExpandedWeeks(newExpanded);
  };

  const getLogsForWeek = (week) => {
    const start = new Date(week.week_start_date);
    const end = new Date(week.week_end_date);
    
    return dailyLogs.filter(log => {
      const logDate = new Date(log.log_date);
      return logDate >= start && logDate <= end;
    }).sort((a, b) => new Date(a.log_date) - new Date(b.log_date));
  };

  const formatDateRange = (start, end) => {
    if (!start || !end) return '';
    const s = new Date(start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const e = new Date(end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${s} - ${e}`;
  };

  const hasIndustryFeedback = (week) => supervisorReviewService.hasIndustryFeedback(week);
  const hasUniversityFeedback = (week) => supervisorReviewService.hasUniversityFeedback(week);
  const getIndustryFeedback = (week) => supervisorReviewService.normalizeIndustryFeedback(week, activeAttachment);
  const getUniversityFeedback = (week) => supervisorReviewService.normalizeUniversityFeedback(week);

  const getReviewStatusLabel = (week) => {
    if (hasUniversityFeedback(week)) return 'Complete';
    if (hasIndustryFeedback(week)) return 'Needs feedback';
    return 'Industry pending';
  };

  const updateFeedbackDraft = (reviewId, field, value) => {
    setFeedbackDrafts(prev => ({
      ...prev,
      [reviewId]: {
        ...(prev[reviewId] || {}),
        [field]: value
      }
    }));
  };

  const submitFeedback = async (week) => {
    const draft = feedbackDrafts[week.id] || {};
    const comments = (draft.comments || '').trim();
    const improvements = (draft.improvements || '').trim();

    if (!comments) return;

    try {
      setSubmittingReviewId(week.id);
      await supervisorReviewService.submitUniversityFeedback(week.id, {
        comments,
        improvements
      });

      setWeeklyReviews(prev => prev.map(review => (
        review.id === week.id
          ? {
              ...review,
              status: 'complete',
              uni_comments: comments,
              uni_improvements: improvements,
              uni_feedback_date: new Date().toISOString()
            }
          : review
      )));
      setFeedbackDrafts(prev => {
        const next = { ...prev };
        delete next[week.id];
        return next;
      });
    } catch (error) {
      console.error('Error submitting supervisor feedback:', error);
    } finally {
      setSubmittingReviewId(null);
    }
  };

  const initials = student.name ? student.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';

  return (
    <div className={styles.detailPanel}>
      {/* Student header */}
      <div className={styles.studentHeader}>
        <div className={styles.shTop}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <div className={styles.shAvatar}>{initials}</div>
            <div>
              <div className={styles.shName}>{student.name}</div>
              <div className={styles.shSub}>{student.regNumber || student.registration} - {student.program}</div>
            </div>
          </div>
        </div>
        <span className={`${styles.statusPill} ${activeAttachment?.status === 'active' ? styles.pillActive : styles.pillGray}`} style={{flexShrink: 0}}>
          {activeAttachment?.status ? (activeAttachment.status.charAt(0).toUpperCase() + activeAttachment.status.slice(1)) : 'No Active Attachment'}
        </span>
      </div>
      
      <div className={styles.shMeta}>
        <div className={styles.shRow}>
          <span className={styles.shKey}>Organization</span>
          <span className={styles.shVal}>{activeAttachment?.organization_name || 'Not assigned'}</span>
        </div>
        <div className={styles.shRow}>
          <span className={styles.shKey}>Industry sup.</span>
          <span className={styles.shVal}>{activeAttachment?.industry_supervisor_name || 'Not assigned'}</span>
        </div>
        <div className={styles.shRow}>
          <span className={styles.shKey}>Period</span>
          <span className={styles.shVal}>{formatDateRange(activeAttachment?.start_date, activeAttachment?.end_date)}</span>
        </div>
      </div>
      
      <div className={styles.progWrap}>
        <div className={styles.progLabelRow}>
          <span>Attachment progress</span>
          <span style={{fontWeight: '500', color: 'var(--navy)'}}>{progress}%</span>
        </div>
        <div className={styles.progTrack}>
          <div className={styles.progFill} style={{width: `${progress}%`}}></div>
        </div>
      </div>

      {/* Weekly reviews accordion */}
      <div className={styles.reviewPanel}>
        <div className={styles.rpHeader}>
          <span className={styles.rpTitle}>Weekly reviews</span>
          {weeklyReviews.some(r => hasIndustryFeedback(r) && !hasUniversityFeedback(r)) && (
            <span className={`${styles.statusPill} ${styles.pillNeeds}`}>
              {weeklyReviews.filter(r => hasIndustryFeedback(r) && !hasUniversityFeedback(r)).length} need feedback
            </span>
          )}
        </div>

        {weeklyReviews.length === 0 ? (
          <div className={styles.emptyState} style={{padding: '2rem 0'}}>
            <p>No weekly reviews generated yet for this student.</p>
          </div>
        ) : (
          weeklyReviews.map(week => {
            const weekLogs = getLogsForWeek(week);
            const isExpanded = expandedWeeks.has(week.week_number.toString());
            const statusLabel = getReviewStatusLabel(week);
            const needsFeedback = hasIndustryFeedback(week) && !hasUniversityFeedback(week);
            const industryFeedback = getIndustryFeedback(week);
            const universityFeedback = getUniversityFeedback(week);
            const draft = feedbackDrafts[week.id] || {};
            const isSubmitting = submittingReviewId === week.id;
            
            return (
              <div key={week.id} className={styles.weekItem}>
                <div 
                  className={styles.weekToggle} 
                  onClick={() => toggleWeek(week.week_number)}
                >
                  <div className={styles.wtLeft}>
                    <div>
                      <div className={styles.wtNum}>Week {week.week_number}</div>
                      <div className={styles.wtDates}>{formatDateRange(week.week_start_date, week.week_end_date)}</div>
                    </div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <span className={`${styles.statusPill} ${needsFeedback ? styles.pillNeeds : hasUniversityFeedback(week) ? styles.pillComplete : styles.pillGray}`}>
                      {statusLabel}
                    </span>
                    <ChevronRight size={14} className={`${styles.wtChevron} ${isExpanded ? styles.open : ''}`} />
                  </div>
                </div>
                
                <div className={`${styles.weekBody} ${isExpanded ? styles.open : ''}`}>
                  {/* Daily logs for this week */}
                  {weekLogs.length === 0 ? (
                    <div className={styles.logEntry}>
                      <div className={styles.leContent} style={{fontStyle: 'italic', color: 'var(--subtle)'}}>
                        No daily logs submitted for this week.
                      </div>
                    </div>
                  ) : (
                    weekLogs.map((log, index) => (
                      <div key={log.id || index} className={styles.logEntry}>
                        <div className={styles.leTop}>
                          <span className={styles.leDay}>
                            {new Date(log.log_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
                          </span>
                          <span className={`${styles.statusPill} ${log.status === 'submitted' ? styles.pillActive : styles.pillGray}`} style={{fontSize: '10px'}}>
                            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                          </span>
                        </div>
                        <div className={styles.leContent}>
                          {log.tasks_performed}
                        </div>
                      </div>
                    ))
                  )}

                  {/* Industry feedback block */}
                  {!industryFeedback.waiting && (
                    <div className={styles.industryBlock}>
                      <div className={styles.ibLabel}>Industry supervisor - {industryFeedback.supervisorName}</div>
                      <div className={styles.ibText}>{industryFeedback.comments}</div>
                      {industryFeedback.improvements && (
                        <div className={styles.ibText} style={{marginTop: '4px', borderTop: '0.5px dashed var(--border)', paddingTop: '4px'}}>
                          <strong>Recommendations:</strong> {industryFeedback.improvements}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Feedback form (Supervisor view) */}
                  {needsFeedback && (
                    <div className={styles.feedbackForm}>
                      <div className={styles.ffLabel}>Your feedback - Week {week.week_number}</div>
                      <textarea
                        placeholder="Academic comments for this week..."
                        value={draft.comments || ''}
                        onChange={(event) => updateFeedbackDraft(week.id, 'comments', event.target.value)}
                      />
                      <div className={styles.ffRow}>
                        <textarea
                          placeholder="Improvements / recommendations..."
                          style={{minHeight: '55px'}}
                          value={draft.improvements || ''}
                          onChange={(event) => updateFeedbackDraft(week.id, 'improvements', event.target.value)}
                        />
                      </div>
                      <button
                        className={styles.submitBtn}
                        onClick={() => submitFeedback(week)}
                        disabled={isSubmitting || !(draft.comments || '').trim()}
                      >
                        {isSubmitting ? 'Submitting...' : `Submit feedback for Week ${week.week_number}`}
                      </button>
                    </div>
                  )}

                  {/* Submitted Feedback display */}
                  {universityFeedback?.comments && (
                    <div className={styles.awaitingBlock}>
                      <Check size={14} />
                      <span>
                        Feedback submitted on {universityFeedback.submittedDate ? new Date(universityFeedback.submittedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'today'}:
                        "{universityFeedback.comments}"
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentDetailPanel;
