import React, { useState, useEffect } from 'react';
import { complaintAPI, adminAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { Link } from 'react-router-dom';
import { Shield, UserCheck, AlertTriangle, Clock } from 'lucide-react';

const WardenDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningComplaint, setAssigningComplaint] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resComplaints, resStaff] = await Promise.all([
        complaintAPI.getAll(),
        adminAPI.getUsers('ROLE_STAFF'),
      ]);
      setComplaints(resComplaints.data);
      setStaffList(resStaff.data);
      if (resStaff.data.length > 0) {
        setSelectedStaffId(resStaff.data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!assigningComplaint) return;
    try {
      await complaintAPI.assignStaff(assigningComplaint.id, {
        staffId: selectedStaffId,
        comment,
      });
      setAssigningComplaint(null);
      setComment('');
      loadData();
    } catch (err) {
      alert("Failed to assign staff member");
    }
  };

  const pendingAssignments = complaints.filter((c) => c.status === 'SUBMITTED');
  const slaBreaches = complaints.filter((c) => c.slaBreached);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Warden Command Center</h1>
        <p className="text-sm text-slate-500">Monitor hostel complaints, assign maintenance personnel, & handle SLA escalations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Total Hostel Complaints</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">{complaints.length}</div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Unassigned Issues</div>
            <div className="text-2xl font-bold text-purple-600 mt-1">{pendingAssignments.length}</div>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">SLA Escalation Alerts</div>
            <div className="text-2xl font-bold text-rose-600 mt-1">{slaBreaches.length}</div>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Hostel Complaints & Assignments</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading complaints...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase border-b border-slate-100">
                <tr>
                  <th className="p-4">Complaint</th>
                  <th className="p-4">Student & Location</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Assigned Staff</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                      <div className="font-bold text-blue-600">{c.complaintNumber}</div>
                      <div className="font-semibold text-slate-800">{c.title}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-800">{c.student?.name}</div>
                      <div className="text-xs text-slate-400">{c.hostelOrBlock} - Rm {c.roomNumber}</div>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">{c.categoryName}</td>
                    <td className="p-4">
                      {c.assignedStaff ? (
                        <span className="text-slate-800 font-semibold">{c.assignedStaff.name}</span>
                      ) : (
                        <span className="text-amber-600 text-xs font-semibold bg-amber-50 px-2 py-1 rounded">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="p-4 space-x-2">
                      <button
                        onClick={() => setAssigningComplaint(c)}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg"
                      >
                        {c.assignedStaff ? 'Reassign' : 'Assign Staff'}
                      </button>
                      <Link
                        to={`/complaints/${c.id}`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Modal */}
      {assigningComplaint && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Assign Staff for #{assigningComplaint.complaintNumber}</h3>
            <form onSubmit={handleAssign} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Maintenance Staff Member</label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  {staffList.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assignment Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Inspect electrical wiring by 2 PM"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setAssigningComplaint(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WardenDashboard;
