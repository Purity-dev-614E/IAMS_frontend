import React, { useState } from 'react';
import styles from './MyAttachmentsWidget.module.css';
import AttachmentSidebar from '../widgets/AttachmentSidebar';
import AttachmentTopbar from '../widgets/AttachmentTopbar';
import EmptyState from '../widgets/EmptyState';
import PendingNotice from '../widgets/PendingNotice';
import AttachmentCard from '../widgets/AttachmentCard';
import RegisterForm from '../widgets/RegisterForm';

const MyAttachments = () => {
  const [activeView, setActiveView] = useState('active');
  const [formData, setFormData] = useState({
    organization: '',
    supervisorName: '',
    supervisorEmail: '',
    startDate: '2025-04-07',
    endDate: '2025-06-20'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleSubmitForm = () => {
    console.log('Submitting attachment registration:', formData);
    setActiveView('pending');
  };

  const handleViewLogs = () => {
    console.log('Navigate to logs page');
    // Navigation logic here
  };

  const handleRegister = () => {
    setActiveView('register');
  };

  const handleCancel = () => {
    setActiveView('empty');
  };

  return (
    <div className={styles.shell}>
      <AttachmentSidebar />
      
      <div className={styles.main}>
        <AttachmentTopbar 
          activeView={activeView} 
          onViewChange={handleViewChange} 
        />
        
        <div className={styles.content}>
          <div className={styles.pageInner}>
            <div className={styles.pageHeader}>
              <h1>My Attachment</h1>
              <p>Your industrial attachment details and progress for the 2025 cohort.</p>
            </div>

            {/* EMPTY STATE */}
            {activeView === 'empty' && (
              <EmptyState onRegister={handleRegister} />
            )}

            {/* PENDING STATE */}
            {activeView === 'pending' && (
              <>
                <PendingNotice />
                <AttachmentCard
                  organization="Kenya Airways"
                  department="Nairobi · IT Department"
                  status="Pending activation"
                  industrySupervisor="Peter Njoroge"
                  industrySupervisorEmail="p.njoroge@kenya-airways.com"
                  universitySupervisor="Not yet assigned"
                  startDate="1 April 2025"
                  endDate="20 June 2025"
                  submissionDate="Submitted for review 31 Mar 2025"
                />
              </>
            )}

            {/* ACTIVE STATE */}
            {activeView === 'active' && (
              <AttachmentCard
                organization="Safaricom PLC"
                department="Nairobi · Software Engineering Department"
                status="Active"
                industrySupervisor="James Mwangi"
                industrySupervisorEmail="j.mwangi@safaricom.co.ke"
                universitySupervisor="Dr. F. Kamau"
                startDate="17 February 2025"
                endDate="2 May 2025"
                duration="11 weeks"
                currentWeek="Week 6 of 11"
                progress={{
                  percentage: 74,
                  currentLabel: "Today — Week 6"
                }}
                activationDate="Activated 17 Feb 2025"
                lastLogDate="Last log submitted today"
                onViewLogs={handleViewLogs}
              />
            )}

            {/* REGISTER FORM */}
            {activeView === 'register' && (
              <RegisterForm
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmitForm}
                onCancel={handleCancel}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAttachments;
