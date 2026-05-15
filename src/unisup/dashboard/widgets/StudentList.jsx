import React, { useState, useEffect } from 'react';
import styles from './StudentList.module.css';
import WeekDots from './WeekDots';
import { supervisorStudentsService } from '../../students/services/supervisorStudentsService';

const StudentList = ({ onStudentSelect, selectedStudent, overdueStudents = [], pendingFeedback = [] }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await supervisorStudentsService.getMyStudents();
      if (response.success) {
        // Format each student for the list
        const formatted = response.students.map(s => {
          const isOverdue = overdueStudents.some(os => os.regNumber === s.reg_number);
          const hasPendingFeedback = pendingFeedback.some(pf => pf.regNumber === s.reg_number);
          
          let status = 'Reviewed';
          if (isOverdue) status = 'Overdue logs';
          else if (hasPendingFeedback) status = 'Needs feedback';

          return {
            id: s.id,
            name: s.student_name,
            sub: `${s.reg_number} · ${s.organization_name || 'Not assigned'}`,
            regNumber: s.reg_number,
            organization: s.organization_name,
            status: status,
            flagged: s.flagged || false,
            // These would normally come from specific week data in the response
            // For now using fallback logic similar to the service
            week6Summary: isOverdue ? 'Logs missing' : 'On track',
            weeks1to5Summary: 'Previous weeks ok'
          };
        });
        setStudents(formatted);
        
        // Auto-select first student if none selected
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
    switch (activeTab) {
      case 'all': return true;
      case 'needs': return student.status === 'Needs feedback' || student.status === 'Overdue logs';
      case 'flagged': return student.flagged;
      default: return true;
    }
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Needs feedback': return styles.pillNeeds;
      case 'Overdue logs': return styles.pillFlagged;
      case 'Reviewed': return styles.pillComplete;
      case 'Industry pending': return styles.pillPending;
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

      <div className={styles.headerRow}>
        <div>STUDENT</div>
        <div>CURRENT WEEK</div>
        <div>PREVIOUS WEEKS</div>
        <div>STATUS</div>
        <div style={{textAlign: 'center'}}>FLAG</div>
      </div>

      <div className={styles.cardBody}>
        {loading ? (
          <div className={styles.loadingState}>Loading students...</div>
        ) : filteredStudents.length === 0 ? (
          <div className={styles.emptyState}>No students found in this category.</div>
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

              <div style={{display: 'flex', justifyContent: 'center'}}>
                <button 
                  className={`${styles.flagBtn} ${student.flagged ? styles.flagged : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Toggle flag logic would go here
                  }}
                >
                  ⚑
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
