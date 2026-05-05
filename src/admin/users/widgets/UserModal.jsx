import React, { useState, useEffect } from 'react';
import styles from './UserModal.module.css';
import { userApi } from '../services/userApi';

const UserModal = ({ isOpen, onClose, mode = 'create', user = null, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'student',
    status: 'active',
    tempPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form data when user prop changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && user) {
        setFormData({
          firstName: user.firstName || user.name?.split(' ')[0] || '',
          lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
          email: user.email || '',
          role: user.role || 'student',
          status: user.status || 'active',
          tempPassword: ''
        });
      } else {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          role: 'student',
          status: 'active',
          tempPassword: ''
        });
      }
      setError('');
    }
  }, [isOpen, mode, user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('First name and last name are required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (mode === 'create' && !formData.tempPassword.trim()) {
      setError('Temporary password is required for new users');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        role: formData.role,
        status: formData.status
      };

      if (mode === 'create') {
        userData.tempPassword = formData.tempPassword.trim();
        await userApi.createUser(userData);
      } else {
        await userApi.updateUser(user.id, userData);
      }

      onUserUpdated?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save user');
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
            {mode === 'create' ? 'Create user' : 'Edit user'}
          </span>
          <button className={styles.modalClose} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
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
          <button 
            className={styles.btnGhost} 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className={styles.btnPrimary} 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : (mode === 'create' ? 'Create user' : 'Save changes')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
