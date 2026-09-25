import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, AlertCircle, Search, Shield, FileText, CheckSquare } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'ROLE_ADMIN': return '/admin-dashboard';
      case 'ROLE_WARDEN': return '/warden-dashboard';
      case 'ROLE_STAFF': return '/staff-dashboard';
      default: return '/student-dashboard';
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4">
      <nav className="space-y-1">
        <NavLink
          to={getDashboardPath()}
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
              isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/lost-found"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
              isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`
          }
        >
          <Search className="w-5 h-5" />
          <span>Lost & Found</span>
        </NavLink>

        {user && (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_WARDEN') && (
          <div className="pt-4 mt-4 border-t border-slate-100">
            <div className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Management
            </div>
            <NavLink
              to="/admin-dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Shield className="w-5 h-5" />
              <span>Admin Analytics</span>
            </NavLink>
          </div>
        )}
      </nav>

      {user && (
        <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="text-xs font-semibold text-slate-500 uppercase">Profile Details</div>
          <div className="mt-2 text-xs text-slate-600 space-y-1">
            <div><span className="font-semibold">ID:</span> {user.identifierId || 'N/A'}</div>
            <div><span className="font-semibold">Block:</span> {user.hostelOrBlock || 'N/A'}</div>
            <div><span className="font-semibold">Room:</span> {user.roomNumber || 'N/A'}</div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
