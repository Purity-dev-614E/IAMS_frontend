import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import supervisorStudentsService from '../services/supervisorStudentsService';
import styles from './MyStudents.module.css';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';
import StatsCard from '../widgets/StatsCard';
import FilterTabs from '../widgets/FilterTabs';
import StudentsTable from '../widgets/StudentsTable';
import { profileService } from '../../../shared/profile/profileService';
import Toast from '../../../shared/widgets/Toast';

const MyStudents = () => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });

  // Load students from API
  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await supervisorStudentsService.getMyStudents();
      
      const formattedStudents = response.students.map(student => 
        supervisorStudentsService.formatStudentForDisplay(student)
      );
      
      setStudents(formattedStudents);
    } catch (error) {
      console.error('Error loading students:', error);
      setError(error.message);
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadStudents();
    }
  }, [user]);

  const counts = supervisorStudentsService.calculateStats(students);

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

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleFlagToggle = async (studentId) => {
    try {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      // Call API to toggle flag
      await supervisorStudentsService.toggleStudentFlag(studentId, !student.flagged);

      // Update local state
      setStudents(prevStudents => 
        prevStudents.map(s => {
          if (s.id === studentId) {
            return supervisorStudentsService.formatStudentForDisplay({
              ...s,
              flagged: !s.flagged
            });
          }
          return s;
        })
      );

      showToast(
        student.flagged ? 'Student unflagged successfully' : 'Student flagged successfully',
        'success'
      );
    } catch (error) {
      console.error('Error toggling flag:', error);
      showToast(error.message, 'error');
    }
  };

  const handleViewReviews = (student) => {
    console.log(`Opening ${student.name}'s reviews`);
    // Navigate to student reviews page or open modal
    // This would typically use React Router navigation
  };

  const handleExportProgress = async () => {
    try {
      const csvContent = supervisorStudentsService.exportToCSV(students);
      await supervisorStudentsService.downloadCSV(csvContent);
      showToast('Student progress exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting progress:', error);
      showToast(error.message, 'error');
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredStudents = () => {
    let filtered = supervisorStudentsService.filterStudents(students, activeFilter);
    
    if (searchTerm) {
      filtered = supervisorStudentsService.searchStudents(filtered, searchTerm);
    }
    
    return filtered;
  };

  return (
    <div className={styles.shell}>
      <AppSidebar 
        navigationItems={profileService.getNavigationItems(user)} 
        user={profileService.getUserDisplayInfo(user)} 
      />

      <div className={styles.main}>
        <div className={styles.topbar}>
          <div>
            <div className={styles.topbarTitle}>My Students</div>
            <div className={styles.topbarSubtitle}>
              {loading ? 'Loading...' : `${students.length} students assigned · Week 6`}
            </div>
          </div>
          <button 
            className={`${styles.btn} ${styles.btnGhost}`}
            onClick={handleExportProgress}
            disabled={loading || students.length === 0}
          >
            ↓ Export progress
          </button>
        </div>

        <div className={styles.content}>
          {error && (
            <div className={styles.errorMessage}>
              Error: {error}
              <button 
                onClick={loadStudents}
                className={styles.retryButton}
              >
                Retry
              </button>
            </div>
          )}
          
          <div className={styles.stats}>
            <StatsCard
              label="Assigned students"
              value={students.length}
              subtitle="this cohort"
              pill="All active"
              pillColor="var(--bl)"
            />
            <StatsCard
              label="Need my feedback"
              value={counts.needs}
              subtitle="Week 6 reviews pending"
              pill="Action needed"
              pillColor="var(--abg)"
            />
            <StatsCard
              label="Fully reviewed"
              value={counts.reviewed}
              subtitle="up to date this week"
              pill="On track"
              pillColor="var(--gbg)"
            />
            <StatsCard
              label="Flagged"
              value={counts.flagged}
              subtitle="needs attention"
              pill={counts.flagged > 0 ? `${counts.flagged} students` : 'None'}
              pillColor="var(--rbg)"
            />
          </div>

          <div className={styles.toolbar}>
            <FilterTabs
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              counts={counts}
            />
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}>⌕</span>
              <input
                type="text"
                placeholder="Search student..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          <StudentsTable
            students={getFilteredStudents()}
            loading={loading}
            onFlagToggle={handleFlagToggle}
            onViewReviews={handleViewReviews}
          />
        </div>
      </div>

      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default MyStudents;
