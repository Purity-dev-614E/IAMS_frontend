import React, { useState } from 'react';
import StrengthBar from './StrengthBar';
import styles from './PasswordChange.module.css';

const PasswordChange = ({ onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
    
    // Clear match error when user types in confirm field
    if (field === 'confirmPassword' || field === 'newPassword') {
      setErrors(prev => ({
        ...prev,
        match: null
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateAndSave = async () => {
    const newErrors = {};
    
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = true;
    }
    
    if (!formData.newPassword || formData.newPassword.length < 8) {
      newErrors.newPassword = true;
    }
    
    if (!formData.confirmPassword || formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = true;
      newErrors.match = true;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const passwordData = {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    };
    
    const success = await onSave(passwordData);
    if (success) {
      clearForm();
    }
  };

  const clearForm = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>Change password</div>
        <div className={styles.sectionSubtitle}>Choose a strong password of at least 8 characters</div>
      </div>
      <div className={styles.sectionBody}>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            Current password <span className={styles.fieldHint}>Required</span>
          </div>
          <div className={styles.passwordWrap}>
            <input 
              type={showPasswords.current ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              placeholder="Enter your current password"
              className={`${styles.input} ${errors.currentPassword ? styles.error : ''}`}
            />
            <button 
              className={styles.passwordEye}
              onClick={() => togglePasswordVisibility('current')}
            >
              {showPasswords.current ? 'ð' : 'ð'}
            </button>
          </div>
        </div>
        
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            New password <span className={styles.fieldHint}>Required</span>
          </div>
          <div className={styles.passwordWrap}>
            <input 
              type={showPasswords.new ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              placeholder="At least 8 characters"
              className={`${styles.input} ${errors.newPassword ? styles.error : ''}`}
            />
            <button 
              className={styles.passwordEye}
              onClick={() => togglePasswordVisibility('new')}
            >
              {showPasswords.new ? 'ð' : 'ð'}
            </button>
          </div>
          <StrengthBar password={formData.newPassword} />
        </div>
        
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            Confirm new password <span className={styles.fieldHint}>Required</span>
          </div>
          <div className={styles.passwordWrap}>
            <input 
              type={showPasswords.confirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Repeat new password"
              className={`${styles.input} ${errors.confirmPassword ? styles.error : ''}`}
            />
            <button 
              className={styles.passwordEye}
              onClick={() => togglePasswordVisibility('confirm')}
            >
              {showPasswords.confirm ? 'ð' : 'ð'}
            </button>
          </div>
          {errors.match && (
            <div className={styles.errorMessage}>
              Passwords do not match
            </div>
          )}
        </div>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.sectionFooter}>
        <p>You will stay logged in after changing your password.</p>
        <div style={{display: 'flex', gap: '8px'}}>
          <button className={styles.btnGhost} onClick={clearForm}>
            Cancel
          </button>
          <button 
            className={styles.btnPrimary} 
            onClick={validateAndSave}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update password'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordChange;
