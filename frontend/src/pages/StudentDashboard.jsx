import React, { useState, useEffect } from 'react';
import { complaintAPI, adminAPI, fileAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { Link } from 'react-router-dom';
import { Plus, Clock, AlertTriangle, CheckCircle2, FileText, Upload, RefreshCw } from 'lucide-react';

const StudentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    priority: 'MEDIUM',
    hostelOrBlock: '',
    roomNumber: '',
    locationDetails: '',
    imageUrl: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resComplaints, resCategories] = await Promise.all([
        complaintAPI.getAll(),
        adminAPI.getCategories(),
      ]);
      setComplaints(resComplaints.data);
      setCategories(resCategories.data);
      if (resCategories.data.length > 0) {
        setFormData((prev) => ({ ...prev, categoryId: resCategories.data[0].id }));
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await fileAPI.upload(file);
      setFormData((prev) => ({ ...prev, imageUrl: res.data.url }));
    } catch (err) {
      alert("File upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await complaintAPI.create(formData);
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        categoryId: categories[0]?.id || '',
        priority: 'MEDIUM',
        hostelOrBlock: '',
        roomNumber: '',
        locationDetails: '',
        imageUrl: '',
      });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create complaint");
    }
  };

  const openCount = complaints.filter((c) => c.status === 'SUBMITTED').length;
  const inProgressCount = complaints.filter((c) => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length;
  const resolvedCount = complaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Student Portal</h1>
          <p className="text-sm text-slate-500">Track and lodge campus maintenance and service complaints</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-2 text-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Lodge Complaint</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Total Filed</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">{complaints.length}</div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Open / Pending</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">{openCount}</div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">In Progress</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">{inProgressCount}</div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <RefreshCw className="w-6 h-6 animate-spin-slow" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Resolved</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{resolvedCount}</div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Complaints List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">My Complaints</h3>
          <button onClick={loadData} className="text-xs text-blue-600 font-semibold hover:underline flex items-center space-x-1">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading complaints...</div>
        ) : complaints.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No complaints submitted yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase border-b border-slate-100">
                <tr>
                  <th className="p-4">Complaint ID</th>
                  <th className="p-4">Title & Category</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">SLA Deadline</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-semibold text-blue-600">{c.complaintNumber}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{c.title}</div>
                      <div className="text-xs text-slate-400">{c.categoryName}</div>
                    </td>
                    <td className="p-4 text-slate-600">
                      {c.hostelOrBlock} - Rm {c.roomNumber}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                        c.priority === 'URGENT' ? 'bg-rose-100 text-rose-700' :
                        c.priority === 'HIGH' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="p-4 text-xs">
                      {c.slaBreached ? (
                        <span className="text-rose-600 font-bold flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>SLA Breached</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">
                          {c.slaDueDate ? new Date(c.slaDueDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <Link
                        to={`/complaints/${c.id}`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg"
                      >
                        View Timeline
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lodge Complaint Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Lodge New Complaint</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Water leaking from bathroom tap"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.defaultSlaHours}h SLA)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hostel / Block</label>
                  <input
                    type="text"
                    placeholder="e.g. Block A"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    value={formData.hostelOrBlock}
                    onChange={(e) => setFormData({ ...formData, hostelOrBlock: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Room No.</label>
                  <input
                    type="text"
                    placeholder="e.g. 304"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location Details</label>
                <input
                  type="text"
                  placeholder="e.g. Near balcony window"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                  value={formData.locationDetails}
                  onChange={(e) => setFormData({ ...formData, locationDetails: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe the issue in detail..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Upload Photo (Optional)</label>
                <input type="file" onChange={handleFileUpload} className="text-xs" />
                {uploading && <span className="text-xs text-blue-600 ml-2">Uploading...</span>}
                {formData.imageUrl && <span className="text-xs text-emerald-600 block mt-1">✓ Photo Attached</span>}
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
