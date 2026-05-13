import React, { useState, useEffect } from 'react';
import styles from './ReportBuilder.module.css';

const ReportBuilder = ({ onGenerate, isGenerating }) => {
  const [selectedType, setSelectedType] = useState('cohort');
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [startDate, setStartDate] = useState('2025-02-17');
  const [endDate, setEndDate] = useState('2025-05-02');

  const reportTypes = [
    {
      id: 'cohort',
      name: 'Cohort overview',
      description: 'All students — submission rates, review completion',
      icon: '⊞',
      bgColor: 'var(--bl)'
    },
    {
      id: 'student',
      name: 'Student detail',
      description: 'One student\'s full log and feedback history',
      icon: '◉',
      bgColor: 'var(--gbg)'
    },
    {
      id: 'supervisor',
      name: 'Supervisor activity',
      description: 'Feedback rates and response times per supervisor',
      icon: '🎓',
      bgColor: 'var(--abg)'
    },
    {
      id: 'logs',
      name: 'Log export',
      description: 'Raw daily log data for a date range',
      icon: '✎',
      bgColor: 'var(--pbg)'
    }
  ];

  const formatOptions = [
    {
      id: 'pdf',
      name: 'PDF',
      description: 'Formatted report',
      icon: '📄',
      bgColor: 'var(--rbg)'
    },
    {
      id: 'csv',
      name: 'CSV',
      description: 'Raw data export',
      icon: '📊',
      bgColor: 'var(--gbg)'
    }
  ];

  const getPreviewText = () => {
    const typeLabels = {
      cohort: 'Cohort overview — all 84 students — 2025 cohort',
      student: 'Student detail — selected student — full log history',
      supervisor: 'Supervisor activity — all supervisors — response rates',
      logs: 'Log export — all daily logs — date range'
    };
    return `${typeLabels[selectedType]} — ${selectedFormat.toUpperCase()}`;
  };

  const handleGenerate = () => {
    onGenerate({
      type: selectedType,
      format: selectedFormat,
      startDate,
      endDate
    });
  };

  const renderScopeField = () => {
    switch (selectedType) {
      case 'cohort':
        return (
          <div className={styles.field}>
            <div className={styles.fieldLabel}>Cohort / year</div>
            <select className={styles.select}>
              <option>2025 Cohort (current)</option>
              <option>2024 Cohort</option>
              <option>2023 Cohort</option>
              <option>All cohorts</option>
            </select>
          </div>
        );
      case 'student':
        return (
          <div className={styles.field}>
            <div className={styles.fieldLabel}>Student</div>
            <select className={styles.select}>
              <option>Select student...</option>
              <option>Purity Chelagat Sang — HDB212-0324/2022</option>
              <option>Grace Wanjiru — HDB212-0204/2022</option>
              <option>Brian Otieno — HDB212-0112/2022</option>
              <option>Amina Hassan — HDB212-0317/2022</option>
            </select>
          </div>
        );
      case 'supervisor':
        return (
          <div className={styles.field}>
            <div className={styles.fieldLabel}>Supervisor</div>
            <select className={styles.select}>
              <option>All supervisors</option>
              <option>Dr. Francis Kamau</option>
              <option>Dr. Omondi</option>
              <option>Dr. Waweru</option>
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.builder}>
      <div className={styles.builderHeader}>
        <div className={styles.builderTitle}>Build a report</div>
        <div className={styles.builderSubtitle}>Select type, scope and format</div>
      </div>
      <div className={styles.builderBody}>
        
        {/* Report type */}
        <div className={styles.field}>
          <div className={styles.fieldLabel}>Report type</div>
          <div className={styles.typeGrid}>
            {reportTypes.map((type) => (
              <div
                key={type.id}
                className={`${styles.reportType} ${selectedType === type.id ? styles.selected : ''}`}
                onClick={() => setSelectedType(type.id)}
              >
                <div 
                  className={styles.typeIcon}
                  style={{ background: type.bgColor }}
                >
                  {type.icon}
                </div>
                <div className={styles.typeName}>{type.name}</div>
                <div className={styles.typeDescription}>{type.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scope field */}
        {renderScopeField()}

        {/* Date range */}
        <div className={styles.field}>
          <div className={styles.fieldLabel}>Date range</div>
          <div className={styles.dateRow}>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.dateInput}
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>
          <div className={styles.fieldHelp}>
            Leave as full attachment period or narrow to a specific window
          </div>
        </div>

        {/* Format */}
        <div className={styles.field}>
          <div className={styles.fieldLabel}>Export format</div>
          <div className={styles.formatToggle}>
            {formatOptions.map((format) => (
              <div
                key={format.id}
                className={`${styles.formatOption} ${selectedFormat === format.id ? styles.selected : ''}`}
                onClick={() => setSelectedFormat(format.id)}
              >
                <div 
                  className={styles.formatIcon}
                  style={{ background: format.bgColor }}
                >
                  {format.icon}
                </div>
                <div>
                  <div className={styles.formatLabel}>{format.name}</div>
                  <div className={styles.formatSub}>{format.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className={styles.previewNote}>
          <span style={{ fontSize: '13px', flexShrink: 0 }}>ℹ</span>
          <p>{getPreviewText()}</p>
        </div>

        {/* Generate button */}
        <button 
          className={styles.generateButton}
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          <span style={{ marginRight: '8px' }}>↓</span>
          Generate report
        </button>
      </div>
    </div>
  );
};

export default ReportBuilder;
