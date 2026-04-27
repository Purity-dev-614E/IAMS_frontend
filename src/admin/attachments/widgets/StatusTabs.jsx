import React from 'react';
import styles from './StatusTabs.module.css';

const StatusTabs = ({ activeTab, onTabChange, pendingCount, activeCount, completedCount }) => {
  const tabs = [
    { id: 'pending', label: 'Pending', badge: pendingCount, badgeClass: styles.tbAmber },
    { id: 'active', label: 'Active', badge: activeCount, badgeClass: styles.tbBlue },
    { id: 'completed', label: 'Completed', badge: completedCount, badgeClass: styles.tbGreen },
    { id: 'all', label: 'All', badge: null }
  ];

  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.on : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
          {tab.badge !== null && (
            <span className={`${styles.tbadge} ${tab.badgeClass}`}>{tab.badge}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default StatusTabs;
