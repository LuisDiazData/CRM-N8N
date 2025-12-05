# CRM-N8N - Insurance Agency CRM

A comprehensive CRM system for insurance agencies, designed to improve procedure tracking (trámites) and generate KPIs to measure operational effectiveness and analyst performance.

## 🏗️ Architecture

This project is built on three fundamental pillars:

### 1. 📊 n8n Automation Workflows
Automated business process workflows for:
- Lead capture and procedure creation
- Status tracking and updates
- Notification automation
- KPI analytics generation

### 2. 🤖 AI Agents
Intelligent agents powered by GCP Vertex AI:
- **Classification Agent**: Categorizes procedures by type and complexity
- **Prioritization Agent**: Ranks procedures based on urgency and SLA
- **KPI Analysis Agent**: Generates insights and recommendations

### 3. 🖥️ Frontend Dashboard
React/Next.js application featuring:
- Real-time procedure monitoring
- KPI visualization and analytics
- Analyst performance tracking
- Procedure management interface

## 📁 Project Structure

```
CRM-N8N/
├── n8n/
│   └── workflows/          # n8n workflow JSON files
│       ├── crm-main-workflow.json
│       ├── kpi-analytics-workflow.json
│       └── procedure-status-workflow.json
├── ai-agents/
│   └── src/
│       ├── agents/         # AI agent implementations
│       │   ├── classify.js
│       │   ├── prioritize.js
│       │   └── kpiAnalysis.js
│       ├── utils/
│       └── index.js        # Express server
├── frontend/
│   └── src/
│       ├── components/     # React components
│       ├── pages/          # Next.js pages
│       ├── services/       # API services
│       └── styles/         # CSS styles
├── infrastructure/
│   ├── terraform/          # GCP infrastructure as code
│   └── docker/             # Docker configurations
└── docs/
    └── ARCHITECTURE.md     # Detailed architecture documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- GCP Account (for production deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/LuisDiazData/CRM-N8N.git
   cd CRM-N8N
   ```

2. **Start with Docker Compose**
   ```bash
   cd infrastructure/docker
   docker-compose up -d
   ```

3. **Access the services**
   - n8n: http://localhost:5678
   - AI Agents: http://localhost:8080
   - Frontend: http://localhost:3000

### Manual Setup

1. **AI Agents**
   ```bash
   cd ai-agents
   npm install
   npm run dev
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📈 KPIs Tracked

### Operational KPIs
| Metric | Description |
|--------|-------------|
| Procedure Completion Rate | % of procedures completed |
| Average Processing Time | Hours to complete a procedure |
| SLA Compliance Rate | % of procedures within SLA |
| Backlog Volume | Number of pending procedures |

### Analyst KPIs
| Metric | Description |
|--------|-------------|
| Procedures Handled | Count per analyst |
| Average Handling Time | Hours per procedure |
| Customer Satisfaction | Rating (1-5 scale) |
| Error Rate | % of procedures with errors |

## ☁️ GCP Deployment

### Infrastructure Components
- **Cloud Run**: n8n, AI Agents, Frontend
- **Cloud SQL**: PostgreSQL database
- **Cloud Storage**: Document storage
- **Pub/Sub**: Event messaging
- **Vertex AI**: ML model hosting
- **Secret Manager**: Credentials management

### Deploy with Terraform

1. **Configure variables**
   ```bash
   cd infrastructure/terraform
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your GCP project details
   ```

2. **Deploy infrastructure**
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

## 🔧 n8n Workflows

### Main Workflow (crm-main-workflow.json)
Handles new procedure creation:
1. Receives lead via webhook
2. Transforms and validates data
3. Classifies with AI agent
4. Assigns to analyst
5. Saves to database
6. Sends notification

### KPI Analytics Workflow (kpi-analytics-workflow.json)
Runs hourly to:
1. Fetch operational metrics
2. Fetch analyst metrics
3. Analyze with AI agent
4. Save KPI snapshot
5. Send alerts if thresholds breached

### Status Update Workflow (procedure-status-workflow.json)
Handles procedure status changes:
1. Validates status transition
2. Updates database
3. Logs history
4. Notifies customer on completion

## 🔐 Security

- All services in private VPC
- IAM-based service authentication
- Secrets managed via Secret Manager
- HTTPS/TLS for external communications
- Data encryption at rest and in transit

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is proprietary and confidential.
