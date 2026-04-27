import React, { useState } from 'react';
import styles from './UserModal.module.css';

const UserModal = ({ isOpen, onClose, mode = 'create', user = null }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    role: user?.role || 'student',
    status: user?.status || 'active',
    tempPassword: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form data:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.overlay} ${styles.open}`}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>
            {mode === 'create' ? 'Create user' : 'Edit user'}
          </span>
          <button className={styles.modalClose} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalRow}>
            <div className={styles.modalField}>
              <div className={styles.modalFieldLabel}>First name</div>
              <input 
                type="text" 
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
            </div>
            <div className={styles.modalField}>
              <div className={styles.modalFieldLabel}>Last name</div>
              <input 
                type="text" 
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
            </div>
          </div>
          <div className={styles.modalField}>
            <div className={styles.modalFieldLabel}>Email address</div>
            <input 
              type="email" 
              placeholder="user@jkuat.ac.ke"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>
          <div className={styles.modalRow}>
            <div className={styles.modalField}>
              <div className={styles.modalFieldLabel}>Role</div>
              <select 
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
              >
                <option value="student">Student</option>
                <option value="uni_sup">University Supervisor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className={styles.modalField}>
              <div className={styles.modalFieldLabel}>Status</div>
              <select 
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="deactivated">Deactivated</option>
              </select>
            </div>
          </div>
          <div className={styles.modalField}>
            <div className={styles.modalFieldLabel}>
              Temporary password 
              <span className={styles.modalFieldHint}>
                User will be prompted to change on first login
              </span>
            </div>
            <input 
              type="text" 
              placeholder="Generate or enter password"
              value={formData.tempPassword}
              onChange={(e) => handleInputChange('tempPassword', e.target.value)}
            />
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.btnGhost} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.btnPrimary} onClick={handleSubmit}>
            {mode === 'create' ? 'Create user' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
