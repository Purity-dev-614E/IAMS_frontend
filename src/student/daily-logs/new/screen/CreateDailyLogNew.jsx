import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import styles from './CreateDailyLog.module.css';
import WeekDots from '../../../../unisup/dashboard/widgets/WeekDots';
import AppSidebar from '../../../../shared/components/AppSidebar/AppSidebar';
import { profileService } from '../../../../shared/profile/profileService';
import { useDailyLogs } from '../../services/useDailyLogs';
import { attachmentService } from '../../../attachments/services/attachmentService';
import { useAuth } from '../../../../contexts/AuthContext';

const CreateDailyLog = () => {
  const { createLog, submitLog, getLog, updateLog } = useDailyLogs();
  const { user } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const [profileData, setProfileData] = useState(null);
  const [mode, setMode] = useState(id ? 'edit' : 'new');
  const [editLogId, setEditLogId] = useState(id || null);
  const getLocalDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    tasks: '',
    skills: '',
    observations: '',
    logDate: location.state?.date || getLocalDateString()
  });

  // Sync logDate when location state changes (for batch logging different days)
  useEffect(() => {
    if (location.state?.date && mode === 'new') {
      setFormData({
        tasks: '',
        skills: '',
        observations: '',
        logDate: location.state.date
      });
      setCharCounts({ tasks: 0, skills: 0 });
      setError(null);
      setSuccess(false);
    }
  }, [location.state, mode]);

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Load log data if in edit mode
  useEffect(() => {
    if (mode === 'edit' && editLogId) {
      loadLogData();
    }
  }, [mode, editLogId]);

  const loadLogData = async () => {
    try {
      console.log('🔍 Loading log data for edit, editLogId:', editLogId);
      const log = await getLog(editLogId);
      console.log('🔍 Loaded log data:', log);
      if (log) {
        const formData = {
          tasks: log.tasksPerformed || '',
          skills: log.skillsAcquired || '',
          observations: log.observations || '',
          logDate: log.logDate ? new Date(log.logDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        };
        console.log('🔍 Setting form data:', formData);
        setFormData(formData);
      }
    } catch (error) {
      console.error('Error loading log data:', error);
      setError('Failed to load log data for editing');
    }
  };

  const fetchProfileData = async () => {
    try {
      const profile = await profileService.fetchProfile();
      setProfileData(profile);
    } catch (error) {
      console.error('Profile fetch error:', error);
    }
  };
  const [charCounts, setCharCounts] = useState({
    tasks: 0,
    skills: 0
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [weekData, setWeekData] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const autosaveTimer = useRef(null); // Force refresh

  // Fetch attachment data and current week logs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get attachment data
        const attachments = await attachmentService.getMyAttachments();
        
        // Handle different response formats
        let attachmentsArray = [];
        if (Array.isArray(attachments)) {
          attachmentsArray = attachments;
        } else if (attachments && attachments.attachments && Array.isArray(attachments.attachments)) {
          attachmentsArray = attachments.attachments;
        } else if (attachments && attachments.data && Array.isArray(attachments.data)) {
          attachmentsArray = attachments.data;
        } else if (attachments && attachments.logs && Array.isArray(attachments.logs)) {
          attachmentsArray = attachments.logs;
        } else if (attachments && typeof attachments === 'object') {
          attachmentsArray = [attachments]; // Single attachment object
        }
        
        if (attachmentsArray && attachmentsArray.length > 0) {
          const activeAttachment = attachmentsArray[0];
          setAttachment(activeAttachment);
          
          // Calculate current week
          const today = new Date();
          const attachmentStart = new Date(activeAttachment.start_date);
          const diffTime = Math.abs(today - attachmentStart);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const weekNumber = Math.max(1, Math.ceil(diffDays / 7));
          setCurrentWeek(weekNumber);
        } else {
          setError('No attachments found. Please create an attachment first.');
        }
      } catch (error) {
        console.error('Error fetching attachment data:', error);
        setError('Failed to load attachment data: ' + error.message);
      }
    };
    
    fetchData();
  }, []);

  // Debug modal state changes
  useEffect(() => {
    console.log('🔍 Modal state changed:', showModal);
  }, [showModal]);

  // Generate week data based on current week
  const generateWeekData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const today = new Date();
    const currentDayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const todayIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1; // Convert to Monday=0
    
    return days.map((day, index) => {
      if (index < todayIndex) {
        return { day, status: 'submitted' };
      } else if (index === todayIndex) {
        return { day, status: mode === 'submitted' ? 'submitted' : 'draft' };
      } else {
        return { day, status: 'upcoming' };
      }
    });
  };

  useEffect(() => {
    setWeekData(generateWeekData());
  }, [mode]);

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

  const saveDraft = async () => {
    try {
      setError(null);
      
      if (!attachment || !attachment.id) {
        throw new Error('Attachment data not loaded. Please refresh the page and try again.');
      }

      const logData = {
        tasks_performed: formData.tasks,
        skills_acquired: formData.skills,
        observations: formData.observations,
        log_date: formData.logDate,
        attachment_id: attachment.id,
        status: 'draft'
      };

      if (mode === 'edit') {
        await updateLog(editLogId, logData);
        console.log('✅ Draft updated successfully');
      } else {
        await createLog(logData);
        console.log('✅ Draft saved successfully');
      }
      
      triggerAutosave();
    } catch (error) {
      console.error('❌ Save draft error:', error);
      setError(error.message || 'Failed to save draft. Please try again.');
    }
  };

  const validateForm = () => {
    const tasks = formData.tasks.trim();
    const skills = formData.skills.trim();
    
    console.log('🔍 Validating form:', { tasks: !!tasks, skills: !!skills });
    
    if (!tasks || !skills) {
      // Highlight required fields with better error handling
      try {
        const tasksField = document.getElementById('tasks');
        const skillsField = document.getElementById('skills');
        if (tasksField) {
          tasksField.style.borderColor = tasks ? '' : '#DC2626';
        }
        if (skillsField) {
          skillsField.style.borderColor = skills ? '' : '#DC2626';
        }
      } catch (error) {
        console.error('Error highlighting fields:', error);
      }
      
      // Show validation error message
      setError('Please fill in both required fields: Tasks performed and Skills acquired');
      console.log('❌ Form validation failed');
      return false;
    }
    
    // Clear any previous validation errors
    setError(null);
    console.log('✅ Form validation passed');
    return true;
  };

  const openModal = () => {
    console.log('🔍 Opening modal...');
    if (!validateForm()) {
      console.log('❌ Form validation failed, modal not shown');
      return;
    }
    console.log('✅ Form validation passed, showing modal');
    setShowModal(true);
  };

  const closeModal = () => {
    console.log('🔍 Closing modal...');
    setShowModal(false);
  };

  const confirmSubmit = async () => {
    console.log('🚀 Starting log submission...');
    closeModal();
    const btn = document.getElementById('submit-btn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = mode === 'edit' ? 'Updating...' : 'Submitting...';
    }
    
    try {
      setError(null);
      
      // Check if attachment data is available
      if (!attachment || !attachment.id) {
        console.error('❌ Missing attachment data:', attachment);
        throw new Error('Attachment data not loaded. Please refresh the page and try again.');
      }
      console.log('✅ Attachment data available:', attachment.id);
      
      let logId = null;
      
      if (mode === 'edit') {
        // Update existing log
        const logData = {
          tasks_performed: formData.tasks,
          skills_acquired: formData.skills,
          observations: formData.observations,
          log_date: formData.logDate,
          attachment_id: attachment.id,
          status: 'draft'
        };
        
        console.log('📤 Updating log with data:', logData);
        const updatedLog = await updateLog(editLogId, logData);
        console.log('✅ Log updated successfully:', updatedLog);
        
        logId = editLogId;
      } else {
        // Create new log
        const logData = {
          tasks_performed: formData.tasks,
          skills_acquired: formData.skills,
          observations: formData.observations,
          log_date: formData.logDate,
          attachment_id: attachment.id,
          status: 'draft',
          submitted_at: new Date().toISOString()
        };
        
        console.log('📤 Creating log with data:', logData);
        const createdLog = await createLog(logData);
        console.log('✅ Log created successfully:', createdLog);
        console.log('🔍 Response type:', typeof createdLog);
        console.log('🔍 Response keys:', createdLog ? Object.keys(createdLog) : 'null');
        console.log('🔍 Looking for ID in:', createdLog);
        
        // Handle different response formats
        if (createdLog) {
          // Extract ID from raw log object (service now returns data.log)
          logId = createdLog.id ||           // Direct ID from raw log object
                  createdLog.logId ||         // Fallback to logId field
                  createdLog.log_id ||         // Snake_case fallback
                  createdLog.data?.id ||       // Nested data object
                  createdLog.data?.log_id ||    // Nested snake_case
                  (createdLog.data && createdLog.data[0]?.id);  // Array fallback
        }
        
        console.log('🔍 Extracted log ID:', logId);
        
        if (!logId) {
          console.error('❌ No log ID found in response. Full response:', createdLog);
          throw new Error('Invalid response from createLog - missing log ID');
        }
      }
      
      console.log('📤 Submitting log with ID:', logId);
      await submitLog(logId);
      console.log('✅ Log submitted successfully!');
      
      setSuccess(true);
      setMode('submitted');
    } catch (error) {
      console.error('❌ Submit error:', error);
      setError(error.message || 'Failed to submit log. Please try again.');
      if (btn) {
        btn.disabled = false;
        btn.textContent = mode === 'edit' ? 'Update and submit log' : 'Submit log for today';
      }
    }
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

  const getFormattedDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const isToday = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr).toDateString() === new Date().toDateString();
  };

  return (
    <div className={styles.shell}>
      {/* SIDEBAR */}
      <AppSidebar 
        navigationItems={profileService.getNavigationItems(profileData || user)} 
        user={profileService.getUserDisplayInfo(profileData || user)}
      />
      
      {/* MAIN */}
      <div className={styles.main}>
        <div className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button className={styles.backBtn}>‹</button>
            <div>
              <div className={styles.topbarTitle}>{mode === 'edit' ? 'Edit Daily Log' : 'Daily Log'}</div>
              <div className={styles.topbarSub}>{getFormattedDate(formData.logDate)}</div>
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

            {/* ERROR BANNER */}
            {error && (
              <div className={styles.offlineBanner} style={{background: '#FEE2E2', border: '1px solid #FCA5A5'}}>
                <span style={{color: '#DC2626'}}>⚠</span>
                <p style={{color: '#DC2626'}}><strong>Error:</strong> {error}</p>
              </div>
            )}

            {/* SUCCESS BANNER */}
            {success && (
              <div className={styles.submittedBanner} id="submitted-banner">
                <span style={{fontSize: '14px'}}>✓</span>
                <p><strong>Log submitted successfully!</strong> Your daily log has been saved and submitted for review.</p>
              </div>
            )}

            {/* SUBMITTED BANNER */}
            {mode === 'submitted' && !success && (
              <div className={styles.submittedBanner} id="submitted-banner">
                <span style={{fontSize: '14px'}}>✓</span>
                <p><strong>This log has been submitted.</strong> Submitted logs cannot be edited. Your industry supervisor will review it as part of your Week {currentWeek} review.</p>
              </div>
            )}

            {/* AUTOSAVE */}
            {(mode === 'new' || mode === 'offline' || mode === 'edit') && (
              <div className={styles.autosaveBar} id="autosave-bar">
                <div className={styles.breadcrumb}>
                  Daily Logs <span>›</span> {mode === 'edit' ? 'Edit entry' : 'New entry'}
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
                  <div className={styles.wcTitle}>Week {currentWeek} of your attachment</div>
                  <div className={styles.wcSub}>{attachment ? `${attachment.organization_name || 'Your Organization'} · ${attachment.start_date ? new Date(attachment.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''} – ${attachment.end_date ? new Date(attachment.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}` : 'Loading attachment data...'}</div>
                </div>
              </div>
              <div>
                <div style={{fontSize: '10px', color: 'var(--subtle)', marginBottom: '4px', textAlign: 'right'}}>
                  This week
                </div>
                <WeekDots data={weekData} />
              </div>
            </div>

            {/* FORM CARD */}
            {(mode === 'new' || mode === 'offline' || mode === 'edit') && (
              <div className={styles.formCard} id="form-card">
                <div className={styles.formCardHeader}>
                  <div className={styles.fchLeft}>
                    <h2>{getFormattedDate(formData.logDate)}</h2>
                    <p>Week {currentWeek} · {attachment ? `${attachment.organization_name || 'Your Organization'}` : 'Loading...'}</p>
                  </div>
                  <div className={styles.dateChip}>{isToday(formData.logDate) ? 'Today' : 'Past Date'}</div>
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
                    <h2>{getFormattedDate(formData.logDate)}</h2>
                    <p>Week {currentWeek} · {attachment ? `${attachment.organization_name || 'Your Organization'}` : 'Loading...'}</p>
                  </div>
                  <div className={styles.dateChip} style={{background: 'var(--green)'}}>
                    Submitted
                  </div>
                </div>
                <div className={styles.formCardBody}>
                  <div className={styles.field}>
                    <label>Tasks performed</label>
                    <div className={styles.readonlyField}>
                      {formData.tasks || 'No tasks recorded'}
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label>Skills acquired</label>
                    <div className={styles.readonlyField}>
                      {formData.skills || 'No skills recorded'}
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label>Observations</label>
                    <div className={styles.readonlyField}>
                      {formData.observations || 'No observations recorded'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBMIT SECTION */}
            {(mode === 'new' || mode === 'offline' || mode === 'edit') && (
              <div className={styles.submitSection} id="submit-section">
                <div className={styles.submitTop}>
                  <span className={styles.warnIcon}>⚠</span>
                  <div className={styles.warnText}>
                    <h3>Ready to submit?</h3>
                    <p>Once submitted this log cannot be edited. It will be included in your Week {currentWeek} review which both supervisors will receive at the end of the week.</p>
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
                    {mode === 'edit' ? 'Update and submit log' : 'Submit log for today'}
                  </button>
                </div>
              </div>
            )}

            {/* SUCCESS */}
            {mode === 'submitted' && (
              <div className={styles.successCard} id="success-card">
                <div className={styles.successIcon}>✓</div>
                <h2>Log submitted</h2>
                <p>Your {getFormattedDate(formData.logDate)} log has been saved. It will be bundled with the rest of your Week {currentWeek} logs and sent to your supervisors for review.</p>
                <button 
                  className={styles.btnBack} 
                  onClick={() => {
                    setModeHandler('new');
                    setFormData({
                      tasks: '',
                      skills: '',
                      observations: '',
                      logDate: getLocalDateString()
                    });
                    setCharCounts({ tasks: 0, skills: 0 });
                    setError(null);
                    setSuccess(false);
                  }}
                >
                  Create another log
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {showModal && (
        <>
          {console.log('🔍 Modal JSX is rendering!')}
          <div className={`${styles.modalOverlay} ${styles.open}`} id="modal">
            <div className={styles.modal}>
              <h3>Submit this log?</h3>
              <p>You're about to submit your log for <strong>{getFormattedDate(formData.logDate)}</strong>. Once submitted it cannot be edited. Your supervisors will review it at the end of Week {currentWeek}.</p>
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
        </>
      )}
    </div>
  );
};

export default CreateDailyLog;
