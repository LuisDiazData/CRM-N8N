-- Initialize CRM database schema

-- Create procedures table
CREATE TABLE IF NOT EXISTS procedures (
    id VARCHAR(50) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'NEW',
    source VARCHAR(50),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_document_id VARCHAR(50),
    procedure_type VARCHAR(100),
    priority VARCHAR(20) DEFAULT 'NORMAL',
    assigned_analyst VARCHAR(100),
    category VARCHAR(50),
    complexity VARCHAR(20),
    description TEXT,
    estimated_time DECIMAL(10, 2),
    first_contact_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    sla_deadline TIMESTAMP WITH TIME ZONE,
    sla_met BOOLEAN,
    customer_satisfaction_score DECIMAL(3, 2),
    has_errors BOOLEAN DEFAULT FALSE,
    updated_by VARCHAR(100)
);

-- Create procedure history table
CREATE TABLE IF NOT EXISTS procedure_history (
    id SERIAL PRIMARY KEY,
    procedure_id VARCHAR(50) NOT NULL REFERENCES procedures(id),
    previous_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    updated_by VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Create KPI snapshots table
CREATE TABLE IF NOT EXISTS kpi_snapshots (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    period VARCHAR(20),
    operational_kpis JSONB,
    analyst_kpis JSONB,
    ai_insights JSONB
);

-- Create analysts table
CREATE TABLE IF NOT EXISTS analysts (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    team VARCHAR(100),
    skills JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_procedures_status ON procedures(status);
CREATE INDEX IF NOT EXISTS idx_procedures_analyst ON procedures(assigned_analyst);
CREATE INDEX IF NOT EXISTS idx_procedures_created ON procedures(created_at);
CREATE INDEX IF NOT EXISTS idx_procedure_history_procedure ON procedure_history(procedure_id);
CREATE INDEX IF NOT EXISTS idx_kpi_snapshots_timestamp ON kpi_snapshots(timestamp);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_procedures_updated_at
    BEFORE UPDATE ON procedures
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample analysts
INSERT INTO analysts (id, name, email, team, skills) VALUES
    ('analyst-001', 'María López', 'maria.lopez@company.com', 'claims-team', '["claims", "customer-service"]'),
    ('analyst-002', 'Pedro Sánchez', 'pedro.sanchez@company.com', 'sales-team', '["new-policies", "renewals"]'),
    ('analyst-003', 'Laura Torres', 'laura.torres@company.com', 'service-team', '["endorsements", "modifications"]')
ON CONFLICT (id) DO NOTHING;
