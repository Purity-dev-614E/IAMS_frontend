import React, { useCallback, useEffect, useState } from 'react';
import { LoaderCircle, RefreshCw } from 'lucide-react';
import { useParams } from 'react-router-dom';
import styles from './IndustryReviewScreen.module.css';
import ActiveReview from '../widgets/ActiveReview';
import SuccessState from '../widgets/SuccessState';
import UsedState from '../widgets/UsedState';
import ExpiredState from '../widgets/ExpiredState';
import { industryReviewService } from '../services/industryReviewService';

const IndustryReviewScreen = () => {
  const { token } = useParams();
  const [review, setReview] = useState(null);
  const [screenState, setScreenState] = useState('loading');
  const [approvalDecision, setApprovalDecision] = useState('');
  const [comments, setComments] = useState('');
  const [improvements, setImprovements] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [loadError, setLoadError] = useState('');

  const loadReview = useCallback(async () => {
    if (!token) {
      setScreenState('error');
      setLoadError('This review link is missing its access token.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setLoadError('');
      const reviewData = await industryReviewService.getReview(token);
      setReview(reviewData);
      setScreenState(reviewData.status || 'active');
    } catch (error) {
      const message = error.message || 'Unable to load this review link.';
      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes('expired')) {
        setScreenState('expired');
      } else if (lowerMessage.includes('used') || lowerMessage.includes('submitted')) {
        setScreenState('used');
      } else {
        setScreenState('error');
        setLoadError(message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadReview();
  }, [loadReview]);

  const handleSubmit = async () => {
    setFormError('');

    if (!approvalDecision) {
      setFormError('Choose whether to approve or reject this week before submitting.');
      return;
    }

    if (!comments.trim()) {
      setFormError('Add a short comment so the student and university supervisor have context.');
      return;
    }

    try {
      setIsSubmitting(true);
      const submittedReview = await industryReviewService.submitFeedback(token, {
        approvalDecision,
        comments,
        improvements
      });

      setReview((current) => ({
        ...current,
        ...submittedReview,
        student: current?.student || submittedReview.student,
        logs: current?.logs || submittedReview.logs,
        week: current?.week || submittedReview.week,
        period: current?.period || submittedReview.period
      }));
      setScreenState('success');
    } catch (error) {
      const message = error.message || 'Review submission failed. Please try again.';
      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes('expired')) {
        setScreenState('expired');
      } else if (lowerMessage.includes('used') || lowerMessage.includes('submitted')) {
        setScreenState('used');
      } else {
        setFormError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (isLoading || screenState === 'loading') {
      return (
        <div className={styles.statePage}>
          <LoaderCircle size={24} className={styles.spin} />
          <h1>Loading review</h1>
          <p>Opening the weekly logs attached to this supervisor link.</p>
        </div>
      );
    }

    switch (screenState) {
      case 'active':
        return (
          <ActiveReview
            review={review}
            approvalDecision={approvalDecision}
            setApprovalDecision={setApprovalDecision}
            comments={comments}
            setComments={setComments}
            improvements={improvements}
            setImprovements={setImprovements}
            isSubmitting={isSubmitting}
            formError={formError}
            onSubmit={handleSubmit}
          />
        );

      case 'success':
        return <SuccessState review={review} />;

      case 'used':
        return <UsedState review={review} />;

      case 'expired':
        return <ExpiredState review={review} />;

      case 'error':
        return (
          <div className={styles.statePage}>
            <div className={styles.errorIcon}>!</div>
            <h1>Review unavailable</h1>
            <p>{loadError || 'We could not open this review link. Please check the link and try again.'}</p>
            <button className={styles.retryButton} onClick={loadReview}>
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.reviewContainer}>
      <div className={styles.nav}>
        <div className={styles.navLogo}>
          <div className={styles.navMark}>IA</div>
          <span className={styles.navBrand}>IAMS - JKUAT</span>
        </div>
        <span className={styles.navTitle}>Industrial Attachment Management System</span>
      </div>

      {renderContent()}
    </div>
  );
};

export default IndustryReviewScreen;
