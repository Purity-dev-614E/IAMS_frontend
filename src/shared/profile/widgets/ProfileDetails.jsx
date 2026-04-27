import React, { useState } from 'react';
import styles from './ProfileDetails.module.css';

const ProfileDetails = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || '',
    program: user?.program || '',
    regNumber: user?.regNumber || ''
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    onSave('Profile updated successfully');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      role: user?.role || '',
      program: user?.program || '',
      regNumber: user?.regNumber || ''
    });
    setIsEditing(false);
  };

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'admin': return 'System Administrator';
      case 'uni_supervisor': return 'University Supervisor';
      case 'student': return 'Student';
      default: return role;
    }
  };

  return (
    <div className={styles.profileDetails}>
      <div className={styles.header}>
        <h2>Personal Information</h2>
        {!isEditing && (
          <button 
            className={styles.editButton}
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        )}
      </div>

      <div className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
              />
            ) : (
              <div className={styles.displayValue}>{formData.name}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Email Address</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
              />
            ) : (
              <div className={styles.displayValue}>{formData.email}</div>
            )}
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
              />
            ) : (
              <div className={styles.displayValue}>{formData.phone || 'Not provided'}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Role</label>
            <div className={styles.displayValue}>{getRoleDisplay(formData.role)}</div>
          </div>
        </div>

        {(formData.role === 'student') && (
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Program</label>
              {isEditing ? (
                <input
                  type="text"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  className={styles.input}
                />
              ) : (
                <div className={styles.displayValue}>{formData.program || 'Not specified'}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Registration Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="regNumber"
                  value={formData.regNumber}
                  onChange={handleChange}
                  className={styles.input}
                />
              ) : (
                <div className={styles.displayValue}>{formData.regNumber || 'Not specified'}</div>
              )}
            </div>
          </div>
        )}

        {isEditing && (
          <div className={styles.actions}>
            <button 
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button 
              className={styles.saveButton}
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
