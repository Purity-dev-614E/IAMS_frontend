import React, { useState, useEffect } from 'react';
import { Flag, LoaderCircle, Search, UsersRound } from 'lucide-react';
import styles from './StudentList.module.css';
import { supervisorStudentsService } from '../../students/services/supervisorStudentsService';

const StudentList = ({ onStudentSelect, selectedStudent, overdueStudents = [], pendingFeedback = [] }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await supervisorStudentsService.getMyStudents();
      if (response.success) {
        const formatted = response.students.map(student => {
          const base = supervisorStudentsService.formatStudentForDisplay(student);
          const isOverdue = overdueStudents.some(os => os.regNumber === base.registration);
          const hasPendingFeedback = pendingFeedback.some(pf => pf.regNumber === base.registration);

          let status = base.reviewStatus || 'Industry pending';
          if (isOverdue) status = 'Overdue logs';
          else if (hasPendingFeedback) status = 'Needs feedback';

          const week6Summary =
            isOverdue ? 'Logs missing' :
            status === 'Needs feedback' ? 'Ready for review' :
            status === 'Reviewed' ? 'Reviewed' :
            status === 'Industry pending' ? 'Industry pending' :
            status === 'No active attachment' ? 'No active attachment' :
            'On track';

          const weeks1to5Summary =
            base.weeklyReviews?.length
              ? `${base.weeklyReviews.filter(review => review.status === 'complete' || review.uni_feedback_date).length} of ${base.weeklyReviews.length} reviewed`
              : 'No reviews yet';

          return {
            ...base,
            sub: `${base.registration} - ${base.organization || 'Not assigned'}`,
            regNumber: base.registration,
            organization: base.organization,
            status,
            week6Summary,
            weeks1to5Summary
          };
        });

        setStudents(formatted);

        if (formatted.length > 0 && !selectedStudent) {
          onStudentSelect(formatted[0]);
        }
      }
    } catch (err) {
      console.error('Error loading students for list:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesTab = (() => {
      switch (activeTab) {
        case 'all': return true;
        case 'needs': return student.status === 'Needs feedback' || student.status === 'Overdue logs';
        case 'flagged': return student.flagged;
        default: return true;
      }
    })();

    if (!matchesTab) return false;

    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;

    return [
      student.name,
      student.registration,
      student.regNumber,
      student.program,
      student.organization,
      student.status
    ].some(value => String(value || '').toLowerCase().includes(term));
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Needs feedback': return styles.pillNeeds;
      case 'Overdue logs': return styles.pillFlagged;
      case 'Reviewed': return styles.pillComplete;
      case 'Industry pending': return styles.pillPending;
      case 'No active attachment': return styles.pillGray;
      default: return styles.pillGray;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Assigned students ({students.length})</span>
        <div className={styles.filterTabs}>
          <button
            className={`${styles.ftab} ${activeTab === 'all' ? styles.active : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button
            className={`${styles.ftab} ${activeTab === 'needs' ? styles.active : ''}`}
            onClick={() => setActiveTab('needs')}
          >
            Action needed
          </button>
          <button
            className={`${styles.ftab} ${activeTab === 'flagged' ? styles.active : ''}`}
            onClick={() => setActiveTab('flagged')}
          >
            Flagged
          </button>
        </div>
      </div>

      <div className={styles.listTools}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search students..."
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.headerRow}>
        <div>STUDENT</div>
        <div>CURRENT WEEK</div>
        <div>PREVIOUS WEEKS</div>
        <div>STATUS</div>
        <div style={{ textAlign: 'center' }}>FLAG</div>
      </div>

      <div className={styles.cardBody}>
        {loading ? (
          <div className={styles.loadingState}>
            <LoaderCircle size={16} className={styles.spin} />
            Loading assigned students
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><UsersRound size={22} /></div>
            <div className={styles.emptyTitle}>
              {searchTerm
                ? 'No matching students'
                : activeTab === 'all' ? 'No assigned students yet' : 'No students need attention here'}
            </div>
            <p>
              {searchTerm
                ? 'Try searching by name, registration number, program, organization, or status.'
                : activeTab === 'all'
                ? 'Assigned students will appear here with their latest review status.'
                : 'This view will update when a student matches the selected status.'}
            </p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div
              key={student.id}
              className={`${styles.studentRow} ${selectedStudent?.id === student.id ? styles.selected : ''}`}
              onClick={() => onStudentSelect(student)}
            >
              <div>
                <div className={styles.sName}>{student.name}</div>
                <div className={styles.sSub}>{student.sub}</div>
              </div>

              <div className={styles.sProg}>
                <div className={styles.sProgText}>{student.week6Summary}</div>
              </div>

              <div className={styles.sProg}>
                <div className={styles.sProgText}>{student.weeks1to5Summary}</div>
              </div>

              <div>
                <span className={`${styles.statusPill} ${getStatusStyle(student.status)}`}>
                  {student.status}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  className={`${styles.flagBtn} ${student.flagged ? styles.flagged : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  title={student.flagged ? 'Remove flag' : 'Flag for follow up'}
                  aria-label={student.flagged ? 'Remove flag' : 'Flag for follow up'}
                >
                  <Flag size={14} fill={student.flagged ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentList;
