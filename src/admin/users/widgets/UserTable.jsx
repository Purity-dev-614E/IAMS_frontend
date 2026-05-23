  import React from 'react';
  import styles from './UserTable.module.css';
  import Button from '../../../shared/components/Button';

const UserTable = ({ users, onEdit, onDeactivate, onReactivate, onDelete, onApprove, onReject }) => {
  const getRoleBadge = (role) => {
    const roleClasses = {
      student: styles.spBlue,
      uni_supervisor: styles.spGreen,
      admin: styles.spRed
    };
    const roleLabels = {
      student: 'Student',
      uni_supervisor: 'Uni Supervisor',
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
      rejected: styles.spRed,
      inactive: styles.spGray
    };
    const statusLabels = {
      active: 'Active',
      pending: 'Pending',
      rejected: 'Rejected',
      inactive: 'Inactive'
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
          <Button variant="secondary" size="small" onClick={() => onEdit(user)}>
            Edit
          </Button>
          <Button variant="warning" size="small" onClick={() => onDeactivate(user)}>
            Deactivate
          </Button>
        </div>
      );
    } else if (user.status === 'inactive') {
      return (
        <div className={styles.actions}>
          <Button variant="success" size="small" onClick={() => onReactivate(user)}>
            Reactivate
          </Button>
          <Button variant="danger" size="small" onClick={() => onDelete(user)}>
            Delete
          </Button>
        </div>
      );
    } else if (user.status === 'pending' && user.role === 'uni_supervisor') {
      return (
        <div className={styles.actions}>
          <Button variant="success" size="small" onClick={() => onApprove(user)}>
            Approve
          </Button>
          <Button variant="danger" size="small" onClick={() => onReject(user)}>
            Reject
          </Button>
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
              <td>{renderActions(user)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
