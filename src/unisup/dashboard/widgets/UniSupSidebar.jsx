import React from 'react';
import styles from './UniSupSidebar.module.css';

const UniSupSidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>
        <div className={styles.logoMark}>IA</div>
        <span className={styles.logoLabel}>IAMS</span>
      </div>
      
      <span className={styles.navSectionLabel}>Main</span>
      <a href="#" className={`${styles.navItem} ${styles.active}`}>
        <div className={styles.navLeft}>
          <span className={styles.navIcon}>▦</span> Dashboard
        </div>
      </a>
      <a href="#" className={styles.navItem}>
        <div className={styles.navLeft}>
          <span className={styles.navIcon}>⊞</span> My Students
        </div>
      </a>
      <a href="#" className={styles.navItem}>
        <div className={styles.navLeft}>
          <span className={styles.navIcon}>⊞</span> Weekly Reviews
        </div>
      </a>
      
      <span className={styles.navSectionLabel} style={{marginTop: '1rem'}}>Account</span>
      <a href="#" className={styles.navItem}>
        <div className={styles.navLeft}>
          <span className={styles.navIcon}>◉</span> Profile
        </div>
      </a>
      
      <div className={styles.sidebarBottom}>
        <div className={styles.userChip}>
          <div className={styles.avatar}>FK</div>
          <div className={styles.userInfo}>
            <div className={styles.name}>Dr. F. Kamau</div>
            <div className={styles.role}>University Supervisor</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default UniSupSidebar;
