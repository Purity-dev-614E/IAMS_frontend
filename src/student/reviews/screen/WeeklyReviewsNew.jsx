import React from 'react';
import styles from './WeeklyReviewsNew.module.css';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';
import { studentNavigation } from '../../../shared/components/AppSidebar/sidebarConfig';
import ReviewsTopbar from '../widgets/ReviewsTopbar';
import ProgressSummary from '../widgets/ProgressSummary';
import ReviewCard from '../widgets/ReviewCard';

const WeeklyReviews = () => {
  const user = {
    name: 'Purity Sang',
    role: 'Student · BBIT',
    initials: 'PS'
  };

  const week6Data = {
    week: 6,
    title: 'Week 6 — current week',
    dates: '31 Mar – 4 Apr 2025',
    logsSubmitted: 4,
    totalLogs: 5,
    status: 'in-progress',
    stages: [
      { label: 'Logs', status: 'done' },
      { label: 'Industry', status: 'waiting' },
      { label: 'Uni supervisor', status: 'pending' }
    ],
    isCurrent: true,
    isExpanded: true,
    dailyLogs: [
      {
        day: 'Monday',
        date: '31 Mar',
        text: 'Attended morning stand-up, reviewed codebase documentation, set up local dev environment for new microservice module.',
        status: 'active',
        statusText: 'Submitted'
      },
      {
        day: 'Tuesday',
        date: '1 Apr',
        text: 'Implemented user authentication module using JWT. Fixed session timeout bug affecting mobile clients.',
        status: 'active',
        statusText: 'Submitted'
      },
      {
        day: 'Wednesday',
        date: '2 Apr',
        text: 'Wrote unit tests for API endpoints. Attended code review session and received feedback on naming conventions.',
        status: 'active',
        statusText: 'Submitted'
      },
      {
        day: 'Thursday',
        date: '3 Apr',
        text: 'No log submitted yet',
        missing: true,
        status: 'missing',
        statusText: 'Missing'
      },
      {
        day: 'Friday',
        date: '4 Apr',
        text: 'Not yet — upcoming',
        missing: true,
        status: 'upcoming',
        statusText: 'Upcoming'
      }
    ],
    industryFeedback: {
      name: 'James Mwangi',
      role: 'Industry Supervisor · Safaricom PLC',
      initials: 'JM',
      status: 'complete',
      comments: 'Good progress this week on authentication module. She is picking up codebase well and showing good initiative in stand-ups. Encourage her to ask more questions — she clearly has them but holds back.',
      improvements: 'Write more detailed commit messages — team standard is to explain the why, not just the what.'
    },
    uniFeedback: {
      name: 'Dr. F. Kamau',
      role: 'University Supervisor · JKUAT',
      initials: 'FK',
      status: 'awaiting',
      awaitingMessage: 'Dr. Kamau has been notified and will submit academic feedback once the week ends and all logs are in. This usually takes 2–3 days.'
    }
  };

  const week5Data = {
    week: 5,
    title: 'Week 5',
    dates: '24 Mar – 28 Mar 2025',
    logsSubmitted: 5,
    totalLogs: 5,
    status: 'complete',
    stages: [
      { label: 'Logs', status: 'done' },
      { label: 'Industry', status: 'done' },
      { label: 'Uni', status: 'done' }
    ],
    industryFeedback: {
      name: 'James Mwangi',
      role: 'Industry Supervisor',
      initials: 'JM',
      status: 'complete',
      comments: 'Strong week overall. She completed the database migration task ahead of schedule and helped another intern debug their script.',
      improvements: 'Test edge cases more thoroughly before marking tasks as done.'
    },
    uniFeedback: {
      name: 'Dr. F. Kamau',
      role: 'University Supervisor · JKUAT',
      initials: 'FK',
      status: 'complete',
      comments: 'Good progress this week. The log entries are detailed and well-written. I can see you are applying your database coursework in a real context which is exactly what this attachment is for.',
      improvements: 'Focus on documenting not just what you did but what you would do differently — reflective writing will strengthen your final report.'
    }
  };

  const week4Data = {
    week: 4,
    title: 'Week 4',
    dates: '17 Mar – 21 Mar 2025',
    logsSubmitted: 5,
    totalLogs: 5,
    status: 'complete'
  };

  const week3Data = {
    week: 3,
    title: 'Week 3',
    dates: '10 Mar – 14 Mar 2025',
    logsSubmitted: 5,
    totalLogs: 5,
    status: 'complete'
  };

  return (
    <div className={styles.shell}>
      <AppSidebar navigationItems={studentNavigation} user={user} />
      
      <div className={styles.main}>
        <ReviewsTopbar />
        
        <div className={styles.content}>
          <div className={styles.pageInner}>
            <ProgressSummary />
            
            <ReviewCard {...week6Data} />
            <ReviewCard {...week5Data} />
            <ReviewCard {...week4Data} />
            <ReviewCard {...week3Data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReviews;
