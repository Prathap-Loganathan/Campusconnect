import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import StaffDashboard from './pages/StaffDashboard';
import WardenDashboard from './pages/WardenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ComplaintDetails from './pages/ComplaintDetails';
import LostFoundPage from './pages/LostFoundPage';

const Layout = ({ children }) => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex flex-1">
        {user && <Sidebar />}
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
};

const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  switch (user.role) {
    case 'ROLE_ADMIN': return <Navigate to="/admin-dashboard" replace />;
    case 'ROLE_WARDEN': return <Navigate to="/warden-dashboard" replace />;
    case 'ROLE_STAFF': return <Navigate to="/staff-dashboard" replace />;
    default: return <Navigate to="/student-dashboard" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes inside Main Layout */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<DashboardRedirect />} />
                  <Route
                    path="/student-dashboard"
                    element={<ProtectedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']} />}
                  >
                    <Route index element={<StudentDashboard />} />
                  </Route>

                  <Route
                    path="/staff-dashboard"
                    element={<ProtectedRoute allowedRoles={['ROLE_STAFF', 'ROLE_ADMIN']} />}
                  >
                    <Route index element={<StaffDashboard />} />
                  </Route>

                  <Route
                    path="/warden-dashboard"
                    element={<ProtectedRoute allowedRoles={['ROLE_WARDEN', 'ROLE_ADMIN']} />}
                  >
                    <Route index element={<WardenDashboard />} />
                  </Route>

                  <Route
                    path="/admin-dashboard"
                    element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_WARDEN']} />}
                  >
                    <Route index element={<AdminDashboard />} />
                  </Route>

                  <Route
                    path="/complaints/:id"
                    element={<ProtectedRoute />}
                  >
                    <Route index element={<ComplaintDetails />} />
                  </Route>

                  <Route
                    path="/lost-found"
                    element={<ProtectedRoute />}
                  >
                    <Route index element={<LostFoundPage />} />
                  </Route>
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
