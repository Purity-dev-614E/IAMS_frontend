import React, { useState, useEffect } from 'react';
import styles from './StudentManagement.module.css';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';
import StudentTable from '../widgets/StudentTable';
import BulkActionBar from '../widgets/BulkActionBar';
import AssignSupervisorModal from '../widgets/AssignSupervisorModal';
import Toast from '../../../shared/widgets/Toast';
import { useAuth } from '../../../contexts/AuthContext';
import { FiDownload, FiSearch, FiAlertTriangle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { studentApi } from '../services/studentServices';
import Button from '../../../shared/components/Button/Button';

const StudentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [supervisorFilter, setSupervisorFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('single');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showUnassignedOnly, setShowUnassignedOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = {
        supervisor: supervisorFilter !== 'all' ? supervisorFilter : undefined,
        program: programFilter !== 'all' ? programFilter : undefined,
        search: searchTerm || undefined,
        unassignedOnly: showUnassignedOnly
      };
      const response = await studentApi.getStudents(filters);
      // Map backend response to frontend format
      const mappedStudents = response.students.map(student => {
        return {
          ...student,
          name: student.student_name,
          email: student.student_email,
          regNumber: student.reg_number,
          year: student.year_of_study,
          supervisor: student.supervisor_name,
          program: student.program,
          attachmentStatus: student.attachmentStatus || 'pending',
          logsThisWeek: student.logsThisWeek || 0,
          totalLogs: student.totalLogs || 0
        };
      });
      setStudents(mappedStudents || []);
    } catch (err) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Please login with admin credentials to access student management');
      } else {
        setError(err.message);
        showToast('Failed to fetch students', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchTerm || 
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.regNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSupervisor = supervisorFilter === 'all' || 
                              (supervisorFilter === 'unassigned' && !student.supervisor) ||
                              (student.supervisor && student.supervisor.includes(supervisorFilter));
    const matchesProgram = programFilter === 'all' || student.program === programFilter;
    const matchesUnassigned = !showUnassignedOnly || !student.supervisor;
    
    return matchesSearch && matchesSupervisor && matchesProgram && matchesUnassigned;
  });

  // Extract unique supervisors and programs from students data
  const uniqueSupervisors = [...new Set(students
    .filter(s => s.supervisor)
    .map(s => s.supervisor)
  )].sort();

  const uniquePrograms = [...new Set(students
    .filter(s => s.program)
    .map(s => s.program)
  )].sort();

  const unassignedCount = students.filter(s => !s.supervisor).length;

  const showToast = (message, type = 'success') => {
    setToast({
      message,
      type,
      isVisible: true
    });
  };

  useEffect(() => {
    fetchStudents();
  }, [supervisorFilter, programFilter, searchTerm, showUnassignedOnly]);

  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  const handleAssignSingle = (student) => {
    setSelectedStudent(student);
    setModalMode('single');
    setIsAssignModalOpen(true);
  };

  const handleBulkAssign = () => {
    if (selectedStudents.length === 0) {
      showToast('Select students first', 'error');
      return;
    }
    setModalMode('bulk');
    setIsAssignModalOpen(true);
  };

  const handleAssign = async (supervisorId) => {
    try {
      // Close the modal
      setIsAssignModalOpen(false);
      
      // Refresh student data to reflect changes
      await fetchStudents();
      
      // Show success message
      if (modalMode === 'single') {
        showToast('Supervisor assigned successfully');
      } else {
        showToast('Supervisors assigned successfully');
        setSelectedStudents([]);
      }
    } catch (error) {
      showToast('Failed to assign supervisor', 'error');
    }
  };

  const handleViewStudent = (student) => {
    showToast(`Viewing ${student.name}`);
  };

  const handleFilterUnassigned = () => {
    setShowUnassignedOnly(true);
    showToast('Showing unassigned students');
  };

  const handleClearSelection = () => {
    setSelectedStudents([]);
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
            <div className={styles.topbarTitle}>Student Management</div>
            <div className={styles.topbarSubtitle}>{students.length} students · {unassignedCount} without supervisors</div>
          </div>
          <div className={styles.topbarRight}>
            <Button 
              variant="ghost" 
              icon={FiDownload}
              iconPosition="left"
            >
              Export
            </Button>
            <Button 
              variant="primary" 
              onClick={handleBulkAssign}
            >
              Bulk assign supervisors
            </Button>
          </div>
        </div>

        <div className={styles.content}>
          {/* ALERT */}
          {unassignedCount > 0 && (
            <div className={styles.alert}>
              <FiAlertTriangle style={{fontSize: '14px', marginRight: '8px'}} />
              <p><strong>{unassignedCount} students</strong> have no university supervisor assigned. They have active attachments and need supervision.</p>
              <span className={styles.alertAction} onClick={handleFilterUnassigned}>
                Show unassigned
              </span>
            </div>
          )}

          {/* TOOLBAR */}
          <div className={styles.toolbar}>
            <div style={{display: 'flex', gap: '8px', flex: 1, flexWrap: 'wrap'}}>
              <div className={styles.searchWrap}>
                <FiSearch className={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="Search name or reg number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className={styles.filterSelect}
                value={supervisorFilter}
                onChange={(e) => setSupervisorFilter(e.target.value)}
              >
                <option value="all">All supervisors</option>
                {uniqueSupervisors.map(supervisor => (
                  <option key={supervisor} value={supervisor}>{supervisor}</option>
                ))}
                <option value="unassigned">Unassigned</option>
              </select>
              <select 
                className={styles.filterSelect}
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
              >
                <option value="all">All programs</option>
                {uniquePrograms.map(program => (
                  <option key={program} value={program}>{program}</option>
                ))}
              </select>
            </div>
            <div style={{fontSize: '12px', color: 'var(--muted)'}}>
              Showing {filteredStudents.length} of {students.length}
            </div>
          </div>

          {/* BULK ACTION BAR */}
          <BulkActionBar 
            selectedCount={selectedStudents.length}
            onAssign={handleBulkAssign}
            onClear={handleClearSelection}
          />

          <StudentTable 
            students={filteredStudents}
            selectedStudents={selectedStudents}
            onSelectionChange={setSelectedStudents}
            onAssignSingle={handleAssignSingle}
            onViewStudent={handleViewStudent}
          />

          {/* PAGINATION */}
          <div className={styles.pagination}>
            <span className={styles.pgInfo}>Page 1 of 11 · {students.length} students</span>
            <div className={styles.pgBtns}>
              <Button variant="ghost" size="small" icon={FiChevronLeft} />
              <Button variant="primary" size="small">1</Button>
              <Button variant="ghost" size="small">2</Button>
              <Button variant="ghost" size="small">3</Button>
              <Button variant="ghost" size="small" icon={FiChevronRight} />
            </div>
          </div>
        </div>
      </div>

      <AssignSupervisorModal 
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        mode={modalMode}
        selectedStudents={modalMode === 'single' ? (selectedStudent ? [selectedStudent] : []) : selectedStudents.map(id => students.find(s => s.id === id)).filter(Boolean)}
        onAssign={handleAssign}
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

export default StudentManagement;
