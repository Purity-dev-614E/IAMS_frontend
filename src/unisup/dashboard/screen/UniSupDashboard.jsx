import React, { useState, useEffect } from 'react';
import styles from './UniSupDashboard.module.css';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';
import UniSupTopbar from '../widgets/UniSupTopbar';
import UniSupStatsGrid from '../widgets/UniSupStatsGrid';
import StudentList from '../widgets/StudentList';
import StudentDetailPanel from '../widgets/StudentDetailPanel';
import { useAuth } from '../../../contexts/AuthContext';
import { profileService } from '../../../shared/profile/profileService';

const UniSupDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const { user } = useAuth();

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const profile = await profileService.fetchProfile();
      setProfileData(profile);
    } catch (error) {
      console.error('Profile fetch error:', error);
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  return (
    <div className={styles.shell}>
      {/* SIDEBAR */}
      <AppSidebar 
        navigationItems={profileService.getNavigationItems(profileData || user)} 
        user={profileService.getUserDisplayInfo(profileData || user)}
      />
      
      {/* MAIN */}
      <div className={styles.main}>
        {/* TOPBAR */}
        <UniSupTopbar />
        
        {/* CONTENT */}
        <div className={styles.content}>
          {/* STATS */}
          <UniSupStatsGrid />
          
          {/* MAIN GRID */}
          <div className={styles.mainGrid}>
            {/* LEFT: Student list */}
            <StudentList 
              onStudentSelect={handleStudentSelect}
              selectedStudent={selectedStudent}
            />
            
            {/* RIGHT: Detail panel */}
            <StudentDetailPanel student={selectedStudent} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniSupDashboard;
