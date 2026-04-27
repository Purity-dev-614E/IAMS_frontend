import React, { useState } from 'react';
import styles from './ProfileDetails.module.css';

const ProfileDetails = ({ onSave }) => {
  const [formData, setFormData] = useState({
    fullName: 'Purity Chelagat Sang',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleSave = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = true;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSave('Profile updated');
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>Profile details</div>
        <div className={styles.sectionSubtitle}>Update your name and contact information</div>
      </div>
      <div className={styles.sectionBody}>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>
              Full name <span className={styles.fieldHint}>Editable</span>
            </div>
            <input 
              type="text" 
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={`${styles.input} ${errors.fullName ? styles.error : ''}`}
            />
          </div>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>
              Phone number <span className={styles.fieldHint}>Optional</span>
            </div>
            <input 
              type="text" 
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="+254 7XX XXX XXX"
              className={styles.input}
            />
          </div>
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>
              Email address <span className={styles.fieldHint}>Read only</span>
            </div>
            <div className={styles.readOnly}>purity.sang@students.jkuat.ac.ke</div>
          </div>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>
              Registration number <span className={styles.fieldHint}>Read only</span>
            </div>
            <div className={styles.readOnly}>HDB212-0324/2022</div>
          </div>
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>
              Program <span className={styles.fieldHint}>Read only</span>
            </div>
            <div className={styles.readOnly}>Bachelor of Business Information Technology</div>
          </div>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>
              Year of study <span className={styles.fieldHint}>Read only</span>
            </div>
            <div className={styles.readOnly}>Year 4</div>
          </div>
        </div>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.sectionFooter}>
        <p>Changes are saved immediately to your account.</p>
        <button className={styles.btnPrimary} onClick={handleSave}>
          Save changes
        </button>
      </div>
    </div>
  );
};

export default ProfileDetails;
