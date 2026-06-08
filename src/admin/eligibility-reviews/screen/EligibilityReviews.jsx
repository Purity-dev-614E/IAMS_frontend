import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';
import Toast from '../../../shared/widgets/Toast';
import { useAuth } from '../../../contexts/AuthContext';
import eligibilityReviewService from '../services/eligibilityReviewService';
import styles from './EligibilityReviews.module.css';

const adminNavigationItems = [
  {
    title: 'System',
    items: [
      { to: '/admin', label: 'Dashboard', icon: 'D' },
      { to: '/admin/users', label: 'Users', icon: 'U' },
      { to: '/admin/students', label: 'Students', icon: 'S' },
      { to: '/admin/attachments', label: 'Attachments', icon: 'A' },
      { to: '/admin/eligibility-reviews', label: 'Eligibility Reviews', icon: 'E' },
    ]
  },
  {
    title: 'Actions',
    items: [
      { to: '/admin/supervisors/pending', label: 'Supervisor Approval', icon: 'V' },
      { to: '/admin/reports', label: 'Reports', icon: 'R' },
    ]
  }
];

const getValue = (review, keys, fallback = '-') => {
  for (const key of keys) {
    const value = key.split('.').reduce((current, part) => current?.[part], review);
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return fallback;
};

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

const EligibilityReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [decision, setDecision] = useState('approved');
  const [adminComment, setAdminComment] = useState('');
  const [expiresAt, setExpiresAt] = useState('2026-12-31');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const pendingCount = useMemo(
    () => reviews.filter(review => getValue(review, ['status'], '') === 'pending').length,
    [reviews]
  );

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await eligibilityReviewService.getReviews(status);
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast(error.message || 'Failed to fetch eligibility reviews', 'error');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const openDecision = (review, nextDecision) => {
    setSelectedReview(review);
    setDecision(nextDecision);
    setAdminComment(nextDecision === 'approved'
      ? 'Approved because student academic status supports attachment eligibility.'
      : 'Student is not currently eligible for attachment registration.');
    setExpiresAt('2026-12-31');
  };

  const submitDecision = async () => {
    if (!selectedReview) return;
    setSaving(true);
    try {
      const payload = { status: decision, admin_comment: adminComment };
      if (decision === 'approved' && expiresAt) payload.expires_at = expiresAt;

      await eligibilityReviewService.updateReview(selectedReview.id || selectedReview.review_id, payload);
      showToast(`Review ${decision}`);
      setSelectedReview(null);
      await fetchReviews();
    } catch (error) {
      showToast(error.message || 'Failed to update review', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.shell}>
      <AppSidebar
        navigationItems={adminNavigationItems}
        user={user ? {
          initials: 'AD',
          name: user.name || user.userName || 'Admin',
          role: 'System Administrator'
        } : null}
      />

      <main className={styles.main}>
        <div className={styles.topbar}>
          <div>
            <div className={styles.topbarTitle}>Eligibility Reviews</div>
            <div className={styles.topbarSubtitle}>
              {loading ? 'Loading requests...' : `${reviews.length} requests - ${pendingCount} pending`}
            </div>
          </div>
          <select className={styles.statusSelect} value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="">All</option>
          </select>
        </div>

        <div className={styles.content}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Academic</th>
                  <th>Reason</th>
                  <th>Explanation</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan="7" className={styles.emptyCell}>Loading eligibility reviews...</td></tr>}
                {!loading && reviews.length === 0 && <tr><td colSpan="7" className={styles.emptyCell}>No eligibility reviews found.</td></tr>}

                {!loading && reviews.map((review) => {
                  const id = review.id || review.review_id;
                  const studentName = getValue(review, ['student.name', 'student.student_name', 'student_name', 'name']);
                  const regNumber = getValue(review, ['student.reg_number', 'reg_number', 'registration_number']);
                  const email = getValue(review, ['student.email', 'student.student_email', 'student_email', 'email']);
                  const school = getValue(review, ['student.school', 'school']);
                  const program = getValue(review, ['student.program', 'program']);
                  const year = getValue(review, ['student.year_of_study', 'year_of_study', 'yearOfStudy']);
                  const academicStatus = getValue(review, ['student.academic_status', 'academic_status', 'academicStatus']);
                  const reviewStatus = getValue(review, ['status'], 'pending');

                  return (
                    <tr key={id}>
                      <td>
                        <div className={styles.primary}>{studentName}</div>
                        <div className={styles.muted}>{regNumber}</div>
                        <div className={styles.muted}>{email}</div>
                      </td>
                      <td>
                        <div>{school}</div>
                        <div className={styles.muted}>{program} - Year {year}</div>
                        <div className={styles.muted}>{academicStatus}</div>
                      </td>
                      <td>{getValue(review, ['reason_type', 'reasonType'])}</td>
                      <td className={styles.explanation}>{getValue(review, ['explanation'])}</td>
                      <td>{formatDate(getValue(review, ['created_at', 'request_date', 'createdAt'], ''))}</td>
                      <td><span className={`${styles.badge} ${styles[reviewStatus] || ''}`}>{reviewStatus}</span></td>
                      <td>
                        <div className={styles.actionGroup}>
                          <button className={styles.approveBtn} onClick={() => openDecision(review, 'approved')}>Approve</button>
                          <button className={styles.rejectBtn} onClick={() => openDecision(review, 'rejected')}>Reject</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {selectedReview && (
        <div className={styles.backdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{decision === 'approved' ? 'Approve review' : 'Reject review'}</h2>
              <button onClick={() => setSelectedReview(null)} aria-label="Close decision modal">x</button>
            </div>
            <div className={styles.modalBody}>
              <label>
                Admin comment
                <textarea rows="4" value={adminComment} onChange={(event) => setAdminComment(event.target.value)} />
              </label>
              {decision === 'approved' && (
                <label>
                  Override expires at
                  <input type="date" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} />
                </label>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.secondaryBtn} onClick={() => setSelectedReview(null)} disabled={saving}>Cancel</button>
              <button className={decision === 'approved' ? styles.approveBtn : styles.rejectBtn} onClick={submitDecision} disabled={saving || !adminComment.trim()}>
                {saving ? 'Saving...' : decision === 'approved' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default EligibilityReviews;
