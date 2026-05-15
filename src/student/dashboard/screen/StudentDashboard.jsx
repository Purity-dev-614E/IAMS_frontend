import React, { useState, useEffect } from 'react';
import styles from './StudentDashboard.module.css';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';
import { profileService } from '../../../shared/profile/profileService';
import { useAuth } from '../../../contexts/AuthContext';
import { studentDashboardService } from '../services/studentDashboardService';
import { apiClient } from '../../../apis';
import { API_ROUTES } from '../../../apis/apiRoutes';
import { 
  Topbar,
  AlertBanner,
  StatsGrid,
  LogCTA,
  ThisWeekLogs,
  WeeklyReviews,
  AttachmentInfo,
  Reminders
} from '../widgets';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dashboard data state
  const [dashboardData, setDashboardData] = useState({
    student: null,
    activeAttachment: null,
    statistics: null,
    weeklyReviews: [],
    thisWeekLogs: []
  });

  // Fetch dashboard data on component mount
  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const rawData = await studentDashboardService.fetchDashboardData();
      
      // Also fetch logs for the current week
      let weekLogs = [];
      try {
        const logsResponse = await apiClient.get(`${API_ROUTES.dailyLogs.myLogs}?limit=5`);
        if (logsResponse.success) {
          weekLogs = logsResponse.logs || [];
        }
      } catch (logErr) {
        console.error('Error fetching logs for dashboard:', logErr);
      }
      
      setDashboardData({
        student: studentDashboardService.transformStudentData(rawData.student),
        activeAttachment: studentDashboardService.transformAttachmentData(rawData.activeAttachment),
        statistics: studentDashboardService.transformStatistics(rawData.statistics),
        weeklyReviews: studentDashboardService.transformWeeklyReviews(rawData.weeklyReviews),
        thisWeekLogs: weekLogs
      });
      
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !dashboardData.student) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      {/* SIDEBAR */}
      <AppSidebar 
        navigationItems={profileService.getNavigationItems(user)} 
        user={profileService.getUserDisplayInfo(user)}
      />
      
      {/* MAIN */}
      <div className={styles.main}>
        {/* TOPBAR */}
        <Topbar student={dashboardData.student} />
        
        {/* CONTENT */}
        <div className={styles.content}>
          {error && (
            <div className={styles.errorBanner}>
              {error}
              <button onClick={loadDashboardData} className={styles.retryBtn}>Retry</button>
            </div>
          )}

          {/* Alert: today's log missing */}
          <AlertBanner statistics={dashboardData.statistics} />
          
          {/* STATS */}
          <StatsGrid 
            statistics={dashboardData.statistics} 
            activeAttachment={dashboardData.activeAttachment} 
          />
          
          {/* LOG CTA */}
          <LogCTA activeAttachment={dashboardData.activeAttachment} />
          
          {/* MAIN GRID */}
          <div className={styles.mainGrid}>
            {/* LEFT: This week's logs */}
            <div>
              <ThisWeekLogs 
                logs={dashboardData.thisWeekLogs} 
                statistics={dashboardData.statistics} 
              />
              
              {/* Weekly reviews */}
              <WeeklyReviews reviews={dashboardData.weeklyReviews} />
            </div>
            
            {/* RIGHT COLUMN */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
              {/* Attachment details */}
              <AttachmentInfo 
                student={dashboardData.student}
                attachment={dashboardData.activeAttachment} 
              />
              
              {/* Quick tips */}
              <Reminders />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
