import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LogCTA.module.css';

const LogCTA = () => {
  return (
    <div className={styles.logCTA}>
      <div className={styles.logCTAText}>
        <h3>Log today's activities</h3>
        <p>Thursday 2 April — you haven't submitted yet. Takes about 3 minutes.</p>
      </div>
      <Link to="/logs/new" className={styles.btnLog}>+ Add today's log</Link>
    </div>
  );
};

export default LogCTA;
