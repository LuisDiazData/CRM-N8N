import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678';

// API client for AI agents service
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// n8n webhook client
const n8nClient = axios.create({
  baseURL: N8N_WEBHOOK_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Procedure types
export interface Customer {
  name: string;
  email: string;
  phone: string;
  documentId?: string;
}

export interface Procedure {
  id: string;
  createdAt: string;
  status: 'NEW' | 'IN_PROGRESS' | 'PENDING_DOCUMENTS' | 'UNDER_REVIEW' | 'COMPLETED' | 'CANCELLED';
  source: string;
  customer: Customer;
  procedureType: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  assignedAnalyst: string | null;
  category?: string;
  complexity?: string;
  description?: string;
}

export interface KPIData {
  timestamp: string;
  period: string;
  operational: {
    totalProcedures: number;
    completed: number;
    inProgress: number;
    pending: number;
    avgCompletionHours: number;
    slaComplianceRate: number;
    completionRate: number;
  };
  analysts: Array<{
    name: string;
    proceduresHandled: number;
    avgHandlingHours: number;
    avgSatisfaction: number;
    errorRate: number;
  }>;
}

// API functions
export const procedureService = {
  // Create new procedure via n8n webhook
  async createProcedure(data: {
    customerName: string;
    email: string;
    phone: string;
    procedureType: string;
    priority: string;
    description: string;
    source?: string;
  }): Promise<{ success: boolean; procedureId: string }> {
    const response = await n8nClient.post('/webhook/lead-capture', data);
    return response.data;
  },

  // Update procedure status via n8n webhook
  async updateStatus(data: {
    procedureId: string;
    previousStatus: string;
    newStatus: string;
    analystId: string;
    notes?: string;
  }): Promise<{ success: boolean; procedureId: string; newStatus: string }> {
    const response = await n8nClient.put('/webhook/procedure-status', data);
    return response.data;
  },

  // Get procedures list (from backend API)
  async getProcedures(filters?: {
    status?: string;
    analyst?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Procedure[]> {
    const response = await apiClient.get('/procedures', { params: filters });
    return response.data;
  },

  // Get single procedure
  async getProcedure(id: string): Promise<Procedure> {
    const response = await apiClient.get(`/procedures/${id}`);
    return response.data;
  },
};

export const kpiService = {
  // Get current KPIs
  async getKPIs(): Promise<KPIData> {
    const response = await apiClient.get('/kpis/current');
    return response.data;
  },

  // Get KPI history
  async getKPIHistory(period: '24h' | '7d' | '30d'): Promise<KPIData[]> {
    const response = await apiClient.get('/kpis/history', { params: { period } });
    return response.data;
  },

  // Get analyst performance
  async getAnalystPerformance(analystId: string): Promise<any> {
    const response = await apiClient.get(`/kpis/analyst/${analystId}`);
    return response.data;
  },
};

export const aiService = {
  // Classify procedure
  async classify(procedureData: any): Promise<any> {
    const response = await apiClient.post('/classify', { procedureData: JSON.stringify(procedureData) });
    return response.data;
  },

  // Prioritize procedures
  async prioritize(procedures: any[]): Promise<any> {
    const response = await apiClient.post('/prioritize', { procedures });
    return response.data;
  },

  // Analyze KPIs
  async analyzeKPIs(kpiData: KPIData): Promise<any> {
    const response = await apiClient.post('/analyze-kpis', { kpiData: JSON.stringify(kpiData) });
    return response.data;
  },
};

export default { procedureService, kpiService, aiService };
