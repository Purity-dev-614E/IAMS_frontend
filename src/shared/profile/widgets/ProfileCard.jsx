import React from 'react';
import styles from './ProfileCard.module.css';

const ProfileCard = ({ user }) => {
  const getRoleDisplay = (role) => {
    switch (role) {
      case 'admin': return 'System Administrator';
      case 'uni_supervisor': return 'University Supervisor';
      case 'student': return 'Student';
      default: return role === 'user' ? 'Student' : role || 'Student';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return '👨‍💼';
      case 'uni_supervisor': return '👨‍🏫';
      case 'student': return '👨‍🎓';
      default: return '👤';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.profileCard}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>
            {getInitials(user?.userName || user?.name)}
          </div>
          <div className={styles.roleIcon}>
            {getRoleIcon(user?.role)}
          </div>
        </div>
        <div className={styles.profileInfo}>
          <h2 className={styles.profileName}>{user?.userName || user?.name || 'Not specified'}</h2>
          <div className={styles.profileRole}>{getRoleDisplay(user?.role)}</div>
        </div>
      </div>

      <div className={styles.profileDetails}>
        <div className={styles.detailSection}>
          <div className={styles.sectionTitle}>Account Information</div>
          
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>
              <span className={styles.detailIcon}>📧</span>
              Email Address
            </div>
            <div className={styles.detailValue}>{user?.userEmail || user?.email || 'Not specified'}</div>
          </div>

          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>
              <span className={styles.detailIcon}>🎭</span>
              Role
            </div>
            <div className={styles.detailValue}>
              <span className={styles.roleBadge}>{getRoleDisplay(user?.role)}</span>
            </div>
          </div>
        </div>

        {user?.role === 'student' && (
          <div className={styles.detailSection}>
            <div className={styles.sectionTitle}>Student Information</div>
            
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>
                <span className={styles.detailIcon}>📝</span>
                Registration Number
              </div>
              <div className={styles.detailValue}>{user?.regNumber || 'Not assigned'}</div>
            </div>

            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>
                <span className={styles.detailIcon}>📚</span>
                Program
              </div>
              <div className={styles.detailValue}>{user?.program || 'Not specified'}</div>
            </div>

            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>
                <span className={styles.detailIcon}>📅</span>
                Year of Study
              </div>
              <div className={styles.detailValue}>Year {user?.yearOfStudy || 'Not specified'}</div>
            </div>
          </div>
        )}

        <div className={styles.detailSection}>
          <div className={styles.sectionTitle}>Account Status</div>
          
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>
              <span className={styles.detailIcon}>✅</span>
              Account Status
            </div>
            <div className={styles.detailValue}>
              <span className={styles.statusBadge}>Active</span>
            </div>
          </div>

          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>
              <span className={styles.detailIcon}>📆</span>
              Member Since
            </div>
            <div className={styles.detailValue}>
              {formatDate(user?.createdAt || user?.created_at)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
