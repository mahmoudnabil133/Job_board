/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import CandidateDashboard from './pages/CandidateDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterHubPage from './pages/RegisterHubPage';
import RegisterEmployeePage from './pages/RegisterEmployeePage';
import RegisterEmployerPage from './pages/RegisterEmployerPage';
import RegisterAdminPage from './pages/RegisterAdminPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterHubPage />} />
          <Route path="/register/employee" element={<RegisterEmployeePage />} />
          <Route path="/register/employer" element={<RegisterEmployerPage />} />
          <Route path="/register/admin" element={<RegisterAdminPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailsPage />} />

              <Route element={<RoleRoute allow={['candidate']} />}>
                <Route path="/dashboard/candidate" element={<CandidateDashboard />} />
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
    </Router>
  );
}
