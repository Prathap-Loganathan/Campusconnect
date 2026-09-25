import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeStyle = (status) => {
    switch (status) {
      case 'SUBMITTED':
      case 'OPEN':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ASSIGNED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'IN_PROGRESS':
      case 'CLAIM_PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'RESOLVED':
      case 'RETURNED':
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CLOSED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'REOPENED':
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getBadgeStyle(status)}`}>
      {status ? status.replace('_', ' ') : 'N/A'}
    </span>
  );
};

export default StatusBadge;
