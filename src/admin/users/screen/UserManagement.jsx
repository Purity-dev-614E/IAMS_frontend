import React, { useState } from 'react';
import styles from './UserManagement.module.css';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';
import UserTable from '../widgets/UserTable';
import UserModal from '../widgets/UserModal';
import ConfirmModal from '../widgets/ConfirmModal';
import Toast from '../../../shared/widgets/Toast';
import { useAuth } from '../../../contexts/AuthContext';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);
  const { user } = useAuth();

  const adminNavigationItems = [
    {
      title: 'System',
      items: [
        { to: '/admin', label: 'Dashboard', icon: '▦' },
        { to: '/admin/users', label: 'Users', icon: '◉' },
        { to: '/admin/students', label: 'Students', icon: '⊞' },
        { to: '/admin/attachments', label: 'Attachments', icon: '◎' },
      ]
    },
    {
      title: 'Actions',
      items: [
        { to: '/admin/supervisors/pending', label: 'Supervisor Approval', icon: '✓' },
        { to: '/admin/reports', label: 'Reports', icon: '↓' },
      ]
    }
  ];
  const [toast, setToast] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });

  // Mock user data
  const [users] = useState([
    {
      name: 'Purity Chelagat Sang',
      email: 'purity.sang@students.jkuat.ac.ke',
      role: 'student',
      status: 'active',
      registered: '17 Feb 2025',
      lastActive: 'Today'
    },
    {
      name: 'Grace Wanjiru',
      email: 'grace.wanjiru@students.jkuat.ac.ke',
      role: 'student',
      status: 'active',
      registered: '17 Feb 2025',
      lastActive: '2 hrs ago'
    },
    {
      name: 'Dr. Francis Kamau',
      email: 'f.kamau@jkuat.ac.ke',
      role: 'uni_sup',
      status: 'active',
      registered: '10 Jan 2025',
      lastActive: 'Yesterday'
    },
    {
      name: 'Dr. Alice Njoroge',
      email: 'a.njoroge@jkuat.ac.ke',
      role: 'uni_sup',
      status: 'pending',
      registered: '1 Apr 2025',
      lastActive: 'â'
    },
    {
      name: 'Mr. Samuel Kibet',
      email: 's.kibet@jkuat.ac.ke',
      role: 'uni_sup',
      status: 'pending',
      registered: '30 Mar 2025',
      lastActive: 'â'
    },
    {
      name: 'Kevin Mutua',
      email: 'kevin.mutua@students.jkuat.ac.ke',
      role: 'student',
      status: 'active',
      registered: '17 Feb 2025',
      lastActive: '3 days ago'
    },
    {
      name: 'Amina Hassan',
      email: 'amina.hassan@students.jkuat.ac.ke',
      role: 'student',
      status: 'deactivated',
      registered: '17 Feb 2025',
      lastActive: '2 weeks ago'
    },
    {
      name: 'System Administrator',
      email: 'admin@jkuat.ac.ke',
      role: 'admin',
      status: 'active',
      registered: '1 Jan 2025',
      lastActive: 'Today'
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const showToast = (message, type = 'success') => {
    setToast({
      message,
      type,
      isVisible: true
    });
  };

  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsUserModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setModalMode('create');
    setIsUserModalOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    showToast('Account deleted');
    setIsConfirmModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeactivate = (user) => {
    showToast('Account deactivated');
  };

  const handleReactivate = (user) => {
    showToast('Account reactivated');
  };

  const handleApprove = (user) => {
    showToast('Account approved');
  };

  const handleReject = (user) => {
    showToast('Account rejected');
  };

  return (
    <div className={styles.shell}>
      <AppSidebar 
        navigationItems={adminNavigationItems} 
        user={user ? {
          initials: 'AD',
          name: user.name || 'Admin',
          role: 'System Administrator'
        } : null}
      />

      <div className={styles.main}>
        <div className={styles.topbar}>
          <div>
            <div className={styles.topbarTitle}>User Management</div>
            <div className={styles.topbarSubtitle}>84 users across all roles</div>
          </div>
          <div className={styles.topbarRight}>
            <button className={styles.btnGhost}>â Export</button>
            <button className={styles.btnPrimary} onClick={handleCreate}>
              + Create user
            </button>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.toolbar}>
            <div style={{display: 'flex', gap: '8px', alignItems: 'center', flex: 1, flexWrap: 'wrap'}}>
              <div className={styles.searchWrap}>
                <span className={styles.searchIcon}>â</span>
                <input 
                  type="text" 
                  placeholder="Search name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className={styles.filters}>
                <select 
                  className={styles.filterSelect}
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All roles</option>
                  <option value="student">Students</option>
                  <option value="uni_sup">Uni supervisors</option>
                  <option value="admin">Admins</option>
                </select>
                <select 
                  className={styles.filterSelect}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="deactivated">Deactivated</option>
                </select>
              </div>
            </div>
            <div style={{fontSize: '12px', color: 'var(--muted)'}}>
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>

          <UserTable 
            users={filteredUsers}
            onEdit={handleEdit}
            onDeactivate={handleDeactivate}
            onReactivate={handleReactivate}
            onDelete={handleDelete}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </div>

      <UserModal 
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        mode={modalMode}
        user={selectedUser}
      />

      <ConfirmModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        type="delete"
        userName={selectedUser?.name}
      />

      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default UserManagement;
