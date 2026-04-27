import React from 'react';
import styles from './HowItWorks.module.css';

const HowItWorks = () => {
  const steps = [
    {
      num: '1',
      title: 'Register attachment',
      desc: 'Student submits organization details and industry supervisor email. Admin activates it.'
    },
    {
      num: '2',
      title: 'Log daily activity',
      desc: 'Each working day, student records tasks, skills acquired, and observations.'
    },
    {
      num: '3',
      title: 'Weekly review triggered',
      desc: 'At week\'s end, the system bundles all daily logs and notifies both supervisors.'
    },
    {
      num: '4',
      title: 'Supervisors respond',
      desc: 'Industry supervisor clicks their email link. University supervisor reviews via dashboard.'
    }
  ];

  return (
    <section className={styles.howSection} id="how">
      <div className={styles.howInner}>
        <div className={styles.center}>
          <div className={styles.sectionLabel}>The process</div>
          <h2 className={`${styles.sectionTitle} ${styles.serif} ${styles.center}`}>
            How a student's attachment cycle works
          </h2>
        </div>
        <div className={styles.howSteps}>
          {steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <div className={`${styles.stepNum} ${styles.serif}`}>{step.num}</div>
              <div className={styles.stepTitle}>{step.title}</div>
              <div className={styles.stepDesc}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
