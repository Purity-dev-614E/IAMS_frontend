import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './CreateDailyLog.module.css';
import WeekDots from '../../../../unisup/dashboard/widgets/WeekDots';
import logoImage from '../../../../assets/IAMSlogo.png';

const CreateDailyLog = () => {
  const [mode, setMode] = useState('new');
  const [formData, setFormData] = useState({
    tasks: '',
    skills: '',
    observations: ''
  });
  const [charCounts, setCharCounts] = useState({
    tasks: 0,
    skills: 0
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const autosaveTimer = useRef(null);

  const week6Data = [
    { day: 'Mon', status: 'submitted' },
    { day: 'Tue', status: 'submitted' },
    { day: 'Wed', status: 'submitted' },
    { day: 'Thu', status: 'draft' },
    { day: 'Fri', status: 'upcoming' }
  ];

  const limits = {
    tasks: 500,
    skills: 300
  };

  const countChars = (field, value) => {
    const count = value.length;
    const limit = limits[field] || 300;
    setCharCounts(prev => ({
      ...prev,
      [field]: count
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    countChars(field, value);
    triggerAutosave();
  };

  const triggerAutosave = () => {
    if (mode === 'submitted') return;
    
    setIsSaving(true);
    if (autosaveTimer.current) {
      clearTimeout(autosaveTimer.current);
    }
    
    autosaveTimer.current = setTimeout(() => {
      setIsSaving(false);
    }, 1200);
  };

  const saveDraft = () => {
    triggerAutosave();
  };

  const validateForm = () => {
    const tasks = formData.tasks.trim();
    const skills = formData.skills.trim();
    
    if (!tasks || !skills) {
      // Highlight required fields
      const tasksField = document.getElementById('tasks');
      const skillsField = document.getElementById('skills');
      tasksField.style.borderColor = tasks ? '' : '#DC2626';
      skillsField.style.borderColor = skills ? '' : '#DC2626';
      return false;
    }
    return true;
  };

  const openModal = () => {
    if (!validateForm()) return;
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const confirmSubmit = () => {
    closeModal();
    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.textContent = 'Submitting...';
    
    setTimeout(() => {
      setMode('submitted');
    }, 1000);
  };

  const setModeHandler = (newMode) => {
    setMode(newMode);
    
    // Reset form visibility
    document.getElementById('offline-banner').style.display = 'none';
    document.getElementById('submitted-banner').style.display = 'none';
    document.getElementById('form-card').style.display = 'block';
    document.getElementById('readonly-card').style.display = 'none';
    document.getElementById('submit-section').style.display = 'block';
    document.getElementById('autosave-bar').style.display = 'flex';
    document.getElementById('success-card').style.display = 'none';
    
    const btn = document.getElementById('submit-btn');
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Submit log for today';
    }
  };

  useEffect(() => {
    // Simulate offline detection
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={styles.shell}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <img src={logoImage} alt="IAMS" className={styles.logoImage} />
          <span className={styles.logoLabel}>IAMS</span>
        </div>
        <span className={styles.navSectionLabel}>Main</span>
        <Link to="/dashboard" className={styles.navItem}>
          <span className={styles.navIcon}>▦</span> Dashboard
        </Link>
        <Link to="/attachments" className={styles.navItem}>
          <span className={styles.navIcon}>◎</span> My Attachment
        </Link>
        <Link to="/logs" className={`${styles.navItem} ${styles.active}`}>
          <span className={styles.navIcon}>✎</span> Daily Logs
        </Link>
        <Link to="/reviews" className={styles.navItem}>
          <span className={styles.navIcon}>⊞</span> Weekly Reviews
        </Link>
        <span className={styles.navSectionLabel} style={{marginTop: '1rem'}}>Account</span>
        <Link to="/profile" className={styles.navItem}>
          <span className={styles.navIcon}>◉</span> Profile
        </Link>
        <div className={styles.sidebarBottom}>
          <div className={styles.userChip}>
            <div className={styles.avatar}>PS</div>
            <div className={styles.userInfo}>
              <div className={styles.name}>Purity Sang</div>
              <div className={styles.role}>Student · BBIT</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className={styles.main}>
        <div className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button className={styles.backBtn}>‹</button>
            <div>
              <div className={styles.topbarTitle}>Daily Log</div>
              <div className={styles.topbarSub}>Thursday, 3 April 2025</div>
            </div>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.demoTabs}>
              <button 
                className={`${styles.dtab} ${mode === 'new' ? styles.active : ''}`}
                onClick={() => setModeHandler('new')}
              >
                New log
              </button>
              <button 
                className={`${styles.dtab} ${mode === 'offline' ? styles.active : ''}`}
                onClick={() => setModeHandler('offline')}
              >
                Offline
              </button>
              <button 
                className={`${styles.dtab} ${mode === 'submitted' ? styles.active : ''}`}
                onClick={() => setModeHandler('submitted')}
              >
                Submitted
              </button>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.formOuter}>
            {/* OFFLINE BANNER */}
            {isOffline && mode === 'offline' && (
              <div className={styles.offlineBanner} id="offline-banner">
                <span className={styles.offlineIcon}>⚡</span>
                <p><strong>You're offline.</strong> Your log is being saved locally and will sync automatically when you reconnect.</p>
              </div>
            )}

            {/* SUBMITTED BANNER */}
            {mode === 'submitted' && (
              <div className={styles.submittedBanner} id="submitted-banner">
                <span style={{fontSize: '14px'}}>✓</span>
                <p><strong>This log has been submitted.</strong> Submitted logs cannot be edited. Your industry supervisor will review it as part of your Week 6 review.</p>
              </div>
            )}

            {/* AUTOSAVE */}
            {(mode === 'new' || mode === 'offline') && (
              <div className={styles.autosaveBar} id="autosave-bar">
                <div className={styles.breadcrumb}>
                  Daily Logs <span>›</span> New entry
                </div>
                <div className={styles.autosaveChip}>
                  <div className={`${styles.autosaveDot} ${isSaving ? styles.saving : ''}`}></div>
                  <span id="autosave-text">
                    {isOffline ? 'Saved locally — will sync on reconnect' : 
                     isSaving ? 'Saving...' : 'Draft saved automatically'}
                  </span>
                </div>
              </div>
            )}

            {/* WEEK CONTEXT */}
            <div className={styles.weekContext}>
              <div className={styles.wcLeft}>
                <div className={styles.wcIcon}>📅</div>
                <div>
                  <div className={styles.wcTitle}>Week 6 of your attachment</div>
                  <div className={styles.wcSub}>31 Mar – 4 Apr 2025 · Safaricom PLC</div>
                </div>
              </div>
              <div>
                <div style={{fontSize: '10px', color: 'var(--subtle)', marginBottom: '4px', textAlign: 'right'}}>
                  This week
                </div>
                <WeekDots data={week6Data} />
              </div>
            </div>

            {/* FORM CARD */}
            {(mode === 'new' || mode === 'offline') && (
              <div className={styles.formCard} id="form-card">
                <div className={styles.formCardHeader}>
                  <div className={styles.fchLeft}>
                    <h2>Thursday, 3 April 2025</h2>
                    <p>Week 6 · Day 4 of 5 · Safaricom PLC</p>
                  </div>
                  <div className={styles.dateChip}>Today</div>
                </div>
                <div className={styles.formCardBody}>
                  <div className={styles.field}>
                    <label>
                      Tasks performed
                      <span className={styles.fieldHint}>Required</span>
                    </label>
                    <textarea
                      id="tasks"
                      rows="4"
                      value={formData.tasks}
                      onChange={(e) => handleInputChange('tasks', e.target.value)}
                      placeholder="What did you do today? Describe the tasks you worked on, meetings you attended, and any assignments you completed."
                    />
                    <div className={styles.charCount} id="tasks-count">
                      {charCounts.tasks} / {limits.tasks}
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label>
                      Skills acquired
                      <span className={styles.fieldHint}>Required</span>
                    </label>
                    <textarea
                      id="skills"
                      rows="3"
                      value={formData.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      placeholder="What did you learn today? List the technical or professional skills you developed or practised."
                    />
                    <div className={styles.charCount} id="skills-count">
                      {charCounts.skills} / {limits.skills}
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label>
                      Observations
                      <span className={styles.fieldHint}>Optional</span>
                    </label>
                    <textarea
                      id="obs"
                      rows="2"
                      value={formData.observations}
                      onChange={(e) => handleInputChange('observations', e.target.value)}
                      placeholder="Anything else worth noting — challenges you faced, questions you have, or things that surprised you."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* READ ONLY CARD */}
            {mode === 'submitted' && (
              <div className={styles.formCard} id="readonly-card">
                <div className={styles.formCardHeader}>
                  <div className={styles.fchLeft}>
                    <h2>Thursday, 3 April 2025</h2>
                    <p>Week 6 · Day 4 of 5 · Safaricom PLC</p>
                  </div>
                  <div className={styles.dateChip} style={{background: 'var(--green)'}}>
                    Submitted
                  </div>
                </div>
                <div className={styles.formCardBody}>
                  <div className={styles.field}>
                    <label>Tasks performed</label>
                    <div className={styles.readonlyField}>
                      Continued working on the API integration for payments module. Attended a sprint review meeting in the afternoon where I presented progress on the authentication service. Reviewed pull request comments from senior engineer and made the suggested refactors.
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label>Skills acquired</label>
                    <div className={styles.readonlyField}>
                      REST API integration patterns, sprint review presentation skills, code review best practices, Git rebase workflow.
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label>Observations</label>
                    <div className={styles.readonlyField}>
                      The team uses a trunk-based development approach which is different from what I learned in class. Worth asking about branching strategies in tomorrow's stand-up.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBMIT SECTION */}
            {(mode === 'new' || mode === 'offline') && (
              <div className={styles.submitSection} id="submit-section">
                <div className={styles.submitTop}>
                  <span className={styles.warnIcon}>⚠</span>
                  <div className={styles.warnText}>
                    <h3>Ready to submit?</h3>
                    <p>Once submitted this log cannot be edited. It will be included in your Week 6 review which both supervisors will receive at the end of the week.</p>
                  </div>
                </div>
                <div className={styles.submitBtns}>
                  <button className={`${styles.btn} ${styles.btnDraft}`} onClick={saveDraft}>
                    Save draft
                  </button>
                  <button 
                    className={`${styles.btn} ${styles.btnSubmit}`} 
                    id="submit-btn"
                    onClick={openModal}
                  >
                    Submit log for today
                  </button>
                </div>
              </div>
            )}

            {/* SUCCESS */}
            {mode === 'submitted' && (
              <div className={styles.successCard} id="success-card">
                <div className={styles.successIcon}>✓</div>
                <h2>Log submitted</h2>
                <p>Your Thursday 3 April log has been saved. It will be bundled with the rest of your Week 6 logs and sent to your supervisors on Friday.</p>
                <button 
                  className={styles.btnBack} 
                  onClick={() => setModeHandler('new')}
                >
                  Back to logs
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {showModal && (
        <div className={styles.modalOverlay} id="modal">
          <div className={styles.modal}>
            <h3>Submit this log?</h3>
            <p>You're about to submit your log for <strong>Thursday 3 April</strong>. Once submitted it cannot be edited. Your supervisors will review it at the end of Week 6.</p>
            <div className={styles.modalBtns}>
              <button className={styles.btnCancel} onClick={closeModal}>
                Go back
              </button>
              <button className={styles.btnConfirm} onClick={confirmSubmit}>
                Yes, submit log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateDailyLog;
