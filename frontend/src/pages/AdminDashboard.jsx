import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { Shield, Users, Layers, AlertCircle, Plus, CheckCircle, HelpCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', defaultSlaHours: 24 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resStats, resCat, resUsers] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getCategories(),
        adminAPI.getUsers(),
      ]);
      setStats(resStats.data);
      setCategories(resCat.data);
      setUsers(resUsers.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createCategory(newCategory);
      setShowCategoryModal(false);
      setNewCategory({ name: '', description: '', defaultSlaHours: 24 });
      loadData();
    } catch (err) {
      alert("Failed to add category");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Enterprise Analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Control Center</h1>
          <p className="text-sm text-slate-500">System analytics, category SLA rules, and platform management</p>
        </div>
        <button
          onClick={() => setShowCategoryModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Complaint Category</span>
        </button>
      </div>

      {/* Main Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total System Complaints</div>
          <div className="text-3xl font-bold text-slate-800 mt-2">{stats?.totalComplaints || 0}</div>
          <div className="text-xs text-slate-500 mt-1">Open: {stats?.openComplaints} | In Progress: {stats?.inProgressComplaints}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-400 uppercase">SLA Breaches</div>
          <div className="text-3xl font-bold text-rose-600 mt-2">{stats?.slaBreaches || 0}</div>
          <div className="text-xs text-rose-500 mt-1">Overdue complaints requiring escalation</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-400 uppercase">Lost & Found Items</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">
            {(stats?.totalLostItems || 0) + (stats?.totalFoundItems || 0)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Returned Items: {stats?.totalReturnedItems}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <div className="text-xs font-semibold text-slate-400 uppercase">Registered Users</div>
          <div className="text-3xl font-bold text-indigo-600 mt-2">{users.length}</div>
          <div className="text-xs text-slate-500 mt-1">Students, Staff, Wardens, Admins</div>
        </div>
      </div>

      {/* Breakdown by Category & Hostel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4">Complaints Breakdown by Category</h3>
          <div className="space-y-3">
            {stats?.complaintsByCategory && Object.entries(stats.complaintsByCategory).map(([cat, count]) => (
              <div key={cat} className="flex justify-between items-center text-sm">
                <span className="text-slate-600">{cat}</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full text-xs">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4">Complaints Breakdown by Hostel/Block</h3>
          <div className="space-y-3">
            {stats?.complaintsByHostel && Object.entries(stats.complaintsByHostel).map(([hostel, count]) => (
              <div key={hostel} className="flex justify-between items-center text-sm">
                <span className="text-slate-600">{hostel}</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full text-xs">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category SLA Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Complaint Categories & SLA Rules</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase border-b border-slate-100">
              <tr>
                <th className="p-4">Category Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Default SLA Limit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="p-4 font-bold text-slate-800">{cat.name}</td>
                  <td className="p-4 text-slate-600 text-xs">{cat.description}</td>
                  <td className="p-4 font-semibold text-blue-600">{cat.defaultSlaHours} Hours</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Add Complaint Category</h3>
            <form onSubmit={handleAddCategory} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elevator Maintenance"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Lift and elevator breakdowns"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Default SLA Limit (Hours)</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                  value={newCategory.defaultSlaHours}
                  onChange={(e) => setNewCategory({ ...newCategory, defaultSlaHours: parseInt(e.target.value) })}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
