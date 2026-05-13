import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { profileService } from '../../../shared/profile/profileService';
import adminReportsService from '../services/adminReportsService';
import styles from './Reports.module.css';
import ReportBuilder from '../widgets/ReportBuilder';
import ReportHistory from '../widgets/ReportHistory';
import GeneratingOverlay from '../widgets/GeneratingOverlay';
import Toast from '../../../shared/widgets/Toast';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';

const Reports = () => {
  const { user } = useAuth();
  const [navigationItems, setNavigationItems] = useState([]);
  const [userDisplayInfo, setUserDisplayInfo] = useState({});

  useEffect(() => {
    if (user) {
      setNavigationItems(profileService.getNavigationItems(user));
      setUserDisplayInfo(profileService.getUserDisplayInfo(user));
    }
  }, [user]);

  const [reportHistory, setReportHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toast, setToast] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });

  const showToast = (message, type = 'success') => {
    setToast({
      message,
      type,
      isVisible: true
    });
  };

  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  const handleGenerateReport = async (reportConfig) => {
    try {
      setIsGenerating(true);
      setError(null);
      setCurrentReport(reportConfig);
      setIsSuccess(false);

      let reportData;
      
      // Call appropriate API based on report type
      switch (reportConfig.type) {
        case 'student':
          reportData = await adminReportsService.generateStudentReport(
            reportConfig.studentId, 
            reportConfig.format
          );
          break;
          
        case 'cohort':
          reportData = await adminReportsService.generateCohortReport({
            program: reportConfig.program,
            year: reportConfig.year,
            startDate: reportConfig.startDate,
            endDate: reportConfig.endDate,
            format: reportConfig.format
          });
          break;
          
        case 'weekly-review':
          reportData = await adminReportsService.generateWeeklyReviewStatusReport({
            status: reportConfig.status,
            startDate: reportConfig.startDate,
            endDate: reportConfig.endDate,
            format: reportConfig.format
          });
          break;
          
        default:
          throw new Error('Invalid report type');
      }

      // Store report data for download
      setCurrentReport({
        ...reportConfig,
        data: reportData.report || reportData
      });
      
      setIsSuccess(true);
    } catch (error) {
      console.error('Error generating report:', error);
      setError(error.message);
      showToast(error.message, 'error');
      setIsGenerating(false);
      setCurrentReport(null);
    }
  };

  const handleDownloadReport = async (reportConfig) => {
    try {
      const reportToDownload = reportConfig || currentReport;
      
      if (!reportToDownload) {
        throw new Error('No report data available for download');
      }

      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${reportToDownload.type}_report_${timestamp}.${reportToDownload.format}`;

      // Download the report
      await adminReportsService.downloadReport(
        reportToDownload.data, 
        filename
      );

      // Add to history if it's a newly generated report
      if (!reportConfig) {
        const newReport = adminReportsService.formatReportForDisplay(
          reportToDownload.data, 
          reportToDownload.type
        );
        setReportHistory(prev => [newReport, ...prev]);
      }

      setIsSuccess(false);
      setCurrentReport(null);
      showToast('Report downloaded successfully');
    } catch (error) {
      console.error('Error downloading report:', error);
      showToast(error.message, 'error');
    }
  };

  const handleCloseGenerating = () => {
    setIsGenerating(false);
    setIsSuccess(false);
    setCurrentReport(null);
    setError(null);
  };

  const getReportName = (type) => {
    const names = {
      cohort: 'Cohort Overview',
      student: 'Student Detail Report',
      'weekly-review': 'Weekly Review Status',
      'end-of-attachment': 'End of Attachment Reports'
    };
    return names[type] || 'Report';
  };

  // Load initial report history (end of attachment reports)
  const loadReportHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminReportsService.getEndOfAttachmentReports({
        page: 1,
        limit: 10
      });
      
      const formattedReports = response.reports.map(report => 
        adminReportsService.formatReportForDisplay(report, 'end-of-attachment')
      );
      
      setReportHistory(formattedReports);
    } catch (error) {
      console.error('Error loading report history:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setNavigationItems(profileService.getNavigationItems(user));
      setUserDisplayInfo(profileService.getUserDisplayInfo(user));
      loadReportHistory();
    }
  }, [user]);

  return (
    <div className={styles.shell}>
      <AppSidebar 
        navigationItems={navigationItems} 
        user={userDisplayInfo}
      />

      <div className={styles.main}>
        <div className={styles.topbar}>
          <div>
            <div className={styles.topbarTitle}>Reports</div>
            <div className={styles.topbarSubtitle}>Generate and download system reports</div>
          </div>
        </div>

        <div className={styles.content}>
          {error && (
            <div className={styles.errorMessage}>
              Error: {error}
              <button 
                onClick={loadReportHistory}
                className={styles.retryButton}
              >
                Retry
              </button>
            </div>
          )}
          
          <div className={styles.layout}>
            <ReportBuilder 
              onGenerate={handleGenerateReport}
              isGenerating={isGenerating}
            />
            <ReportHistory 
              history={reportHistory}
              loading={loading}
              onDownload={(report) => {
                // For historical reports, we'd need to fetch the actual report data
                showToast(`Downloading ${report.name}...`);
              }}
            />
          </div>
        </div>
      </div>

      <GeneratingOverlay
        isGenerating={isGenerating}
        isSuccess={isSuccess}
        onDownload={handleDownloadReport}
        onClose={handleCloseGenerating}
        reportData={currentReport}
      />

      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default Reports;
