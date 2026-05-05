import React, { useState } from 'react';
import styles from './PasswordChange.module.css';

const PasswordChange = ({ onSave }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      onSave('New passwords do not match', 'error');
      return;
    }
    
    if (formData.newPassword.length < 8) {
      onSave('Password must be at least 8 characters long', 'error');
      return;
    }
    
    // Here you would make an API call to change the password
    onSave('Password changed successfully');
    
    // Reset form
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const togglePasswordVisibility = (field) => {
    // Only allow toggling for new and confirm passwords, not current password for security
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className={styles.passwordChange}>
      <div className={styles.header}>
        <h2>Change Password</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Current Password</label>
          <div className={styles.passwordInput}>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>New Password</label>
          <div className={styles.passwordInput}>
            <input
              type={showPasswords.new ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className={styles.toggleButton}
            >
              {showPasswords.new ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <div className={styles.requirements}>
            Password must be at least 8 characters long
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Confirm New Password</label>
          <div className={styles.passwordInput}>
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className={styles.toggleButton}
            >
              {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.changeButton}>
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChange;
