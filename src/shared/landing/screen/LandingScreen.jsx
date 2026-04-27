import React from 'react';
import styles from './LandingScreen.module.css';
import Navigation from '../widgets/Navigation';
import Hero from '../widgets/Hero';
import Roles from '../widgets/Roles';
import HowItWorks from '../widgets/HowItWorks';
import Features from '../widgets/Features';
import CTA from '../widgets/CTA';
import Footer from '../widgets/Footer';

const LandingScreen = () => {
  return (
    <div className={styles.landing}>
      <Navigation />
      <Hero />
      <Roles />
      <HowItWorks />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingScreen;
