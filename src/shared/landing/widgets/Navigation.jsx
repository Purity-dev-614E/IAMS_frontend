import React from 'react';
import styles from './Navigation.module.css';
import IAMSlogo from '../../../assets/IAMSlogo.png';

const Navigation = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.navLogo}>
        <img src={IAMSlogo} alt="IAMS Logo" className={styles.navLogoImage} />
        <span className={styles.navBrand}>IAMS · JKUAT</span>
      </div>
      <div className={styles.navLinks}>
        <a href="#how">How it works</a>
        <a href="#supervisors">For supervisors</a>
        <a href="#students">For students</a>
        <a href="/login" className={styles.btnPrimary}>Get started</a>
      </div>
    </nav>
  );
};

export default Navigation;
