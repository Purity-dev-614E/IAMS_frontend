import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './IndustryReviewScreen.module.css';
import ActiveReview from '../widgets/ActiveReview';
import SuccessState from '../widgets/SuccessState';
import UsedState from '../widgets/UsedState';
import ExpiredState from '../widgets/ExpiredState';

const IndustryReviewScreen = () => {
  const { token } = useParams();
  const [activeTab, setActiveTab] = useState('active');
  const [approvalDecision, setApprovalDecision] = useState('');
  const [comments, setComments] = useState('');
  const [improvements, setImprovements] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleApprovalPick = (decision) => {
    setApprovalDecision(decision);
  };

  const handleSubmit = () => {
    if (!approvalDecision) {
      return;
    }
    if (!comments.trim()) {
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setActiveTab('success');
      setIsSubmitting(false);
    }, 900);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'active':
        return (
          <ActiveReview
            approvalDecision={approvalDecision}
            setApprovalDecision={setApprovalDecision}
            comments={comments}
            setComments={setComments}
            improvements={improvements}
            setImprovements={setImprovements}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        );

      case 'success':
        return <SuccessState />;

      case 'used':
        return <UsedState />;

      case 'expired':
        return <ExpiredState />;

      default:
        return null;
    }
  };

  return (
    <div className={styles.reviewContainer}>
      <div className={styles.stateBar}>
        <span className={styles.barLabel}>State</span>
        <button 
          className={`${styles.tab} ${activeTab === 'active' ? styles.active : ''}`} 
          onClick={() => handleTabChange('active')}
        >
          Active
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'success' ? styles.active : ''}`} 
          onClick={() => handleTabChange('success')}
        >
          Submitted
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'used' ? styles.active : ''}`} 
          onClick={() => handleTabChange('used')}
        >
          Already used
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'expired' ? styles.active : ''}`} 
          onClick={() => handleTabChange('expired')}
        >
          Expired
        </button>
      </div>

      <div className={styles.nav}>
        <div className={styles.navLogo}>
          <div className={styles.navMark}>IA</div>
          <span className={styles.navBrand}>IAMS · JKUAT</span>
        </div>
        <span className={styles.navTitle}>Industrial Attachment Management System</span>
      </div>

      {renderContent()}
    </div>
  );
};

export default IndustryReviewScreen;
