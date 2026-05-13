import React from 'react';
import styles from './ReportForm.module.css';

const ReportForm = ({ 
  formData, 
  onFormChange, 
  onFileUpload, 
  onRemoveFile, 
  onSubmit, 
  onSaveDraft,
  isLocked 
}) => {
  const handleInputChange = (field, value) => {
    onFormChange(field, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const simulateFileUpload = () => {
    // Simulate file upload for demo
    const simulatedFile = {
      name: 'Purity_Sang_Attachment_Report_2025.pdf',
      size: '2.4 MB'
    };
    onFileUpload(simulatedFile);
  };

  return (
    <div className={`${styles.formArea} ${isLocked ? styles.lockedForm : ''}`}>
      {/* Report details */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>Report details</div>
          <div className={styles.sectionSubtitle}>General information about your attachment</div>
        </div>
        <div className={styles.sectionBody}>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>Report title</div>
            <input
              type="text"
              placeholder="e.g. Industrial Attachment Report — Safaricom PLC 2025"
              value={formData.reportTitle}
              onChange={(e) => handleInputChange('reportTitle', e.target.value)}
              disabled={isLocked}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className={styles.field}>
              <div className={styles.fieldLabel}>Organization</div>
              <input
                type="text"
                value="Safaricom PLC"
                readOnly
                style={{ background: 'var(--surface)', color: 'var(--muted)' }}
              />
            </div>
            <div className={styles.field}>
              <div className={styles.fieldLabel}>Department / Unit</div>
              <input
                type="text"
                placeholder="e.g. Software Engineering"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                disabled={isLocked}
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className={styles.field}>
              <div className={styles.fieldLabel}>Start date</div>
              <input
                type="text"
                value="17 February 2025"
                readOnly
                style={{ background: 'var(--surface)', color: 'var(--muted)' }}
              />
            </div>
            <div className={styles.field}>
              <div className={styles.fieldLabel}>End date</div>
              <input
                type="text"
                value="2 May 2025"
                readOnly
                style={{ background: 'var(--surface)', color: 'var(--muted)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Written sections */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>Written report</div>
          <div className={styles.sectionSubtitle}>You can type directly or upload a PDF below</div>
        </div>
        <div className={styles.sectionBody}>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>Executive summary</div>
            <div className={styles.fieldHelp}>A brief overview of your attachment — what you did, where, and key outcomes (200–400 words)</div>
            <textarea
              rows="5"
              placeholder="Provide a concise summary of your industrial attachment experience..."
              value={formData.executiveSummary}
              onChange={(e) => handleInputChange('executiveSummary', e.target.value)}
              disabled={isLocked}
            />
          </div>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>Key activities and responsibilities</div>
            <div className={styles.fieldHelp}>Describe main tasks and projects you were involved in</div>
            <textarea
              rows="5"
              placeholder="During my attachment at Safaricom PLC, I was involved in..."
              value={formData.keyActivities}
              onChange={(e) => handleInputChange('keyActivities', e.target.value)}
              disabled={isLocked}
            />
          </div>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>Skills acquired</div>
            <div className={styles.fieldHelp}>Technical and professional skills you developed during attachment</div>
            <textarea
              rows="4"
              placeholder="List and briefly describe the key skills you developed..."
              value={formData.skillsAcquired}
              onChange={(e) => handleInputChange('skillsAcquired', e.target.value)}
              disabled={isLocked}
            />
          </div>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>Challenges and how you addressed them</div>
            <div className={styles.fieldHelp}>Reflect on difficulties you encountered and how you overcame them</div>
            <textarea
              rows="4"
              placeholder="One challenge I faced was..."
              value={formData.challenges}
              onChange={(e) => handleInputChange('challenges', e.target.value)}
              disabled={isLocked}
            />
          </div>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>Recommendations</div>
            <div className={styles.fieldHelp}>Suggestions for future students or improvements to attachment program</div>
            <textarea
              rows="3"
              placeholder="I would recommend that future students..."
              value={formData.recommendations}
              onChange={(e) => handleInputChange('recommendations', e.target.value)}
              disabled={isLocked}
            />
          </div>
        </div>
      </div>

      {/* File upload */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>Upload document</div>
          <div className={styles.sectionSubtitle}>Optional — upload a formatted PDF in addition to or instead of the written sections above</div>
        </div>
        <div className={styles.sectionBody}>
          <div 
            className={`${styles.uploadZone} ${formData.uploadedFile ? styles.hasFile : ''}`}
            onClick={!formData.uploadedFile ? simulateFileUpload : undefined}
          >
            {!formData.uploadedFile ? (
              <>
                <div className={styles.uzIcon}>📄</div>
                <div className={styles.uzTitle}>Click to upload your report PDF</div>
                <div className={styles.uzSub}>PDF only · max 10MB</div>
              </>
            ) : (
              <div className={styles.uzFile}>
                <span style={{ fontSize: '16px' }}>📄</span>
                <span className={styles.uzFname}>{formData.uploadedFile.name}</span>
                <span className={styles.uzFsize}>{formData.uploadedFile.size}</span>
                <button 
                  className={styles.uzRemove}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile();
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className={styles.submitSection}>
        <div className={styles.ssTop}>
          <span className={styles.ssIcon}>⚠</span>
          <div className={styles.ssText}>
            <h3>Ready to submit?</h3>
            <p>Once submitted your report cannot be edited. Your university supervisor and admin will be notified. Make sure all sections are complete before submitting.</p>
          </div>
        </div>
        <div className={styles.ssBtns}>
          <button className={styles.btnDraft} onClick={onSaveDraft}>
            Save draft
          </button>
          <button className={styles.btnSubmit} onClick={onSubmit}>
            Submit final report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;
