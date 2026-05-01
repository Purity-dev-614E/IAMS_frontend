import styles from './FormField.module.css';

export default function FormField({ 
  id, 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error,
  subtext 
}) {
  return (
    <div className={styles.field}>
      <div className={styles.fl}>
        {label}
        {subtext && <span className={styles.fh}>{subtext}</span>}
      </div>
      <input 
        type={type} 
        id={id} 
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={error ? styles.err : ''}
      />
    </div>
  );
}
