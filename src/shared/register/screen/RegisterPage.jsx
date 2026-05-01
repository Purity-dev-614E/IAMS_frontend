import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './RegisterPage.module.css';
import { 
  RoleSelector,
  FormField,
  PasswordField,
  PendingState,
  SuccessState
} from '../widgets';

export default function RegisterPage() {
  const { register, isLoading, error: authError } = useAuth();
  const [currentRole, setCurrentRole] = useState('student');
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    reg: '',
    program: '',
    yearOfStudy: '',
    pw: '',
    cpw: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({ pw: false, cpw: false });
  const [currentState, setCurrentState] = useState('register'); // register, pending, success
  const [submitError, setSubmitError] = useState('');

  const setRole = (role) => {
    setCurrentRole(role);
    setCurrentState('register');
  };

  const togglePassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear error for this field
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fname.trim()) newErrors.fname = true;
    if (!formData.lname.trim()) newErrors.lname = true;
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = true;
    if (!formData.pw || formData.pw.length < 8) newErrors.pw = true;
    if (!formData.cpw || formData.cpw !== formData.pw) newErrors.cpw = true;
    
    // Validate student-specific fields
    if (currentRole === 'student') {
      if (!formData.reg.trim()) newErrors.reg = true;
      if (!formData.program.trim()) newErrors.program = true;
      if (!formData.yearOfStudy.trim()) newErrors.yearOfStudy = true;
    }
        
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setSubmitError('');
    
    try {
      const userData = {
        ...formData,
        role: currentRole
      };
      
      const response = await register(userData);
      
      if (response.success) {
        if (response.requiresApproval) {
          setCurrentState('pending');
        } else {
          setCurrentState('success');
        }
      } else {
        setSubmitError(response.error || 'Registration failed');
      }
    } catch (error) {
      setSubmitError(error.message || 'An unexpected error occurred');
    }
  };

  const reset = () => {
    setCurrentState('register');
    setFormData({
      fname: '',
      lname: '',
      email: '',
      reg: '',
      program: '',
      yearOfStudy: '',
      pw: '',
      cpw: ''
    });
    setErrors({});
    setCurrentRole('student');
  };

  if (currentState === 'pending') {
    return (
      <div className={styles.page}>
        <LeftPanel />
        <div className={styles.right}>
          <div className={styles.formWrap}>
            <PendingState 
              name={`${formData.fname} ${formData.lname}`}
              email={formData.email}
              onBack={reset}
            />
          </div>
        </div>
      </div>
    );
  }

  if (currentState === 'success') {
    return (
      <div className={styles.page}>
        <LeftPanel />
        <div className={styles.right}>
          <div className={styles.formWrap}>
            <SuccessState onBack={reset} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <LeftPanel />
      
      <div className={styles.right}>
        <div className={styles.formWrap}>
          <div className={styles.formHeader}>
            <h1>Create account</h1>
            <p>Choose your role and fill in your details to get started</p>
          </div>

          <RoleSelector 
            currentRole={currentRole}
            onRoleChange={setRole}
          />

          <div className={styles.fieldRow}>
            <FormField
              id="fname"
              label="First name"
              placeholder="First name"
              value={formData.fname}
              onChange={handleInputChange}
              error={errors.fname}
            />
            <FormField
              id="lname"
              label="Last name"
              placeholder="Last name"
              value={formData.lname}
              onChange={handleInputChange}
              error={errors.lname}
            />
          </div>

          <FormField
            id="email"
            label="Email address"
            type="email"
            placeholder="you@jkuat.ac.ke"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
          />

          {/* Student-only fields */}
          {currentRole === 'student' && (
            <>
              <div className={styles.fieldRow}>
                <FormField
                  id="reg"
                  label="Registration number"
                  placeholder="HDB212-XXXX/2022"
                  value={formData.reg}
                  onChange={handleInputChange}
                  error={errors.reg}
                />
                <FormField
                  id="program"
                  label="Program"
                  placeholder="e.g. BBIT"
                  value={formData.program}
                  onChange={handleInputChange}
                  error={errors.program}
                />
              </div>
              <FormField
                id="yearOfStudy"
                label="Year of study"
                placeholder="e.g. 3"
                value={formData.yearOfStudy}
                onChange={handleInputChange}
                error={errors.yearOfStudy}
              />
            </>
          )}

          <PasswordField
            id="pw"
            label="Password"
            subtext="Min. 8 characters"
            placeholder="••••••••"
            value={formData.pw}
            onChange={handleInputChange}
            showPassword={showPassword.pw}
            onTogglePassword={() => togglePassword('pw')}
            error={errors.pw}
          />

          <PasswordField
            id="cpw"
            label="Confirm password"
            placeholder="••••••••"
            value={formData.cpw}
            onChange={handleInputChange}
            showPassword={showPassword.cpw}
            onTogglePassword={() => togglePassword('cpw')}
            error={errors.cpw}
          />

          <button 
            className={`${styles.submitBtn} ${currentRole === 'supervisor' ? styles.green : ''}`} 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 
             (currentRole === 'supervisor' ? 'Submit for approval' : 'Create account')}
          </button>

          {/* Error Display */}
          {(submitError || authError) && (
            <div className={styles.errorMessage}>
              {submitError || authError}
            </div>
          )}

          <div className={styles.divider}>
            <div className={styles.divLine}></div>
            <div className={styles.divText}>already have an account</div>
            <div className={styles.divLine}></div>
          </div>
          <div className={styles.formFooter}>
            <a href="/login">Sign in instead →</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeftPanel() {
  return (
    <div className={styles.left}>
      <div className={styles.leftLogo}>
        <div className={styles.logoMark}>
          <img src="/IAMSlogo.png" alt="IAMS Logo" className={styles.logoImage} />
        </div>
        <span className={styles.logoText}>IAMS · JKUAT</span>
      </div>
      <div className={styles.leftContent}>
        <h2>Your attachment, <em>documented properly.</em></h2>
        <p>Join JKUAT's industrial attachment management platform — for students, supervisors, and administrators.</p>
        <div className={styles.leftSteps}>
          <div className={styles.step}>
            <div className={styles.stepDot}></div>
            <div className={styles.stepText}>Students register and log daily activities</div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepDot}></div>
            <div className={styles.stepText}>Supervisors review and give weekly feedback</div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepDot}></div>
            <div className={styles.stepText}>Admins oversee the entire cohort</div>
          </div>
        </div>
      </div>
      <div className={styles.leftFooter}>© 2025 JKUAT · Industrial Attachment Management System</div>
    </div>
  );
}
