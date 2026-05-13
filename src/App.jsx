import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PageTransition from './transitions/PageTransition';
import LandingScreen from './shared/landing/screen/LandingScreen';
import LoginScreen from './shared/login/screen/LoginScreen';
import IndustryReviewScreen from './shared/review/screen/IndustryReviewScreen';
import ProfileScreen from './shared/profile/screen/ProfileScreen';
import RegisterPage from './shared/register/screen/RegisterPage';

// Student Screens
import StudentDashboard from './student/dashboard/screen/StudentDashboard';
import MyAttachmentsWidget from './student/attachments/screen/MyAttachmentsWidget';
import DailyLogs from './student/daily-logs/screen/DailyLogs';
import CreateDailyLogNew from './student/daily-logs/new/screen/CreateDailyLogNew';
import EditDailyLog from './student/daily-logs/edit/screen/EditDailyLog';
import WeeklyReviewsNew from './student/reviews/screen/WeeklyReviewsNew';
import FinalReport from './student/reports/screen/FinalReport';

// Admin Screens
import AdminDashboard from './admin/dashboard/screen/AdminDashboard';
import UserManagement from './admin/users/screen/UserManagement';
import StudentManagement from './admin/students/screen/StudentManagement';
import AttachmentOversight from './admin/attachments/screen/AttachmentOversight';
import SupervisorApproval from './admin/supervisor-approval/screen/SupervisorApproval';
import Reports from './admin/reports/screen/Reports';

// University Supervisor Screens
import UniSupDashboard from './unisup/dashboard/screen/UniSupDashboard';
import MyStudents from './unisup/students/screen/MyStudents';
import StudentReviews from './unisup/student/review/screen/StudentReviews';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <PageTransition>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/review/:token" element={<IndustryReviewScreen />} />
              
              {/* Shared Routes */}
              <Route path="/profile" element={<ProfileScreen />} />
              
              {/* Student Routes */}
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/attachments" element={<MyAttachmentsWidget />} />
              <Route path="/logs" element={<DailyLogs />} />
              <Route path="/logs/new" element={<CreateDailyLogNew />} />
              <Route path="/logs/edit/:id" element={<CreateDailyLogNew />} />
              <Route path="/reviews" element={<WeeklyReviewsNew />} />
              <Route path="/reports" element={<FinalReport />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/students" element={<StudentManagement />} />
              <Route path="/admin/attachments" element={<AttachmentOversight />} />
              <Route path="/admin/supervisors/pending" element={<SupervisorApproval />} />
              <Route path="/admin/reports" element={<Reports />} />
              
              {/* University Supervisor Routes */}
              <Route path="/supervisor" element={<UniSupDashboard />} />
              <Route path="/supervisor/students" element={<MyStudents />} />
              <Route path="/supervisor/students/:id/reviews" element={<StudentReviews />} />
              
              {/* Default redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PageTransition>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App
