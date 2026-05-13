import React, { useState, useEffect } from 'react';
import styles from './AssignSupervisorModal.module.css';
import Button from '../../../shared/components/Button/Button';
import { studentApi } from '../services/studentServices';

const AssignSupervisorModal = ({ 
  isOpen, 
  onClose, 
  mode = 'single', 
  selectedStudents = [],
  onAssign 
}) => {
  const [supervisor, setSupervisor] = useState('');
  const [availableSupervisors, setAvailableSupervisors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch available supervisors
  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const response = await studentApi.getAvailableSupervisors();
        // Handle the new response structure
        const supervisors = response.supervisors || [];
        setAvailableSupervisors(Array.isArray(supervisors) ? supervisors : []);
      } catch (error) {
        console.error('Failed to fetch supervisors:', error);
        setAvailableSupervisors([]);
      }
    };
    
    if (isOpen) {
      fetchSupervisors();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!supervisor) return;
    
    console.log('Assigning supervisor:', supervisor);
    console.log('Selected students:', selectedStudents);
    
    setLoading(true);
    try {
      if (mode === 'single') {
        const studentId = selectedStudents[0]?.id;
        console.log('Single assignment - Student ID:', studentId, 'Supervisor ID:', supervisor);
        if (studentId) {
          await studentApi.assignSupervisor(studentId, supervisor);
        }
      } else {
        const assignments = selectedStudents.map(student => ({
          studentId: student.id,
          uni_supervisor_id: supervisor
        }));
        console.log('Bulk assignment:', assignments);
        await studentApi.bulkAssignSupervisors(assignments);
      }
      
      onAssign(supervisor);
      setSupervisor('');
    } catch (error) {
      console.error('Assignment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.overlay} ${styles.open}`}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>
            {mode === 'bulk' ? 'Bulk assign supervisor' : 'Assign supervisor'}
          </span>
          <Button 
            variant="ghost" 
            size="small"
            onClick={onClose}
            className={styles.modalClose}
          >
            ×
          </Button>
        </div>
        <div className={styles.modalBody}>
          {mode === 'single' ? (
            <div className={styles.modalField}>
              <div className={styles.modalFieldLabel}>Student</div>
              <div className={styles.studentDisplay}>
                {selectedStudents.length > 0 && selectedStudents[0]?.name}
                {selectedStudents.length > 0 && ' • '}
                {selectedStudents.length > 0 && selectedStudents[0]?.regNumber}
              </div>
            </div>
          ) : (
            <div className={styles.modalField}>
              <div className={styles.modalFieldLabel}>Selected students</div>
              <div className={styles.studentChips}>
                {selectedStudents.map((student, index) => (
                  <span key={index} className={styles.schip}>
                    {student.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className={styles.modalField}>
            <div className={styles.modalFieldLabel}>Supervisor</div>
            <select 
              className={styles.modalSelect}
              value={supervisor}
              onChange={(e) => setSupervisor(e.target.value)}
              disabled={loading}
            >
              <option value="">Select supervisor...</option>
              {availableSupervisors.map(supervisor => (
                <option 
                  key={supervisor.id} 
                  value={supervisor.id}
                  disabled={!supervisor.is_available}
                >
                  {supervisor.name} ({supervisor.current_student_count}/{supervisor.max_student_limit} students) 
                  {!supervisor.is_available && ' - FULL'}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className={styles.modalFooter}>
          <Button 
            variant="primary"
            onClick={handleSubmit}
            disabled={loading || !supervisor}
            loading={loading}
          >
            {mode === 'bulk' ? 'Assign to all' : 'Assign'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssignSupervisorModal;
