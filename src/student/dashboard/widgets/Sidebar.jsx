import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>
        <img src={"/assets/IAMSlogo.png"} alt="IAMS" className={styles.logoImage} />
        <span className={styles.logoLabel}>IAMS</span>
      </div>

      <span className={styles.navSectionLabel}>Main</span>
      <Link to="/dashboard" className={`${styles.navItem} ${location.pathname === '/dashboard' ? styles.active : ''}`}>
        <span className={styles.navIcon}>▦</span> Dashboard
      </Link>
      <Link to="/attachments" className={`${styles.navItem} ${location.pathname === '/attachments' ? styles.active : ''}`}>
        <span className={styles.navIcon}>◎</span> My Attachment
      </Link>
      <Link to="/logs/new" className={`${styles.navItem} ${location.pathname === '/logs' ? styles.active : ''}`}>
        <span className={styles.navIcon}>✎</span> Daily Logs
      </Link>
      <Link to="/reviews" className={`${styles.navItem} ${location.pathname === '/reviews' ? styles.active : ''}`}>
        <span className={styles.navIcon}>⊞</span> Weekly Reviews
      </Link>

      <span className={styles.navSectionLabel} style={{marginTop: '1.5rem'}}>Account</span>
      <Link to="/profile" className={`${styles.navItem} ${location.pathname === '/profile' ? styles.active : ''}`}>
        <span className={styles.navIcon}>◉</span> Profile
      </Link>

      <div className={styles.sidebarBottom}>
        <div className={styles.userChip}>
          <div className={styles.avatar}>PS</div>
          <div className={styles.userInfo}>
            <div className={styles.name}>Purity Sang</div>
            <div className={styles.role}>Student · BBIT</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
