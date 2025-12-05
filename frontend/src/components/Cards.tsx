import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  status?: 'success' | 'warning' | 'danger' | 'neutral';
}

export function KPICard({ title, value, change, changeLabel, icon, status = 'neutral' }: KPICardProps) {
  const statusColors = {
    success: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    danger: 'bg-red-50 border-red-200 text-red-700',
    neutral: 'bg-gray-50 border-gray-200 text-gray-700',
  };

  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-500',
  };

  const getChangeColor = () => {
    if (change === undefined || change === 0) return changeColors.neutral;
    return change > 0 ? changeColors.positive : changeColors.negative;
  };

  return (
    <div className={`rounded-xl border p-6 ${statusColors[status]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {change !== undefined && (
            <p className={`mt-1 text-sm ${getChangeColor()}`}>
              {change > 0 ? '↑' : change < 0 ? '↓' : '→'} {Math.abs(change)}%
              {changeLabel && <span className="ml-1 opacity-75">{changeLabel}</span>}
            </p>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-white p-3 shadow-sm">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

interface ProcedureCardProps {
  procedure: {
    id: string;
    customer: { name: string; email: string };
    status: string;
    priority: string;
    procedureType: string;
    createdAt: string;
    assignedAnalyst: string | null;
  };
  onStatusChange?: (id: string, newStatus: string) => void;
}

export function ProcedureCard({ procedure, onStatusChange }: ProcedureCardProps) {
  const statusColors: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-700',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
    PENDING_DOCUMENTS: 'bg-orange-100 text-orange-700',
    UNDER_REVIEW: 'bg-purple-100 text-purple-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  const priorityColors: Record<string, string> = {
    LOW: 'bg-gray-100 text-gray-600',
    NORMAL: 'bg-blue-100 text-blue-600',
    HIGH: 'bg-orange-100 text-orange-600',
    URGENT: 'bg-red-100 text-red-600',
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{procedure.id}</h3>
          <p className="text-sm text-gray-600">{procedure.customer.name}</p>
          <p className="text-xs text-gray-400">{procedure.customer.email}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[procedure.status] || 'bg-gray-100'}`}>
            {procedure.status}
          </span>
          <span className={`rounded-full px-2 py-1 text-xs font-medium ${priorityColors[procedure.priority] || 'bg-gray-100'}`}>
            {procedure.priority}
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-gray-500">{procedure.procedureType}</span>
        <span className="text-gray-400">
          {new Date(procedure.createdAt).toLocaleDateString()}
        </span>
      </div>
      {procedure.assignedAnalyst && (
        <div className="mt-2 text-xs text-gray-500">
          Assigned to: <span className="font-medium">{procedure.assignedAnalyst}</span>
        </div>
      )}
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-700 border-blue-200',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    PENDING_DOCUMENTS: 'bg-orange-100 text-orange-700 border-orange-200',
    UNDER_REVIEW: 'bg-purple-100 text-purple-700 border-purple-200',
    COMPLETED: 'bg-green-100 text-green-700 border-green-200',
    CANCELLED: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}
