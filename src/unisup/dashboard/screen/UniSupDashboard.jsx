import React, { useState } from 'react';
import styles from './UniSupDashboard.module.css';
import AppSidebar from '../../../shared/components/AppSidebar/AppSidebar';
import UniSupTopbar from '../widgets/UniSupTopbar';
import UniSupStatsGrid from '../widgets/UniSupStatsGrid';
import StudentList from '../widgets/StudentList';
import StudentDetailPanel from '../widgets/StudentDetailPanel';
import { useAuth } from '../../../contexts/AuthContext';

const UniSupDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { user } = useAuth();

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  const supervisorNavigationItems = [
    {
      title: 'Main',
      items: [
        { to: '/supervisor', label: 'Dashboard', icon: '▦' },
        { to: '/supervisor/students', label: 'My Students', icon: '⊞' },
        { to: '/supervisor/reviews', label: 'Weekly Reviews', icon: '⊞' },
      ]
    },
    {
      title: 'Account',
      items: [
        { to: '/profile', label: 'Profile', icon: '◉' },
      ]
    }
  ];

  return (
    <div className={styles.shell}>
      {/* SIDEBAR */}
      <AppSidebar 
        navigationItems={supervisorNavigationItems} 
        user={user ? {
          initials: 'FK',
          name: user.name || 'Dr. F. Kamau',
          role: 'University Supervisor'
        } : null}
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
