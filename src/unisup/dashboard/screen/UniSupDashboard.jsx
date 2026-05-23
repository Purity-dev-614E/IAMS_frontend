import React, { useState, useEffect } from 'react';
import { AlertCircle, ClipboardCheck, LoaderCircle, RefreshCw } from 'lucide-react';
import styles from './UniSupDashboard.module.css';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';
import UniSupTopbar from '../widgets/UniSupTopbar';
import UniSupStatsGrid from '../widgets/UniSupStatsGrid';
import StudentList from '../widgets/StudentList';
import StudentDetailPanel from '../widgets/StudentDetailPanel';
import { useAuth } from '../../../contexts/AuthContext';
import { profileService } from '../../../shared/profile/profileService';
import { uniSupDashboardService } from '../services/uniSupDashboardService';

const UniSupDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [profileData, setProfileData] = useState(null);
  
  // Dashboard data state
  const [dashboardData, setDashboardData] = useState({
    supervisor: null,
    statistics: null,
    pendingIndustryFeedback: [],
    studentsWithOverdueLogs: []
  });

  // Fetch data on component mount
  useEffect(() => {
    if (user) {
      loadDashboardData();
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      const profile = await profileService.fetchProfile();
      setProfileData(profile);
    } catch (error) {
      console.error('Profile fetch error:', error);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const rawData = await uniSupDashboardService.fetchDashboardData();
      
      setDashboardData({
        supervisor: uniSupDashboardService.transformOverviewStats(rawData.supervisor),
        statistics: uniSupDashboardService.transformReviewStats(rawData.statistics),
        pendingIndustryFeedback: uniSupDashboardService.transformPendingFeedback(rawData.pendingIndustryFeedback),
        studentsWithOverdueLogs: uniSupDashboardService.transformOverdueLogs(rawData.studentsWithOverdueLogs)
      });
      
    } catch (err) {
      console.error('Error loading supervisor dashboard:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  if (loading && !dashboardData.supervisor) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}>
          <LoaderCircle size={22} className={styles.spin} />
          <strong>Loading supervisor dashboard</strong>
          <span>Pulling assigned students, weekly reviews, and feedback status.</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      {/* SIDEBAR */}
      <AppSidebar 
        navigationItems={profileService.getNavigationItems(profileData || user)} 
        user={profileService.getUserDisplayInfo(profileData || user)}
      />
      
      {/* MAIN */}
      <div className={styles.main}>
        {/* TOPBAR */}
        <UniSupTopbar user={profileData || user} />
        
        {/* CONTENT */}
        <div className={styles.content}>
          {error && (
            <div className={styles.errorBanner}>
              <span className={styles.errorText}>
                <AlertCircle size={16} />
                {error}
              </span>
              <button onClick={loadDashboardData} className={styles.retryBtn}>
                <RefreshCw size={13} />
                Retry
              </button>
            </div>
          )}

          <div className={styles.focusBand}>
            <div className={styles.focusIcon}>
              <ClipboardCheck size={22} />
            </div>
            <div>
              <div className={styles.focusTitle}>Supervisor focus</div>
              <p>
                {dashboardData.statistics?.pending > 0
                  ? `${dashboardData.statistics.pending} weekly reviews need your feedback.`
                  : 'No pending university feedback right now.'}
                {' '}
                {dashboardData.studentsWithOverdueLogs.length > 0
                  ? `${dashboardData.studentsWithOverdueLogs.length} students have overdue logs.`
                  : 'Student log activity is currently on track.'}
              </p>
            </div>
          </div>

          {/* STATS */}
          <UniSupStatsGrid 
            overview={dashboardData.supervisor} 
            statistics={dashboardData.statistics} 
          />
          
          {/* MAIN GRID */}
          <div className={styles.mainGrid}>
            {/* LEFT: Student list */}
            <StudentList 
              onStudentSelect={handleStudentSelect}
              selectedStudent={selectedStudent}
              overdueStudents={dashboardData.studentsWithOverdueLogs}
              pendingFeedback={dashboardData.pendingIndustryFeedback}
            />
            
            {/* RIGHT: Detail panel */}
            <StudentDetailPanel student={selectedStudent} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniSupDashboard;
