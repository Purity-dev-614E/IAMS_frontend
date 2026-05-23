import React from 'react';
import ApprovalOption from './ApprovalOption';
import styles from './ActiveReview.module.css';

const ActiveReview = ({
  review,
  approvalDecision,
  setApprovalDecision,
  comments,
  setComments,
  improvements,
  setImprovements,
  isSubmitting,
  formError,
  onSubmit
}) => {
  const student = review?.student || {};
  const dailyLogs = review?.logs || [];
  const weekLabel = review?.week ? `Week ${review.week}` : 'Weekly review';
  const studentMeta = [student.registration, student.program, 'JKUAT'].filter(Boolean).join(' - ');

  return (
    <main className={styles.pageContent}>
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.eye}>Weekly review request</div>
          <div className={styles.cardRow}>
            <div>
              <div className={styles.cardName}>{student.name || 'Student'}</div>
              <div className={styles.cardSub}>{studentMeta || 'Industrial attachment student'}</div>
            </div>
            <div className={styles.weekBadge}>
              <div className={styles.weekNumber}>{review?.week || '-'}</div>
              <div className={styles.weekLabel}>week</div>
            </div>
          </div>
          <div className={styles.meta}>
            <span><strong>Organization</strong> {student.organization || 'Not provided'}</span>
            <span><strong>Period</strong> {review?.period || 'Unavailable'}</span>
            <span><strong>Logs</strong> {review?.logsSubmitted || 0} of {review?.totalLogs || dailyLogs.length || 0} days</span>
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.logsHeader}>
          <span className={styles.logsTitle}>{weekLabel} daily logs</span>
          <span className={styles.logsSubtitle}>{review?.logsSubmitted || 0} of {review?.totalLogs || dailyLogs.length || 0} submitted</span>
        </div>

        {dailyLogs.length === 0 ? (
          <div className={styles.emptyLogs}>No daily logs were attached to this review.</div>
        ) : (
          dailyLogs.map((log) => (
            <article key={log.id} className={styles.logEntry}>
              <div className={styles.logEntryHeader}>
                <span className={styles.logDate}>{log.day}</span>
                <span className={`${styles.status} ${log.status === 'Submitted' ? styles.statusSubmitted : styles.statusNotSubmitted}`}>
                  {log.status}
                </span>
              </div>
              {log.tasks || log.skills || log.challenges ? (
                <>
                  {log.tasks && (
                    <div className={styles.logField}>
                      <div className={styles.logFieldLabel}>Tasks</div>
                      <div className={styles.logFieldText}>{log.tasks}</div>
                    </div>
                  )}
                  {log.skills && (
                    <div className={styles.logField}>
                      <div className={styles.logFieldLabel}>Skills</div>
                      <div className={styles.logFieldText}>{log.skills}</div>
                    </div>
                  )}
                  {log.challenges && (
                    <div className={styles.logField}>
                      <div className={styles.logFieldLabel}>Challenges</div>
                      <div className={styles.logFieldText}>{log.challenges}</div>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.noLogMessage}>No log submitted for this day.</div>
              )}
            </article>
          ))
        )}
      </section>

      <section className={styles.card}>
        <div className={styles.reviewHeader}>
          <div className={styles.reviewTitle}>Your review for {weekLabel}</div>
          <div className={styles.reviewSubtitle}>Your response is sent to the student and JKUAT supervisor.</div>
        </div>
        <div className={styles.reviewForm}>
          {formError && <div className={styles.formError}>{formError}</div>}

          <label>
            Approval decision <span className={styles.required}>*</span>
          </label>
          <div className={styles.approvalOptions}>
            <ApprovalOption
              type="approve"
              isSelected={approvalDecision === 'a'}
              onClick={() => setApprovalDecision('a')}
              label="Approve"
              sublabel="Activities satisfactory"
            />
            <ApprovalOption
              type="reject"
              isSelected={approvalDecision === 'r'}
              onClick={() => setApprovalDecision('r')}
              label="Reject"
              sublabel="Needs improvement"
            />
          </div>

          <label htmlFor="industry-comments">
            Comments <span className={styles.hint}>Required</span>
          </label>
          <textarea
            id="industry-comments"
            rows="4"
            value={comments}
            onChange={(event) => setComments(event.target.value)}
            placeholder="How did the intern perform this week? What did you observe about their work, attitude, and progress?"
          />

          <label htmlFor="industry-improvements">
            Improvements <span className={styles.hint}>Optional</span>
          </label>
          <textarea
            id="industry-improvements"
            rows="3"
            value={improvements}
            onChange={(event) => setImprovements(event.target.value)}
            placeholder="What should the intern focus on or do differently next week?"
          />

          <button
            className={styles.submitButton}
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : `Submit review for ${weekLabel}`}
          </button>
        </div>
      </section>
      <div className={styles.footerNote}>Link valid for 7 days - single use only - Questions: iams@jkuat.ac.ke</div>
    </main>
  );
};

export default ActiveReview;
