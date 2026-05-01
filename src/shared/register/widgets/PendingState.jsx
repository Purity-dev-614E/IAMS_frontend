import styles from './PendingState.module.css';

export default function PendingState({ name, email, onBack }) {
  return (
    <div className={styles.pendingPage}>
      <div className={styles.pendingIcon}>◔</div>
      <h2>Account created — pending approval</h2>
      <p>Your account has been submitted for review. An admin will approve it within 1–2 working days. You will receive an email at the address below once access is granted.</p>
      <div className={styles.pendingCard}>
        <div className={styles.pcRow}>
          <span className={styles.pcKey}>Name</span>
          <span className={styles.pcVal}>{name}</span>
        </div>
        <div className={styles.pcRow}>
          <span className={styles.pcKey}>Email</span>
          <span className={styles.pcVal}>{email}</span>
        </div>
        <div className={styles.pcRow}>
          <span className={styles.pcKey}>Role</span>
          <span className={styles.pcVal}>University Supervisor</span>
        </div>
        <div className={styles.pcRow}>
          <span className={styles.pcKey}>Status</span>
          <span className={styles.pcVal}>Awaiting admin approval</span>
        </div>
      </div>
      <p style={{fontSize: '12px', color: 'var(--subtle)'}}>
        Questions? Contact <span style={{color: 'var(--blue)'}}>iams@jkuat.ac.ke</span>
      </p>
      <br />
      <a className={styles.backLink} onClick={onBack}>← Back to login</a>
    </div>
  );
}
