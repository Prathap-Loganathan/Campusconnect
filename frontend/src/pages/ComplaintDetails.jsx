import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Clock, MapPin, User, AlertTriangle, CheckCircle, RefreshCw, MessageSquare } from 'lucide-react';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadComplaint();
  }, [id]);

  const loadComplaint = async () => {
    setLoading(true);
    try {
      const res = await complaintAPI.getById(id);
      setComplaint(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await complaintAPI.updateStatus(id, {
        status: newStatus,
        comment: comment || `Status updated to ${newStatus}`,
      });
      setComment('');
      loadComplaint();
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading complaint details...</div>;
  if (!complaint) return <div className="p-8 text-center text-slate-400">Complaint not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      {/* Main Details Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{complaint.complaintNumber}</span>
            <h1 className="text-2xl font-bold text-slate-800 mt-0.5">{complaint.title}</h1>
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        {complaint.slaBreached && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>SLA BREACH ALERT: This complaint has exceeded its expected resolution time!</span>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-y border-slate-100 text-xs text-slate-600">
          <div>
            <span className="font-semibold text-slate-400 block uppercase">Category</span>
            <span className="font-medium text-slate-800">{complaint.categoryName}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-400 block uppercase">Location</span>
            <span className="font-medium text-slate-800">{complaint.hostelOrBlock} (Rm {complaint.roomNumber})</span>
          </div>
          <div>
            <span className="font-semibold text-slate-400 block uppercase">Priority</span>
            <span className="font-medium text-slate-800">{complaint.priority}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-400 block uppercase">Assigned Staff</span>
            <span className="font-medium text-slate-800">{complaint.assignedStaff?.name || 'Unassigned'}</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase mb-1">Description</h4>
          <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">{complaint.description}</p>
        </div>

        {complaint.imageUrl && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Attached Image</h4>
            <img src={complaint.imageUrl} alt="Proof" className="max-h-60 rounded-xl border border-slate-200" />
          </div>
        )}

        {/* Student Action Buttons (Close or Reopen) */}
        {user && user.role === 'ROLE_STUDENT' && complaint.student?.id === user.id && (
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-semibold text-slate-700">Student Confirmation & Feedback</h4>
            <div className="flex gap-2">
              {complaint.status === 'RESOLVED' && (
                <button
                  onClick={() => handleStatusChange('CLOSED')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl"
                >
                  Verify & Close Complaint
                </button>
              )}
              {(complaint.status === 'RESOLVED' || complaint.status === 'CLOSED') && (
                <button
                  onClick={() => handleStatusChange('REOPENED')}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-4 py-2 rounded-xl"
                >
                  Reopen Issue (Not Fixed)
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* History & Timeline */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-base">Resolution Audit Timeline</h3>
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
          {complaint.history?.map((step) => (
            <div key={step.id} className="relative pl-8 flex items-start space-x-3">
              <div className="absolute left-1 top-1.5 w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-sm flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 w-full space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">{step.updatedBy?.name} ({step.updatedBy?.role?.replace('ROLE_', '')})</span>
                  <span className="text-slate-400">{new Date(step.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusBadge status={step.status} />
                </div>
                {step.comment && <p className="text-xs text-slate-600 pt-1">{step.comment}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
