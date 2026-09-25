import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';
import { Bell, LogOut, Shield, User, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const res = await notificationAPI.getAll();
      setNotifications(res.data);
      const countRes = await notificationAPI.getUnreadCount();
      setUnreadCount(countRes.data.unreadCount);
    } catch (err) {
      console.error("Error loading notifications:", err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_ADMIN': return 'bg-rose-500';
      case 'ROLE_WARDEN': return 'bg-amber-500';
      case 'ROLE_STAFF': return 'bg-indigo-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                C
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">
                Campus<span className="text-blue-600">Connect</span>
              </span>
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full relative transition"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                      <h4 className="font-semibold text-sm text-slate-800">Notifications</h4>
                      <span className="text-xs text-slate-500">{unreadCount} unread</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-500">No notifications</div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => handleMarkRead(n.id)}
                            className={`p-3 text-xs cursor-pointer hover:bg-slate-50 ${!n.readStatus ? 'bg-blue-50/50 font-medium' : ''}`}
                          >
                            <div className="font-semibold text-slate-800">{n.title}</div>
                            <div className="text-slate-600 mt-0.5">{n.message}</div>
                            <div className="text-[10px] text-slate-400 mt-1">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Info */}
              <div className="flex items-center space-x-3 border-l pl-4 border-slate-200">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-semibold text-slate-800">{user.name}</div>
                  <div className="text-xs text-slate-500 flex items-center justify-end space-x-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${getRoleBadge(user.role)}`}></span>
                    <span>{user.role ? user.role.replace('ROLE_', '') : ''}</span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
