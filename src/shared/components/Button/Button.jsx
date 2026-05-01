import React from 'react';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  className = '',
  ...props 
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    loading && styles.loading,
    className
  ].filter(Boolean).join(' ');

  const renderIcon = () => {
    if (!Icon) return null;
    
    return (
      <span className={styles.icon}>
        <Icon />
      </span>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <span className={styles.spinner}></span>
          {children}
        </>
      );
    }

    const icon = renderIcon();
    
    if (iconPosition === 'right') {
      return (
        <>
          {children}
          {icon}
        </>
      );
    }

    return (
      <>
        {icon}
        {children}
      </>
    );
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
