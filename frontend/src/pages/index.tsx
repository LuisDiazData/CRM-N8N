import React from 'react';
import { Layout } from '../components/Layout';
import { KPICard, ProcedureCard } from '../components/Cards';

// Mock data for demonstration
const mockKPIs = {
  totalProcedures: 156,
  completionRate: 87,
  avgHandlingTime: 2.4,
  slaCompliance: 94,
  pending: 23,
  inProgress: 18,
};

const mockProcedures = [
  {
    id: 'PROC-001',
    customer: { name: 'Juan García', email: 'juan@email.com' },
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    procedureType: 'Reclamo',
    createdAt: '2024-01-15T10:30:00Z',
    assignedAnalyst: 'María López',
  },
  {
    id: 'PROC-002',
    customer: { name: 'Ana Martínez', email: 'ana@email.com' },
    status: 'NEW',
    priority: 'NORMAL',
    procedureType: 'Nueva Póliza',
    createdAt: '2024-01-15T11:00:00Z',
    assignedAnalyst: null,
  },
  {
    id: 'PROC-003',
    customer: { name: 'Carlos Rodríguez', email: 'carlos@email.com' },
    status: 'PENDING_DOCUMENTS',
    priority: 'URGENT',
    procedureType: 'Endoso',
    createdAt: '2024-01-15T09:15:00Z',
    assignedAnalyst: 'Pedro Sánchez',
  },
];

export default function Dashboard() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Resumen de operaciones y KPIs del CRM
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Trámites"
            value={mockKPIs.totalProcedures}
            change={12}
            changeLabel="vs. mes anterior"
            status="neutral"
          />
          <KPICard
            title="Tasa de Completación"
            value={`${mockKPIs.completionRate}%`}
            change={5}
            changeLabel="vs. mes anterior"
            status="success"
          />
          <KPICard
            title="Tiempo Promedio (hrs)"
            value={mockKPIs.avgHandlingTime}
            change={-8}
            changeLabel="vs. mes anterior"
            status="success"
          />
          <KPICard
            title="Cumplimiento SLA"
            value={`${mockKPIs.slaCompliance}%`}
            change={2}
            changeLabel="vs. mes anterior"
            status={mockKPIs.slaCompliance >= 90 ? 'success' : 'warning'}
          />
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">Trámites por Estado</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pendientes</span>
                <span className="font-semibold text-blue-600">{mockKPIs.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">En Progreso</span>
                <span className="font-semibold text-yellow-600">{mockKPIs.inProgress}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completados Hoy</span>
                <span className="font-semibold text-green-600">12</span>
              </div>
            </div>
          </div>

          <div className="col-span-2 rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">Rendimiento por Analista</h3>
            <div className="mt-4">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-2">Analista</th>
                    <th className="pb-2">Trámites</th>
                    <th className="pb-2">Tiempo Prom.</th>
                    <th className="pb-2">Satisfacción</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr>
                    <td className="py-2">María López</td>
                    <td>28</td>
                    <td>2.1 hrs</td>
                    <td>
                      <span className="text-green-600">4.8 ⭐</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2">Pedro Sánchez</td>
                    <td>24</td>
                    <td>2.5 hrs</td>
                    <td>
                      <span className="text-green-600">4.6 ⭐</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2">Laura Torres</td>
                    <td>22</td>
                    <td>2.8 hrs</td>
                    <td>
                      <span className="text-yellow-600">4.2 ⭐</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Procedures */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Trámites Recientes</h2>
            <a href="/procedures" className="text-sm text-primary-600 hover:text-primary-700">
              Ver todos →
            </a>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockProcedures.map((procedure) => (
              <ProcedureCard key={procedure.id} procedure={procedure} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
