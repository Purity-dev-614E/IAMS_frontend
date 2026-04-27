import React from 'react';
import styles from './UserTable.module.css';

const UserTable = ({ users, onEdit, onDeactivate, onReactivate, onDelete, onApprove, onReject }) => {
  const getRoleBadge = (role) => {
    const roleClasses = {
      student: styles.spBlue,
      uni_sup: styles.spGreen,
      admin: styles.spRed
    };
    const roleLabels = {
      student: 'Student',
      uni_sup: 'Uni Supervisor',
      admin: 'Admin'
    };
    return (
      <span className={`${styles.sp} ${roleClasses[role]}`}>
        {roleLabels[role]}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: styles.spGreen,
      pending: styles.spAmber,
      deactivated: styles.spGray
    };
    const statusLabels = {
      active: 'Active',
      pending: 'Pending',
      deactivated: 'Deactivated'
    };
    return (
      <span className={`${styles.sp} ${statusClasses[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  const renderActions = (user) => {
    if (user.status === 'active') {
      return (
        <div className={styles.actions}>
          <button className={`${styles.abtn} ${styles.abtnEdit}`} onClick={() => onEdit(user)}>
            Edit
          </button>
          <button className={`${styles.abtn} ${styles.abtnDeact}`} onClick={() => onDeactivate(user)}>
            Deactivate
          </button>
        </div>
      );
    } else if (user.status === 'deactivated') {
      return (
        <div className={styles.actions}>
          <button className={`${styles.abtn} ${styles.abtnAct}`} onClick={() => onReactivate(user)}>
            Reactivate
          </button>
          <button className={`${styles.abtn} ${styles.abtnDel}`} onClick={() => onDelete(user)}>
            Delete
          </button>
        </div>
      );
    } else if (user.status === 'pending' && user.role === 'uni_sup') {
      return (
        <div className={styles.actions}>
          <button className={`${styles.abtn} ${styles.abtnAct}`} onClick={() => onApprove(user)}>
            Approve
          </button>
          <button className={`${styles.abtn} ${styles.abtnDel}`} onClick={() => onReject(user)}>
            Reject
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.card}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name / Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Registered</th>
            <th>Last active</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index} data-role={user.role}>
              <td className={styles.unameCell}>
                <div className={styles.name}>{user.name}</div>
                <div className={styles.email}>{user.email}</div>
              </td>
              <td>{getRoleBadge(user.role)}</td>
              <td>{getStatusBadge(user.status)}</td>
              <td style={{color: 'var(--muted)'}}>{user.registered}</td>
              <td style={{color: 'var(--muted)'}}>{user.lastActive}</td>
              <td>{renderActions(user)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
