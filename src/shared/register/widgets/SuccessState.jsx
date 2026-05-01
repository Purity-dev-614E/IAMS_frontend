import styles from './SuccessState.module.css';

export default function SuccessState({ onBack }) {
  return (
    <div className={styles.successPage}>
      <div className={styles.successIcon}>✓</div>
      <h2>Account created</h2>
      <p>Welcome to IAMS. Your account is ready — sign in to get started.</p>
      <button className={styles.loginBtn} onClick={"/login"}>Go to login →</button>
    </div>
  );
}
