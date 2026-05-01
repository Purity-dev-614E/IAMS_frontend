import styles from './RoleSelector.module.css';

export default function RoleSelector({ currentRole, onRoleChange }) {
  return (
    <>
      <div className={styles.roleGroup}>
        <span className={styles.roleLabel}>I am a</span>
        <div className={styles.roleOptions}>
          <div 
            className={`${styles.roleOpt} ${currentRole === 'student' ? styles.selStudent : ''}`} 
            onClick={() => onRoleChange('student')}
          >
            <div className={styles.roRadio}>
              <div className={styles.roDot}></div>
            </div>
            <div>
              <div className={styles.roLabel}>Student</div>
              <div className={styles.roSub}>Access immediately</div>
            </div>
          </div>
          <div 
            className={`${styles.roleOpt} ${currentRole === 'supervisor' ? styles.selSupervisor : ''}`} 
            onClick={() => onRoleChange('supervisor')}
          >
            <div className={styles.roRadio}>
              <div className={styles.roDot}></div>
            </div>
            <div>
              <div className={styles.roLabel}>University supervisor</div>
              <div className={styles.roSub}>Pending admin approval</div>
            </div>
          </div>
        </div>
      </div>

      {/* SUPERVISOR NOTICE */}
      <div className={`${styles.supNotice} ${currentRole === 'supervisor' ? styles.show : ''}`}>
        <span style={{fontSize: '14px', flexShrink: 0}}>◔</span>
        <p>
          <strong>Your account will require admin approval</strong> before you can log in. You will receive an email once your account has been activated. This usually takes 1–2 working days.
        </p>
      </div>
    </>
  );
}
