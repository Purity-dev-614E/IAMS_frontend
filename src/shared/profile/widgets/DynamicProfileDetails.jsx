import React, { useState } from 'react';
import styles from '../../../student/profile/widgets/ProfileDetails.module.css';

const DynamicProfileDetails = ({ user, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phoneNumber: user?.phone || '',
    email: user?.email || '',
    role: user?.role || '',
    program: user?.program || '',
    regNumber: user?.regNumber || '',
    department: user?.department || '',
    employeeId: user?.employeeId || ''
  });

  const [errors, setErrors] = useState({});

  // Update form data when user data changes
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        phoneNumber: user.phone || '',
        email: user.email || '',
        role: user.role || '',
        program: user.program || '',
        regNumber: user.regNumber || '',
        department: user.department || '',
        employeeId: user.employeeId || ''
      }));
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleSave = async () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = true;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Prepare update data based on role
    const updateData = {
      name: formData.fullName,
      phone: formData.phoneNumber
    };

    // Add role-specific fields
    if (formData.role === 'admin') {
      updateData.department = formData.department;
      updateData.employeeId = formData.employeeId;
    } else if (formData.role === 'uni_supervisor') {
      updateData.department = formData.department;
      updateData.specialization = formData.specialization;
    }
    
    await onSave(updateData);
  };

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'admin': return 'System Administrator';
      case 'uni_supervisor': return 'University Supervisor';
      case 'student': return 'Student';
      default: return role || 'User';
    }
  };

  const renderStudentFields = () => (
    <>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            Email address <span className={styles.fieldHint}>Read only</span>
          </div>
          <div className={styles.readOnly}>{formData.email}</div>
        </div>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            Registration number <span className={styles.fieldHint}>Read only</span>
          </div>
          <div className={styles.readOnly}>{formData.regNumber || 'Not assigned'}</div>
        </div>
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            Program <span className={styles.fieldHint}>Read only</span>
          </div>
          <div className={styles.readOnly}>{formData.program || 'Not specified'}</div>
        </div>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            Year of study <span className={styles.fieldHint}>Read only</span>
          </div>
          <div className={styles.readOnly}>Year {user?.yearOfStudy || 'Not specified'}</div>
        </div>
      </div>
    </>
  );

  const renderAdminFields = () => (
    <>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            Email address <span className={styles.fieldHint}>Read only</span>
          </div>
          <div className={styles.readOnly}><span>{formData.email}</span></div>
        </div>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            Role <span className={styles.fieldHint}>Read only</span>
          </div>
          <div className={styles.readOnly}>{getRoleDisplay(formData.role)}</div>
        </div>
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            Department <span className={styles.fieldHint}>Optional</span>
          </div>
          <input 
            type="text" 
            value={formData.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
            placeholder="e.g., ICT Department"
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            Employee ID <span className={styles.fieldHint}>Optional</span>
          </div>
          <input 
            type="text" 
            value={formData.employeeId}
            onChange={(e) => handleInputChange('employeeId', e.target.value)}
            placeholder="e.g., EMP001"
            className={styles.input}
          />
        </div>
      </div>
    </>
  );

  const renderSupervisorFields = () => (
    <>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            Email address <span className={styles.fieldHint}>Read only</span>
          </div>
          <div className={styles.readOnly}>{formData.email}</div>
        </div>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            Role <span className={styles.fieldHint}>Read only</span>
          </div>
          <div className={styles.readOnly}>{getRoleDisplay(formData.role)}</div>
        </div>
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            Department <span className={styles.fieldHint}>Optional</span>
          </div>
          <input 
            type="text" 
            value={formData.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
            placeholder="e.g., Computer Science Department"
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            Specialization <span className={styles.fieldHint}>Optional</span>
          </div>
          <input 
            type="text" 
            value={formData.specialization || ''}
            onChange={(e) => handleInputChange('specialization', e.target.value)}
            placeholder="e.g., Software Engineering"
            className={styles.input}
          />
        </div>
      </div>
    </>
  );

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case 'student':
        return renderStudentFields();
      case 'admin':
        return renderAdminFields();
      case 'uni_supervisor':
        return renderSupervisorFields();
      default:
        return (
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <div className={styles.fieldLabel}>
                Email address <span className={styles.fieldHint}>Read only</span>
              </div>
              <div className={styles.readOnly}>{formData.email}</div>
            </div>
            <div className={styles.field}>
              <div className={styles.fieldLabel}>
                Role <span className={styles.fieldHint}>Read only</span>
              </div>
              <div className={styles.readOnly}>{getRoleDisplay(formData.role)}</div>
            </div>
          </div>
        );
    }
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
        
        {renderRoleSpecificFields()}
      </div>
      <div className={styles.divider}></div>
      <div className={styles.sectionFooter}>
        <p>Changes are saved immediately to your account.</p>
        <button 
          className={styles.btnPrimary} 
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </div>
  );
};

export default DynamicProfileDetails;
