import React, { useState } from 'react';
import styles from './StudentList.module.css';
import WeekDots from './WeekDots';

const StudentList = ({ onStudentSelect, selectedStudent }) => {
  const [activeTab, setActiveTab] = useState('all');

  const students = [
    {
      id: 1,
      name: 'Purity Sang',
      sub: 'HDB212-0324/2022 · Safaricom PLC',
      week6Data: [
        { day: 'Mon', status: 'submitted' },
        { day: 'Tue', status: 'submitted' },
        { day: 'Wed', status: 'submitted' },
        { day: 'Thu', status: 'missing' },
        { day: 'Fri', status: 'upcoming' }
      ],
      week6Summary: '3 of 4 days',
      weeks1to5Data: [
        { status: 'complete' },
        { status: 'complete' },
        { status: 'complete' },
        { status: 'complete' },
        { status: 'complete' }
      ],
      weeks1to5Summary: 'All complete',
      status: 'Needs feedback',
      flagged: false
    },
    {
      id: 2,
      name: 'Grace Wanjiru',
      sub: 'HDB212-0204/2022 · KCB Group',
      week6Data: [
        { day: 'Mon', status: 'submitted' },
        { day: 'Tue', status: 'missing' },
        { day: 'Wed', status: 'missing' },
        { day: 'Thu', status: 'missing' },
        { day: 'Fri', status: 'upcoming' }
      ],
      week6Summary: '1 of 4 days',
      weeks1to5Data: [
        { status: 'complete' },
        { status: 'complete' },
        { status: 'complete' },
        { status: 'pending' },
        { status: 'pending' }
      ],
      weeks1to5Summary: '3 complete, 2 pending',
      status: 'Flagged',
      flagged: true
    },
    {
      id: 3,
      name: 'Kevin Ochieng',
      sub: 'HDB212-0156/2022 · Equity Bank',
      week6Data: [
        { day: 'Mon', status: 'submitted' },
        { day: 'Tue', status: 'submitted' },
        { day: 'Wed', status: 'submitted' },
        { day: 'Thu', status: 'submitted' },
        { day: 'Fri', status: 'upcoming' }
      ],
      week6Summary: '4 of 4 days',
      weeks1to5Data: [
        { status: 'complete' },
        { status: 'complete' },
        { status: 'complete' },
        { status: 'complete' },
        { status: 'complete' }
      ],
      weeks1to5Summary: 'All complete',
      status: 'Needs feedback',
      flagged: false
    },
    {
      id: 4,
      name: 'Amina Hassan',
      sub: 'HDB212-0317/2022 · Nation Media',
      week6Data: [
        { day: 'Mon', status: 'submitted' },
        { day: 'Tue', status: 'submitted' },
        { day: 'Wed', status: 'submitted' },
        { day: 'Thu', status: 'submitted' },
        { day: 'Fri', status: 'upcoming' }
      ],
      week6Summary: '4 of 4 days',
      weeks1to5Data: [
        { status: 'complete' },
        { status: 'complete' },
        { status: 'complete' },
        { status: 'complete' },
        { status: 'complete' }
      ],
      weeks1to5Summary: 'All complete',
      status: 'Reviewed',
      flagged: false
    },
    {
      id: 5,
      name: 'Brian Otieno',
      sub: 'HDB212-0112/2022 · KPLC',
      week6Data: [
        { day: 'Mon', status: 'submitted' },
        { day: 'Tue', status: 'submitted' },
        { day: 'Wed', status: 'submitted' },
        { day: 'Thu', status: 'submitted' },
        { day: 'Fri', status: 'upcoming' }
      ],
      week6Summary: '4 of 4 days',
      weeks1to5Data: [
        { status: 'complete' },
        { status: 'complete' },
        { status: 'complete' },
        { status: 'complete' },
        { status: 'complete' }
      ],
      weeks1to5Summary: 'All complete',
      status: 'Reviewed',
      flagged: false
    },
    {
      id: 6,
      name: 'Diana Muthoni',
      sub: 'HDB212-0278/2022 · Airtel Kenya',
      week6Data: [
        { day: 'Mon', status: 'submitted' },
        { day: 'Tue', status: 'submitted' },
        { day: 'Wed', status: 'draft' },
        { day: 'Thu', status: 'upcoming' },
        { day: 'Fri', status: 'upcoming' }
      ],
      week6Summary: '2 of 4 days',
      weeks1to5Data: [
        { status: 'complete' },
        { status: 'complete' },
        { status: 'complete' },
        { status: 'complete' },
        { status: 'pending' }
      ],
      weeks1to5Summary: '4 complete, 1 pending',
      status: 'Industry pending',
      flagged: false
    },
    {
      id: 7,
      name: 'James Kariuki',
      sub: 'HDB212-0091/2022 · NCBA Bank',
      week6Data: [
        { day: 'Mon', status: 'submitted' },
        { day: 'Tue', status: 'submitted' },
        { day: 'Wed', status: 'submitted' },
        { day: 'Thu', status: 'submitted' },
        { day: 'Fri', status: 'upcoming' }
      ],
      week6Summary: '4 of 4 days',
      weeks1to5Data: [
        { status: 'complete' },
        { status: 'complete' },
        { status: 'complete' },
        { status: 'complete' },
        { status: 'complete' }
      ],
      weeks1to5Summary: 'All complete',
      status: 'Reviewed',
      flagged: false
    },
    {
      id: 8,
      name: 'Lydia Chebet',
      sub: 'HDB212-0340/2022 · Safaricom PLC',
      week6Data: [
        { day: 'Mon', status: 'submitted' },
        { day: 'Tue', status: 'submitted' },
        { day: 'Wed', status: 'submitted' },
        { day: 'Thu', status: 'submitted' },
        { day: 'Fri', status: 'upcoming' }
      ],
      week6Summary: '4 of 4 days',
      weeks1to5Data: [
        { status: 'complete' },
        { status: 'complete' },
        { status: 'complete' },
        { status: 'complete' },
        { status: 'complete' }
      ],
      weeks1to5Summary: 'All complete',
      status: 'Reviewed',
      flagged: false
    }
  ];

  const filteredStudents = students.filter(student => {
    switch (activeTab) {
      case 'all': return true;
      case 'needs': return student.status === 'Needs feedback';
      case 'flagged': return student.flagged;
      default: return true;
    }
  });

  const getStatusPill = (status) => {
    switch (status) {
      case 'Needs feedback': return styles.pillNeeds;
      case 'Flagged': return styles.pillFlagged;
      case 'Reviewed': return styles.pillComplete;
      case 'Industry pending': return styles.pillPending;
      default: return '';
    }
  };

  const getWeeks1to5Dots = (data) => {
    return data.map((week, index) => {
      let color = styles.dotUpcoming;
      switch (week.status) {
        case 'complete': color = styles.dotComplete; break;
        case 'pending': color = styles.dotPending; break;
        default: color = styles.dotUpcoming;
      }
      return <div key={index} className={`${styles.wd} ${color}`} />;
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>All students</span>
        <div className={styles.filterTabs}>
          <button 
            className={`${styles.ftab} ${activeTab === 'all' ? styles.active : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({students.length})
          </button>
          <button 
            className={`${styles.ftab} ${activeTab === 'needs' ? styles.active : ''}`}
            onClick={() => setActiveTab('needs')}
          >
            Needs feedback ({students.filter(s => s.status === 'Needs feedback').length})
          </button>
          <button 
            className={`${styles.ftab} ${activeTab === 'flagged' ? styles.active : ''}`}
            onClick={() => setActiveTab('flagged')}
          >
            Flagged ({students.filter(s => s.flagged).length})
          </button>
        </div>
      </div>

      {/* Header row */}
      <div className={styles.headerRow}>
        <div>Student</div>
        <div>This week</div>
        <div>Weeks 1–5</div>
        <div>Status</div>
        <div>Flag</div>
      </div>

      {/* Student rows */}
      {filteredStudents.map(student => (
        <div 
          key={student.id}
          className={`${styles.studentRow} ${selectedStudent?.id === student.id ? styles.selected : ''}`}
          onClick={() => onStudentSelect(student)}
        >
          <div>
            <div className={styles.sName}>{student.name}</div>
            <div className={styles.sSub}>{student.sub}</div>
          </div>
          <div>
            <WeekDots data={student.week6Data} summary={student.week6Summary} />
          </div>
          <div>
            <WeekDots data={student.weeks1to5Data} summary={student.weeks1to5Summary} />
          </div>
          <span className={`${styles.statusPill} ${getStatusPill(student.status)}`}>
            {student.status}
          </span>
          <button 
            className={`${styles.flagBtn} ${student.flagged ? styles.flagged : ''}`}
            title={student.flagged ? 'Remove flag' : 'Flag student'}
          >
            ⚑
          </button>
        </div>
      ))}
    </div>
  );
};

export default StudentList;
