import React from 'react';
import styles from './Features.module.css';

const Features = () => {
  const features = [
    {
      dotColor: 'var(--blue)',
      title: 'No more lost logbooks',
      desc: 'Every daily log is stored securely in a central database. Students build a permanent digital record of their entire attachment period.'
    },
    {
      dotColor: 'var(--green)',
      title: 'Real-time progress visibility',
      desc: 'University supervisors see exactly where each assigned student stands — who is on track, who has gaps, and who needs immediate attention.'
    },
    {
      dotColor: 'var(--amber)',
      title: 'Zero friction for industry supervisors',
      desc: 'No accounts to create, no passwords to remember. A single email link each week is all they need to review and approve their intern\'s activities.'
    },
    {
      dotColor: 'var(--purple)',
      title: 'Offline-ready on any device',
      desc: 'Students can draft and save logs without an internet connection. The system syncs automatically when connectivity is restored.'
    },
    {
      dotColor: 'var(--navy)',
      title: 'Structured feedback, not scattered comments',
      desc: 'Supervisors provide weekly comments and improvement recommendations tied to the specific week\'s activity — not vague end-of-attachment notes.'
    },
    {
      dotColor: 'var(--red)',
      title: 'Cohort reporting for administrators',
      desc: 'Generate PDF and CSV reports on submission rates, review completion, and student progress — per student or across an entire cohort.'
    }
  ];

  return (
    <section className={styles.featuresSection}>
      <div className={`${styles.center} ${styles.max600}`}>
        <div className={styles.sectionLabel}>Features</div>
        <h2 className={`${styles.sectionTitle} ${styles.serif}`}>
          Everything the manual process was missing
        </h2>
      </div>
      <div className={styles.featuresGrid}>
        {features.map((feature, index) => (
          <div key={index} className={styles.featureCard}>
            <div 
              className={styles.featureDot}
              style={{ background: feature.dotColor }}
            ></div>
            <div className={styles.featureTitle}>{feature.title}</div>
            <div className={styles.featureDesc}>{feature.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
