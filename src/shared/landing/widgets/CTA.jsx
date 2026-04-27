import React from 'react';
import styles from './CTA.module.css';

const CTA = () => {
  return (
    <section className={styles.ctaSection}>
      <h2 className={styles.serif}>
        Ready to replace the paper logbook?
      </h2>
      <p>
        Join JKUAT's digital attachment management platform.
      </p>
      <a href="/login" className={`${styles.btn} ${styles.btnWhite} ${styles.btnLg}`}>
        Get started — it's free
      </a>
    </section>
  );
};

export default CTA;
