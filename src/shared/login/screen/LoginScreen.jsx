import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginScreen.module.css';
import IAMSlogo from '../../../assets/IAMSlogo.png';
import LoginForm from '../widgets/LoginForm';
import { useAuth } from '../../../contexts/AuthContext';
import { getStudentLandingPath } from '../../../student/attachments/services/studentAttachmentAccess';

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    const redirectAuthenticatedUser = async () => {
      if (!isAuthenticated() || !user) return;

      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'uni_supervisor':
          navigate('/supervisor');
          break;
        case 'student':
          navigate(await getStudentLandingPath());
          break;
        default:
          navigate('/dashboard');
      }
    };

    redirectAuthenticatedUser();
  }, [user, isAuthenticated, navigate]);

  return (
    <div className={styles.loginContainer}>
      {/* Left Column */}
      <div className={styles.leftColumn}>
        {/* Decorative circles */}
        <div className={styles.topCircle}></div>
        <div className={styles.bottomCircle}></div>
        
        <div className={styles.content}>
          <div className={styles.logoSection}>
            <img src={IAMSlogo} alt="IAMS Logo" className={styles.logo} />
            <span className={styles.brand}>IAMS · JKUAT</span>
          </div>
          
          <h1 className={styles.title}>Your attachment, documented properly</h1>
          
          <p className={styles.description}>
            Submit daily activity logs, track your progress, and get weekly reviews from your supervisors — all in one centralized platform.
          </p>
          
          <ul className={styles.features}>
            <li className={styles.feature}>
              <span className={styles.checkmark}>✓</span>
              Submit daily activity logs
            </li>
            <li className={styles.feature}>
              <span className={styles.checkmark}>✓</span>
              Track your attachment progress
            </li>
            <li className={styles.feature}>
              <span className={styles.checkmark}>✓</span>
              Get weekly supervisor reviews
            </li>
          </ul>
        </div>
      </div>
      
      {/* Right Column */}
      <div className={styles.rightColumn}>
        <div className={styles.loginFormContainer}>
          <div className={styles.loginHeader}>
            <span className={styles.noAccount}>No Account?</span>
            <h2 className={styles.signInTitle}>Sign in</h2>
            <p className={styles.signInSubtitle}>Enter your credentials to continue</p>
          </div>
          
          <LoginForm 
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
          />
          
          <div className={styles.loginFooter}>
            <p className={styles.supervisorText}>
              New to the system? <a href="/register" className={styles.link}>Register for access</a>
            </p>
            <p className={styles.industryText}>
              Industry supervisors access the system via the link in their weekly email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
