import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ReviewsSidebar.module.css';

const ReviewsSidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>
        <img src={"/assets/IAMSlogo.png"} alt="IAMS" className={styles.logoImage} />
        <span className={styles.logoLabel}>IAMS</span>
      </div>
      <span className={styles.navSectionLabel}>Main</span>
      <Link to="/dashboard" className={styles.navItem}>
        <span className={styles.navIcon}>▦</span> Dashboard
      </Link>
      <Link to="/attachments" className={styles.navItem}>
        <span className={styles.navIcon}>◎</span> My Attachment
      </Link>
      <Link to="/logs/new" className={styles.navItem}>
        <span className={styles.navIcon}>✎</span> Daily Logs
      </Link>
      <Link to="/reviews" className={`${styles.navItem} ${styles.active}`}>
        <span className={styles.navIcon}>⊞</span> Weekly Reviews
      </Link>
      <span className={styles.navSectionLabel} style={{marginTop: '1rem'}}>Account</span>
      <Link to="/profile" className={styles.navItem}>
        <span className={styles.navIcon}>◉</span> Profile
      </Link>
      <div className={styles.sidebarBottom}>
        <div className={styles.userChip}>
          <div className={styles.avatar}>PS</div>
          <div>
            <div className={styles.uname}>Purity Sang</div>
            <div className={styles.urole}>Student · BBIT</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ReviewsSidebar;
