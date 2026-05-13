import React from 'react';
import styles from './WeekDots.module.css';

const WeekDots = ({ weekData, showLabels = true, currentWeek = false }) => {
  const getDotColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'var(--blue)';
      case 'complete':
        return 'var(--green)';
      case 'missing':
        return 'var(--rbg)';
      case 'pending':
        return 'var(--amber)';
      case 'upcoming':
        return 'var(--border)';
      default:
        return 'var(--border)';
    }
  };

  const getDotStyle = (status) => {
    const baseColor = getDotColor(status);
    const style = { background: baseColor };
    
    if (status === 'missing') {
      style.border = '0.5px solid var(--rb)';
    }
    
    return style;
  };

  const getDayLabel = (index) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    return days[index];
  };

  const getCompletedCount = () => {
    return weekData.filter(day => day === 'submitted' || day === 'complete').length;
  };

  const getTotalCount = () => {
    return weekData.filter(day => day !== 'upcoming').length;
  };

  const getStatusText = () => {
    const completed = getCompletedCount();
    const total = getTotalCount();
    
    if (completed === total && total > 0) {
      return currentWeek ? `${completed} of ${total} days` : 'All complete';
    } else if (completed === 0) {
      return '0 days';
    } else {
      return `${completed} of ${total} days`;
    }
  };

  const getStatusColor = () => {
    const completed = getCompletedCount();
    const total = getTotalCount();
    
    if (completed === total && total > 0) {
      return currentWeek ? 'var(--muted)' : 'var(--green)';
    } else if (completed === 0) {
      return 'var(--red)';
    } else {
      return 'var(--muted)';
    }
  };

  return (
    <div>
      <div className={styles.weekDots}>
        {weekData.map((status, index) => (
          <div
            key={index}
            className={styles.weekDot}
            style={getDotStyle(status)}
            title={`${getDayLabel(index)} — ${status}`}
          />
        ))}
      </div>
      {showLabels && (
        <div className={styles.weekCount} style={{ color: getStatusColor() }}>
          {getStatusText()}
        </div>
      )}
    </div>
  );
};

export default WeekDots;
