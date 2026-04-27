import React, { useState } from 'react';
import styles from './AssignSupervisorModal.module.css';

const AssignSupervisorModal = ({ 
  isOpen, 
  onClose, 
  mode = 'single', 
  selectedStudents = [],
  onAssign 
}) => {
  const [supervisor, setSupervisor] = useState('');

  const supervisors = [
    { id: 1, name: 'Dr. Francis Kamau', load: 8 },
    { id: 2, name: 'Dr. Omondi', load: 7 },
    { id: 3, name: 'Dr. Waweru', load: 6 },
    { id: 4, name: 'Dr. Alice Njoroge', load: 0, pending: true }
  ];

  const handleSubmit = () => {
    if (!supervisor) return;
    onAssign(supervisor);
    onClose();
    setSupervisor('');
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.overlay} ${styles.open}`}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>
            {mode === 'bulk' ? 'Bulk assign supervisor' : 'Assign supervisor'}
          </span>
          <button className={styles.modalClose} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          {mode === 'single' ? (
            <div className={styles.modalField}>
              <div className={styles.modalFieldLabel}>Student</div>
              <div className={styles.studentDisplay}>
                Brian Otieno â HDB212-0112/2022
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
            <div className={styles.modalFieldLabel}>Assign university supervisor</div>
            <select 
              value={supervisor}
              onChange={(e) => setSupervisor(e.target.value)}
            >
              <option value="">Select supervisor...</option>
              {supervisors.map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup.name} ({sup.load} students{sup.pending ? ' â pending approval' : ''})
                </option>
              ))}
            </select>
            <div className={styles.modalFieldHint}>
              Current load shown in brackets. Pending supervisors cannot be assigned until approved.
            </div>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.btnGhost} onClick={onClose}>
            Cancel
          </button>
          <button 
            className={styles.btnPrimary} 
            onClick={handleSubmit}
            disabled={!supervisor}
          >
            {mode === 'bulk' ? 'Confirm assignment' : 'Save assignment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignSupervisorModal;
