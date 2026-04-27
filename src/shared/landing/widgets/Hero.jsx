import React from 'react';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroEyebrow}>
        <span className={styles.heroEyebrowDot}></span>
        Jomo Kenyatta University of Agriculture and Technology
      </div>
      <h1 className={styles.serif}>
        Industrial attachment, <em>managed properly</em>
      </h1>
      <p className={styles.heroSub}>
        A centralized platform for students, supervisors, and administrators to manage the entire attachment process — from registration to final assessment.
      </p>
      <div className={styles.heroCtas}>
        <a href="/login" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}>
          Get started
        </a>
        <a href="#how" className={`${styles.btn} ${styles.btnLg} ${styles.btnOutline}`}>
          See how it works
        </a>
      </div>
      <div className={styles.heroStats}>
        <div className={styles.statItem}>
          <div className={`${styles.statNum} ${styles.serif}`}>4</div>
          <div className={styles.statLabel}>User roles</div>
        </div>
        <div className={styles.statItem}>
          <div className={`${styles.statNum} ${styles.serif}`}>Daily</div>
          <div className={styles.statLabel}>Log submissions</div>
        </div>
        <div className={styles.statItem}>
          <div className={`${styles.statNum} ${styles.serif}`}>Weekly</div>
          <div className={styles.statLabel}>Supervisor reviews</div>
        </div>
        <div className={styles.statItem}>
          <div className={`${styles.statNum} ${styles.serif}`}>100%</div>
          <div className={styles.statLabel}>Paperless</div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
