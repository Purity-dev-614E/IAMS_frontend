import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingScreen from './shared/landing/screen/LandingScreen';
import LoginScreen from './shared/login/screen/LoginScreen';
import IndustryReviewScreen from './shared/review/screen/IndustryReviewScreen';
import ProfileScreen from './shared/profile/screen/ProfileScreen';

// Student Screens
import StudentDashboard from './student/dashboard/screen/StudentDashboard';
import MyAttachmentsWidget from './student/attachments/screen/MyAttachmentsWidget';
import CreateAttachment from './student/attachments/new/screen/CreateAttachment';
import DailyLogs from './student/daily-logs/screen/DailyLogs';
import CreateDailyLogNew from './student/daily-logs/new/screen/CreateDailyLogNew';
import EditDailyLog from './student/daily-logs/edit/screen/EditDailyLog';
import WeeklyReviewsNew from './student/reviews/screen/WeeklyReviewsNew';

// Admin Screens
import AdminDashboard from './admin/dashboard/screen/AdminDashboard';
import UserManagement from './admin/users/screen/UserManagement';
import StudentManagement from './admin/students/screen/StudentManagement';
import AttachmentOversight from './admin/attachments/screen/AttachmentOversight';
import SupervisorApproval from './admin/supervisors/pending/screen/SupervisorApproval';

// University Supervisor Screens
import UniSupDashboard from './unisup/dashboard/screen/UniSupDashboard';
import MyStudents from './unisup/students/screen/MyStudents';
import StudentReviews from './unisup/students/reviews/screen/StudentReviews';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/review/:token" element={<IndustryReviewScreen />} />
          
          {/* Shared Routes */}
          <Route path="/profile" element={<ProfileScreen />} />
          
          {/* Student Routes */}
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/attachments" element={<MyAttachmentsWidget />} />
          <Route path="/attachments/new" element={<CreateAttachment />} />
          {/* <Route path="/logs" element={<DailyLogs />} /> */}
          <Route path="/logs/new" element={<CreateDailyLogNew />} />
          <Route path="/logs/:id/edit" element={<EditDailyLog />} />
          <Route path="/reviews" element={<WeeklyReviewsNew />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/students" element={<StudentManagement />} />
          <Route path="/admin/attachments" element={<AttachmentOversight />} />
          <Route path="/admin/supervisors/pending" element={<SupervisorApproval />} />
          
          {/* University Supervisor Routes */}
          <Route path="/supervisor" element={<UniSupDashboard />} />
          <Route path="/supervisor/students" element={<MyStudents />} />
          <Route path="/supervisor/students/:id/reviews" element={<StudentReviews />} />
          
          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App
