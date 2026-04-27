import React from 'react';
import ApprovalOption from './ApprovalOption';
import styles from './ActiveReview.module.css';

const ActiveReview = ({ 
  approvalDecision, 
  setApprovalDecision, 
  comments, 
  setComments, 
  improvements, 
  setImprovements, 
  isSubmitting, 
  onSubmit 
}) => {
  const studentData = {
    name: 'Purity Chelagat Sang',
    id: 'HDB212-0324/2022 · BBIT · JKUAT',
    organization: 'Safaricom PLC',
    period: '31 Mar - 4 Apr 2025',
    week: 6,
    logsSubmitted: 4,
    totalLogs: 5
  };

  const dailyLogs = [
    { 
      day: 'Monday, 31 March', 
      status: 'Submitted', 
      tasks: 'Attended morning stand-up, reviewed codebase documentation, set up local dev environment for new microservice module.', 
      skills: 'Technical documentation, Git workflow, microservice architecture basics.' 
    },
    { 
      day: 'Tuesday, 1 April', 
      status: 'Submitted', 
      tasks: 'Implemented user authentication module using JWT. Fixed session timeout bug affecting mobile clients.', 
      skills: 'JWT authentication, session management, mobile debugging.' 
    },
    { 
      day: 'Wednesday, 2 April', 
      status: 'Submitted', 
      tasks: 'Wrote unit tests for API endpoints. Attended code review session, received feedback on naming conventions.', 
      skills: 'Unit testing, Jest, code review best practices.' 
    },
    { 
      day: 'Thursday, 3 April', 
      status: 'Submitted', 
      tasks: 'API integration for payments module. Sprint review presentation. Refactored auth service.', 
      skills: 'REST API integration, sprint presentations, refactoring patterns.' 
    },
    { 
      day: 'Friday, 4 April', 
      status: 'Not submitted', 
      tasks: null, 
      skills: null 
    }
  ];

  return (
    <div className={styles.pageContent}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.eye}>Weekly review request</div>
          <div className={styles.cardRow}>
            <div>
              <div className={styles.cardName}>{studentData.name}</div>
              <div className={styles.cardSub}>{studentData.id}</div>
            </div>
            <div className={styles.weekBadge}>
              <div className={styles.weekNumber}>{studentData.week}</div>
              <div className={styles.weekLabel}>week</div>
            </div>
          </div>
          <div className={styles.meta}>
            <span><strong>Organization</strong> {studentData.organization}</span>
            <span><strong>Period</strong> {studentData.period}</span>
            <span><strong>Logs</strong> {studentData.logsSubmitted} of {studentData.totalLogs} days</span>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.logsHeader}>
          <span className={styles.logsTitle}>Week {studentData.week} daily logs</span>
          <span className={styles.logsSubtitle}>{studentData.logsSubmitted} of {studentData.totalLogs} submitted</span>
        </div>
        
        {dailyLogs.map((log, index) => (
          <div key={index} className={styles.logEntry}>
            <div className={styles.logEntryHeader}>
              <span className={styles.logDate}>{log.day}</span>
              <span className={`${styles.status} ${log.status === 'Submitted' ? styles.statusSubmitted : styles.statusNotSubmitted}`}>
                {log.status}
              </span>
            </div>
            {log.tasks ? (
              <>
                <div className={styles.logField}>
                  <div className={styles.logFieldLabel}>Tasks</div>
                  <div className={styles.logFieldText}>{log.tasks}</div>
                </div>
                <div className={styles.logField}>
                  <div className={styles.logFieldLabel}>Skills</div>
                  <div className={styles.logFieldText}>{log.skills}</div>
                </div>
              </>
            ) : (
              <div className={styles.noLogMessage}>No log submitted for this day.</div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.reviewHeader}>
          <div className={styles.reviewTitle}>Your review for Week {studentData.week}</div>
          <div className={styles.reviewSubtitle}>Your response is sent to the student and JKUAT supervisor.</div>
        </div>
        <div className={styles.reviewForm}>
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
          
          <label>
            Comments <span className={styles.hint}>Required</span>
          </label>
          <textarea 
            rows="4" 
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="How did the intern perform this week? What did you observe about their work, attitude, and progress?"
          />
          
          <label>
            Improvements <span className={styles.hint}>Optional</span>
          </label>
          <textarea 
            rows="2" 
            value={improvements}
            onChange={(e) => setImprovements(e.target.value)}
            placeholder="What should the intern focus on or do differently next week?"
          />
          
          <button 
            className={styles.submitButton} 
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : `Submit review for Week ${studentData.week}`}
          </button>
        </div>
      </div>
      <div className={styles.footerNote}>Link valid 7 days · single use only · Questions: iams@jkuat.ac.ke</div>
    </div>
  );
};

export default ActiveReview;
