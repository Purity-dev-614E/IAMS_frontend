import React from 'react';
import styles from './FilterTabs.module.css';

const FilterTabs = ({ activeFilter, onFilterChange, counts }) => {
  const tabs = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'needs', label: 'Needs feedback', count: counts.needs },
    { key: 'flagged', label: 'Flagged', count: counts.flagged },
    { key: 'behind', label: 'Behind on logs', count: counts.behind },
  ];

  const getBadgeColor = (key) => {
    switch (key) {
      case 'needs':
        return 'var(--abg)';
      case 'flagged':
        return 'var(--rbg)';
      case 'behind':
        return 'var(--rbg)';
      default:
        return 'rgba(255, 255, 255, 0.15)';
    }
  };

  const getBadgeTextColor = (key) => {
    switch (key) {
      case 'needs':
        return 'var(--amber)';
      case 'flagged':
        return 'var(--red)';
      case 'behind':
        return 'var(--red)';
      default:
        return 'rgba(255, 255, 255, 0.8)';
    }
  };

  return (
    <div className={styles.filterTabs}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`${styles.filterTab} ${activeFilter === tab.key ? styles.active : ''}`}
          onClick={() => onFilterChange(tab.key)}
        >
          {tab.label}
          <span
            className={styles.filterTabBadge}
            style={{
              background: getBadgeColor(tab.key),
              color: getBadgeTextColor(tab.key),
            }}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
