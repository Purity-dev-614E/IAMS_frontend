import React from 'react';
import styles from './RegisterForm.module.css';

const RegisterForm = ({ 
  formData, 
  onInputChange, 
  onSubmit, 
  onCancel 
}) => {
  return (
    <div className={styles.registerForm}>
      <div className={styles.rfHeader}>
        <h2>Register your attachment</h2>
        <p>Fill in your placement details. Admin will review and activate your attachment before you can start logging.</p>
      </div>
      <div className={styles.rfBody}>
        <div className={styles.field}>
          <label>
            Organization name 
            <span className={styles.fieldHint}>Required</span>
          </label>
          <input 
            type="text" 
            placeholder="e.g. Safaricom PLC, KCB Group, Nation Media Group"
            value={formData.organization}
            onChange={(e) => onInputChange('organization', e.target.value)}
          />
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label>
              Industry supervisor name 
              <span className={styles.fieldHint}>Required</span>
            </label>
            <input 
              type="text" 
              placeholder="Full name"
              value={formData.supervisorName}
              onChange={(e) => onInputChange('supervisorName', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>
              Industry supervisor email 
              <span className={styles.fieldHint}>Required</span>
            </label>
            <input 
              type="email" 
              placeholder="supervisor@company.com"
              value={formData.supervisorEmail}
              onChange={(e) => onInputChange('supervisorEmail', e.target.value)}
            />
          </div>
        </div>
        <div className={styles.fieldNote}>
          <span style={{fontSize: '13px'}}>ℹ</span>
          <p>The industry supervisor email will receive a weekly link to review your logs. Make sure it is correct — you cannot change it after submission.</p>
        </div>
        <div className={styles.fieldRow} style={{marginTop: '1.1rem'}}>
          <div className={styles.field}>
            <label>
              Start date 
              <span className={styles.fieldHint}>Required</span>
            </label>
            <input 
              type="date" 
              value={formData.startDate}
              onChange={(e) => onInputChange('startDate', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>
              End date 
              <span className={styles.fieldHint}>Required</span>
            </label>
            <input 
              type="date" 
              value={formData.endDate}
              onChange={(e) => onInputChange('endDate', e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className={styles.rfFooter}>
        <button className={styles.btnCancelForm} onClick={onCancel}>
          Cancel
        </button>
        <button className={styles.btnSubmitForm} onClick={onSubmit}>
          Submit for activation
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
