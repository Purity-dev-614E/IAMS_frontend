import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>© 2025 IAMS · Jomo Kenyatta University of Agriculture and Technology</p>
      <div className={styles.footerRight}>
        <span className={styles.footerBadge}>PWA — works offline</span>
        <p className={styles.footerCompliance}>Kenya Data Protection Act 2019 compliant</p>
      </div>
    </footer>
  );
};

export default Footer;
