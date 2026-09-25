import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Key, Mail, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login({ email, password });
      if (user.role === 'ROLE_ADMIN') navigate('/admin-dashboard');
      else if (user.role === 'ROLE_WARDEN') navigate('/warden-dashboard');
      else if (user.role === 'ROLE_STAFF') navigate('/staff-dashboard');
      else navigate('/student-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-lg mb-3">
            C
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-sm text-slate-500 mt-1">Sign in to CampusConnect Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="user@campusconnect.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Password</label>
            <div className="relative">
              <Key className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-200 text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Quick Demo Accounts Helper */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-400 uppercase text-center mb-3">Quick Demo Login</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickLogin('alice@student.com')}
              className="p-2 border rounded-lg hover:bg-slate-50 text-left font-medium text-slate-700"
            >
              👩‍🎓 Student
            </button>
            <button
              onClick={() => handleQuickLogin('staff.elec@campusconnect.com')}
              className="p-2 border rounded-lg hover:bg-slate-50 text-left font-medium text-slate-700"
            >
              🛠️ Staff
            </button>
            <button
              onClick={() => handleQuickLogin('warden@campusconnect.com')}
              className="p-2 border rounded-lg hover:bg-slate-50 text-left font-medium text-slate-700"
            >
              🏢 Warden
            </button>
            <button
              onClick={() => handleQuickLogin('admin@campusconnect.com')}
              className="p-2 border rounded-lg hover:bg-slate-50 text-left font-medium text-slate-700"
            >
              ⚙️ Admin
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
