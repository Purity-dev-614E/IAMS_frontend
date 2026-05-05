import React, { useState, useEffect } from 'react';
import styles from './UserManagement.module.css';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';
import UserTable from '../widgets/UserTable';
import UserModal from '../widgets/UserModal';
import ConfirmModal from '../widgets/ConfirmModal';
import Toast from '../../../shared/widgets/Toast';
import { useAuth } from '../../../contexts/AuthContext';
import { userApi } from '../services/userApi';
import { FiDownload, FiSearch } from 'react-icons/fi';

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

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = {
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || undefined
      };
      const response = await userApi.getUsers(filters);
      // Map backend response to frontend format
      const mappedUsers = response.users.map(user => ({
        ...user,
        registered: new Date(user.updated_at).toLocaleDateString('en-GB', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        }),
        status: user.status || 'active', // Default to active if not provided
        active: user.active !== false // Default to true if not provided
      }));
      setUsers(mappedUsers || []);
    } catch (err) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Please login with admin credentials to access user management');
      } else {
        setError(err.message);
        showToast('Failed to fetch users', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter, searchTerm]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleConfirmDelete = async () => {
    try {
      await userApi.deleteUser(selectedUser.id);
      showToast('Account deleted');
      fetchUsers(); // Refresh user list
    } catch (err) {
      showToast('Failed to delete user', 'error');
    } finally {
      setIsConfirmModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleDeactivate = async (user) => {
    try {
      await userApi.deactivateUser(user.id);
      showToast('Account deactivated');
      fetchUsers(); // Refresh user list
    } catch (err) {
      showToast('Failed to deactivate user', 'error');
    }
  };

  const handleReactivate = async (user) => {
    try {
      await userApi.reactivateUser(user.id);
      showToast('Account reactivated');
      fetchUsers(); // Refresh user list
    } catch (err) {
      showToast('Failed to reactivate user', 'error');
    }
  };

  const handleApprove = async (user) => {
    try {
      await userApi.approveSupervisor(user.id);
      showToast('Account approved');
      fetchUsers(); // Refresh user list
    } catch (err) {
      showToast('Failed to approve user', 'error');
    }
  };

  const handleReject = async (user) => {
    try {
      await userApi.rejectSupervisor(user.id);
      showToast('Account rejected');
      fetchUsers(); // Refresh user list
    } catch (err) {
      showToast('Failed to reject user', 'error');
    }
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
            <button className={styles.btnGhost}>
              <FiDownload style={{marginRight: '6px'}} />
              Export
            </button>
            <button className={styles.btnPrimary} onClick={handleCreate}>
              + Create user
            </button>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.toolbar}>
            <div style={{display: 'flex', gap: '8px', alignItems: 'center', flex: 1, flexWrap: 'wrap'}}>
              <div className={styles.searchWrap}>
                <FiSearch className={styles.searchIcon} />
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
                  <option value="uni_supervisor">Uni supervisors</option>
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
                  <option value="rejected">Rejected</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div style={{fontSize: '12px', color: 'var(--muted)'}}>
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
              Loading users...
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--error)' }}>
              Error: {error}
            </div>
          ) : (
            <UserTable 
              users={filteredUsers}
              onEdit={handleEdit}
              onDeactivate={handleDeactivate}
              onReactivate={handleReactivate}
              onDelete={handleDelete}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}
        </div>
      </div>

      <UserModal 
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        mode={modalMode}
        user={selectedUser}
        onUserUpdated={fetchUsers}
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
