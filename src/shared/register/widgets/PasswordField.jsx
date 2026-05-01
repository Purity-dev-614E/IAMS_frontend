import styles from './PasswordField.module.css';

export default function PasswordField({ 
  id, 
  label, 
  placeholder, 
  value, 
  onChange, 
  showPassword, 
  onTogglePassword, 
  error,
  subtext 
}) {
  return (
    <div className={styles.field}>
      <div className={styles.fl}>
        {label}
        {subtext && <span className={styles.fh}>{subtext}</span>}
      </div>
      <div className={styles.pwWrap}>
        <input 
          type={showPassword ? "text" : "password"} 
          id={id} 
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={error ? styles.err : ''}
        />
        <button 
          className={styles.pwEye} 
          onClick={onTogglePassword}
        >
          {showPassword ? '🙈' : '👁'}
        </button>
      </div>
    </div>
  );
}
