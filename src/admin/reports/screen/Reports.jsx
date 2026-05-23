import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiActivity, FiCheckCircle, FiClock, FiDownload, FiFileText, FiRefreshCw, FiUsers } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';
import { profileService } from '../../../shared/profile/profileService';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';
import Toast from '../../../shared/widgets/Toast';
import adminReportsService from '../services/adminReportsService';
import styles from './Reports.module.css';

const emptySummary = {
  attachments: { pending: 0, active: 0, inactive: 0, complete: 0 },
  weeklyReviews: { total: 0, pending: 0, industryReviewed: 0, universityReviewed: 0, complete: 0 },
  dailyLogs: { submitted: 0, draft: 0, missingExpected: 0 },
  supervisorCoverage: { assignedStudents: 0, unassignedStudents: 0 },
  finalReports: { eligible: 0, submitted: 0, pending: 0, readyForReview: 0 }
};

const reportActions = [
  {
    id: 'weekly-review-status',
    title: 'Weekly review status',
    description: 'Shows review completion across the cohort, including pending industry and university supervisor feedback.',
    metric: 'Core weekly workflow'
  },
  {
    id: 'attachment-summary',
    title: 'Attachment summary',
    description: 'Summarizes attachments by Pending, Active, Inactive, and Complete so admin can spot lifecycle issues.',
    metric: 'Attachment lifecycle'
  },
  {
    id: 'final-report-readiness',
    title: 'Final report readiness',
    description: 'Shows how many students are eligible, submitted, or still pending final attachment reports.',
    metric: 'End-of-attachment'
  }
];

const formatNumber = (value) => Number(value || 0).toLocaleString();

const Reports = () => {
  const { user } = useAuth();
  const [navigationItems, setNavigationItems] = useState([]);
  const [userDisplayInfo, setUserDisplayInfo] = useState({});
  const [summary, setSummary] = useState(emptySummary);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState('');
  const [activeReportId, setActiveReportId] = useState('');
  const [generatedReport, setGeneratedReport] = useState(null);
  const [toast, setToast] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });

  useEffect(() => {
    if (user) {
      setNavigationItems(profileService.getNavigationItems(user));
      setUserDisplayInfo(profileService.getUserDisplayInfo(user));
    }
  }, [user]);

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

  const loadSummary = useCallback(async () => {
    try {
      setIsSummaryLoading(true);
      setSummaryError('');
      const data = await adminReportsService.getAdminReportsSummary();
      setSummary({
        ...emptySummary,
        ...data,
        attachments: { ...emptySummary.attachments, ...data?.attachments },
        weeklyReviews: { ...emptySummary.weeklyReviews, ...data?.weeklyReviews },
        dailyLogs: { ...emptySummary.dailyLogs, ...data?.dailyLogs },
        supervisorCoverage: { ...emptySummary.supervisorCoverage, ...data?.supervisorCoverage },
        finalReports: { ...emptySummary.finalReports, ...data?.finalReports }
      });
    } catch (error) {
      setSummaryError(error.message || 'Failed to load report summary');
      showToast(error.message || 'Failed to load report summary', 'error');
    } finally {
      setIsSummaryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadSummary();
    }
  }, [loadSummary, user]);

  const summaryCards = useMemo(() => [
    {
      id: 'attachments',
      title: 'Attachment status',
      value: `${formatNumber(summary.attachments.pending)} pending / ${formatNumber(summary.attachments.active)} active`,
      note: `${formatNumber(summary.attachments.inactive)} inactive / ${formatNumber(summary.attachments.complete)} complete`,
      icon: FiActivity
    },
    {
      id: 'reviews',
      title: 'Weekly reviews',
      value: `${formatNumber(summary.weeklyReviews.complete)} complete of ${formatNumber(summary.weeklyReviews.total)}`,
      note: `${formatNumber(summary.weeklyReviews.pending)} pending reviews`,
      icon: FiCheckCircle
    },
    {
      id: 'logs',
      title: 'Daily logs',
      value: `${formatNumber(summary.dailyLogs.submitted)} submitted`,
      note: `${formatNumber(summary.dailyLogs.draft)} draft / ${formatNumber(summary.dailyLogs.missingExpected)} missing`,
      icon: FiClock
    },
    {
      id: 'coverage',
      title: 'Supervisor coverage',
      value: `${formatNumber(summary.supervisorCoverage.assignedStudents)} assigned`,
      note: `${formatNumber(summary.supervisorCoverage.unassignedStudents)} students unassigned`,
      icon: FiUsers
    }
  ], [summary]);

  const operationalChecks = useMemo(() => [
    {
      label: 'Students without university supervisors',
      value: formatNumber(summary.supervisorCoverage.unassignedStudents),
      state: summary.supervisorCoverage.unassignedStudents > 0 ? 'warn' : 'ok'
    },
    {
      label: 'Attachments pending activation',
      value: formatNumber(summary.attachments.pending),
      state: summary.attachments.pending > 0 ? 'warn' : 'ok'
    },
    {
      label: 'Weekly reviews pending',
      value: formatNumber(summary.weeklyReviews.pending),
      state: summary.weeklyReviews.pending > 0 ? 'warn' : 'ok'
    },
    {
      label: 'Final reports ready for review',
      value: formatNumber(summary.finalReports.readyForReview),
      state: summary.finalReports.readyForReview > 0 ? 'warn' : 'ok'
    }
  ], [summary]);

  const handleGenerate = async (report) => {
    try {
      setActiveReportId(report.id);
      const data = await adminReportsService.generateAdminReport(report.id);
      setGeneratedReport(data);
      showToast(`${data.title || report.title} generated`);
    } catch (error) {
      showToast(error.message || 'Failed to generate report', 'error');
    } finally {
      setActiveReportId('');
    }
  };

  const handleExportReport = async () => {
    if (!generatedReport) return;

    try {
      await adminReportsService.downloadTableReport(generatedReport);
      showToast('Report exported');
    } catch (error) {
      showToast(error.message || 'Failed to export report', 'error');
    }
  };

  const handleExportSummary = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Attachments pending', summary.attachments.pending],
      ['Attachments active', summary.attachments.active],
      ['Attachments inactive', summary.attachments.inactive],
      ['Attachments complete', summary.attachments.complete],
      ['Weekly reviews total', summary.weeklyReviews.total],
      ['Weekly reviews pending', summary.weeklyReviews.pending],
      ['Weekly reviews industry reviewed', summary.weeklyReviews.industryReviewed],
      ['Weekly reviews university reviewed', summary.weeklyReviews.universityReviewed],
      ['Weekly reviews complete', summary.weeklyReviews.complete],
      ['Daily logs submitted', summary.dailyLogs.submitted],
      ['Daily logs draft', summary.dailyLogs.draft],
      ['Daily logs missing expected', summary.dailyLogs.missingExpected],
      ['Assigned students', summary.supervisorCoverage.assignedStudents],
      ['Unassigned students', summary.supervisorCoverage.unassignedStudents],
      ['Final reports eligible', summary.finalReports.eligible],
      ['Final reports submitted', summary.finalReports.submitted],
      ['Final reports pending', summary.finalReports.pending],
      ['Final reports ready for review', summary.finalReports.readyForReview]
    ];
    const report = {
      type: 'cohort-summary',
      columns: [
        { key: 'metric', label: 'Metric' },
        { key: 'value', label: 'Value' }
      ],
      rows: rows.slice(1).map(([metric, value]) => ({ metric, value }))
    };

    adminReportsService.downloadTableReport(report);
    showToast('Cohort summary exported');
  };

  const generatedAt = generatedReport?.generatedAt
    ? new Date(generatedReport.generatedAt).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })
    : null;

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
            <div className={styles.topbarSubtitle}>Cohort health, weekly review progress, and final report readiness</div>
          </div>
          <button className={styles.topbarButton} onClick={handleExportSummary} disabled={isSummaryLoading}>
            <FiDownload />
            Export cohort summary
          </button>
        </div>

        <div className={styles.content}>
          {summaryError && (
            <div className={styles.errorMessage}>
              <span>{summaryError}</span>
              <button onClick={loadSummary}>Retry</button>
            </div>
          )}

          <section className={styles.overview}>
            {summaryCards.map(card => {
              const Icon = card.icon;
              return (
                <div key={card.id} className={styles.summaryCard}>
                  <div className={styles.summaryIcon}>
                    <Icon />
                  </div>
                  <div>
                    <div className={styles.summaryTitle}>{card.title}</div>
                    <div className={styles.summaryValue}>{isSummaryLoading ? 'Loading...' : card.value}</div>
                    <div className={styles.summaryNote}>{isSummaryLoading ? 'Fetching latest totals' : card.note}</div>
                  </div>
                </div>
              );
            })}
          </section>

          <div className={styles.layout}>
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <div className={styles.panelTitle}>Essential reports</div>
                  <div className={styles.panelSub}>Generate a preview table, then export it as CSV.</div>
                </div>
                <span className={styles.dataBadge}>Live backend data</span>
              </div>

              <div className={styles.reportList}>
                {reportActions.map(report => (
                  <article key={report.id} className={styles.reportItem}>
                    <div className={styles.reportMain}>
                      <div className={styles.reportIcon}>
                        <FiFileText />
                      </div>
                      <div>
                        <div className={styles.reportTitle}>{report.title}</div>
                        <p>{report.description}</p>
                        <span>{report.metric}</span>
                      </div>
                    </div>
                    <button
                      className={styles.reportButton}
                      onClick={() => handleGenerate(report)}
                      disabled={Boolean(activeReportId)}
                    >
                      {activeReportId === report.id ? 'Generating...' : 'Generate'}
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <aside className={styles.sidePanel}>
              <div className={styles.panelHeader}>
                <div>
                  <div className={styles.panelTitle}>Admin attention</div>
                  <div className={styles.panelSub}>The counts that should drive action.</div>
                </div>
                <button className={styles.iconButton} onClick={loadSummary} disabled={isSummaryLoading}>
                  <FiRefreshCw className={isSummaryLoading ? styles.spinIcon : ''} />
                </button>
              </div>

              <div className={styles.checkList}>
                {operationalChecks.map(check => (
                  <div key={check.label} className={styles.checkRow}>
                    <span className={`${styles.dot} ${check.state === 'ok' ? styles.dotOk : styles.dotWarn}`}></span>
                    <span>{check.label}</span>
                    <strong>{isSummaryLoading ? '--' : check.value}</strong>
                  </div>
                ))}
              </div>

              <div className={styles.noteBox}>
                <strong>Report preview</strong>
                <p>Each generated report uses backend-provided columns and rows, so all three report types render and export the same way.</p>
              </div>
            </aside>
          </div>

          {generatedReport && (
            <section className={styles.previewPanel}>
              <div className={styles.panelHeader}>
                <div>
                  <div className={styles.panelTitle}>{generatedReport.title || 'Generated report'}</div>
                  <div className={styles.panelSub}>
                    {generatedAt ? `Generated ${generatedAt}` : 'Generated report preview'}
                  </div>
                </div>
                <button className={styles.topbarButton} onClick={handleExportReport}>
                  <FiDownload />
                  Export CSV
                </button>
              </div>

              {generatedReport.rows?.length > 0 && generatedReport.columns?.length > 0 ? (
                <div className={styles.tableWrap}>
                  <table className={styles.previewTable}>
                    <thead>
                      <tr>
                        {generatedReport.columns.map(column => (
                          <th key={column.key}>{column.label || column.key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {generatedReport.rows.map((row, rowIndex) => (
                        <tr key={row.id || rowIndex}>
                          {generatedReport.columns.map(column => (
                            <td key={column.key}>{row[column.key] ?? '-'}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.emptyPreview}>
                  This report generated successfully, but there are no rows to preview yet.
                </div>
              )}
            </section>
          )}
        </div>
      </div>

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
