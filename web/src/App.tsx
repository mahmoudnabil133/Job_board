/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import RoleRoute from './components/RoleRoute';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import CompaniesPage from './pages/CompaniesPage';
import CandidateDashboard from './pages/CandidateDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterHubPage from './pages/RegisterHubPage';
import RegisterEmployeePage from './pages/RegisterEmployeePage';
import RegisterEmployerPage from './pages/RegisterEmployerPage';
import NotFoundPage from './pages/NotFoundPage';
import NotificationsPage from './pages/NotificationsPage';
import MessagesPage from './pages/MessagesPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import StyleGuidePage from './pages/StyleGuidePage';

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterHubPage />} />
          <Route path="/register/employee" element={<RegisterEmployeePage />} />
          <Route path="/register/employer" element={<RegisterEmployerPage />} />
          <Route path="/register/admin" element={<Navigate to="/register" replace />} />

          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/style-guide" element={<StyleGuidePage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/settings" element={<AccountSettingsPage />} />

              <Route element={<RoleRoute allow={['candidate']} />}>
                <Route path="/dashboard/candidate" element={<CandidateDashboard />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/jobs/:slug" element={<JobDetailsPage />} />
              </Route>

              <Route element={<RoleRoute allow={['employer']} />}>
                <Route path="/dashboard/employer" element={<EmployerDashboard />} />
              </Route>

              <Route element={<RoleRoute allow={['admin']} />}>
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
