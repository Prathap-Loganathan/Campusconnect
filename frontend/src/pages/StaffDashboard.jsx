import React, { useState, useEffect } from 'react';
import { complaintAPI, fileAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { Link } from 'react-router-dom';
import { Wrench, CheckCircle, Clock, AlertCircle, Upload, MessageSquare } from 'lucide-react';

const StaffDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [status, setStatus] = useState('IN_PROGRESS');
  const [comment, setComment] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await complaintAPI.getAll();
      setTasks(res.data);
    } catch (err) {
      console.error(err);
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
      setImageUrl(res.data.url);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    try {
      await complaintAPI.updateStatus(selectedTask.id, {
        status,
        comment,
        imageUrl,
      });
      setSelectedTask(null);
      setComment('');
      setImageUrl('');
      loadTasks();
    } catch (err) {
      alert("Failed to update task status");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Staff Workstation</h1>
        <p className="text-sm text-slate-500">Manage and update assigned campus maintenance complaints</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Assigned Tasks</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">{tasks.length}</div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Wrench className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">In Progress</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">
              {tasks.filter((t) => t.status === 'IN_PROGRESS').length}
            </div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Completed / Resolved</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              {tasks.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length}
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Assigned Complaints Queue</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading assigned work...</div>
        ) : tasks.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No complaints currently assigned to you.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tasks.map((task) => (
              <div key={task.id} className="p-5 hover:bg-slate-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-blue-600">{task.complaintNumber}</span>
                    <StatusBadge status={task.status} />
                    {task.slaBreached && (
                      <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded">
                        SLA Overdue!
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-slate-800">{task.title}</h4>
                  <p className="text-xs text-slate-500">{task.description}</p>
                  <div className="text-xs text-slate-400">
                    Location: <span className="font-medium text-slate-700">{task.hostelOrBlock} (Room {task.roomNumber})</span> | Contact: {task.student?.name} ({task.student?.phone || 'No phone'})
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setStatus(task.status === 'ASSIGNED' ? 'IN_PROGRESS' : 'RESOLVED');
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition"
                  >
                    Update Progress
                  </button>
                  <Link
                    to={`/complaints/${task.id}`}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl"
                  >
                    History
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progress Update Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Update Complaint #{selectedTask.complaintNumber}</h3>
            <form onSubmit={handleUpdateStatus} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="IN_PROGRESS">IN_PROGRESS (Work Started)</option>
                  <option value="RESOLVED">RESOLVED (Fixed / Completed)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Progress Remark / Resolution Notes</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe work completed or parts replaced..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Resolution Photo Proof (Optional)</label>
                <input type="file" onChange={handleFileUpload} className="text-xs" />
                {uploading && <span className="text-xs text-blue-600 block">Uploading...</span>}
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700"
                >
                  Submit Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
