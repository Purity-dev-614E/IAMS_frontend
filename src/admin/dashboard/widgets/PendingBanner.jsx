import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PendingBanner.module.css';

const PendingBanner = ({ pendingCount = 0 }) => {
  if (pendingCount <= 0) return null;

  const isSingle = pendingCount === 1;

  return (
    <div className={styles.pendingBanner}>
      <div className={styles.pendingBannerIcon}>!</div>
      <p>
        <strong>{pendingCount} university supervisor{isSingle ? '' : 's'}</strong>
        {isSingle ? ' is' : ' are'} pending approval and cannot access the system.
        Review and approve {isSingle ? 'the account' : 'their accounts'} to unblock {isSingle ? 'them' : 'them'}.
      </p>
      <Link to="/admin/supervisors/pending" className={styles.bannerAction}>
        Review now
      </Link>
    </div>
  );
};

export default PendingBanner;
