# CRM-N8N Architecture

## Overview

This project implements a CRM (Customer Relationship Management) system for an insurance agency, designed to improve procedure tracking (trámites) and generate KPIs to measure operational effectiveness and analyst performance.

## Architecture Pillars

The system is built on three fundamental pillars:

### 1. n8n Automation Workflows
- **Purpose**: Automate business processes and procedure handling
- **Location**: `/n8n/workflows/`
- **Components**:
  - Lead capture workflows
  - Procedure status tracking
  - Notification automation
  - Integration with external systems

### 2. AI Agents
- **Purpose**: Assist workflows with intelligent decision-making
- **Location**: `/ai-agents/`
- **Components**:
  - Document classification agent
  - Customer query response agent
  - Procedure prioritization agent
  - KPI analysis agent

### 3. Frontend Interface
- **Purpose**: Visual interface for procedure management and KPI visualization
- **Location**: `/frontend/`
- **Technology**: React/Next.js
- **Features**:
  - Procedure dashboard
  - KPI visualization
  - Analyst performance metrics
  - Real-time updates

## Deployment Architecture (GCP)

```
                    ┌─────────────────────────────────────────────────────────────┐
                    │                     Google Cloud Platform                     │
                    │                                                               │
                    │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
                    │  │  Cloud Run   │    │  Cloud Run   │    │  Cloud Run   │  │
                    │  │   (n8n)      │────│  (AI Agents) │────│  (Frontend)  │  │
                    │  └──────────────┘    └──────────────┘    └──────────────┘  │
                    │         │                   │                    │          │
                    │         └───────────────────┼────────────────────┘          │
                    │                             │                               │
                    │                    ┌────────▼────────┐                      │
                    │                    │  Cloud SQL      │                      │
                    │                    │  (PostgreSQL)   │                      │
                    │                    └─────────────────┘                      │
                    │                                                               │
                    │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
                    │  │ Cloud Storage│    │   Pub/Sub    │    │   Vertex AI  │  │
                    │  │  (Documents) │    │  (Events)    │    │  (ML Models) │  │
                    │  └──────────────┘    └──────────────┘    └──────────────┘  │
                    │                                                               │
                    └─────────────────────────────────────────────────────────────┘
```

## Data Flow

1. **Lead Capture**: External sources → n8n workflow → Database
2. **Procedure Processing**: n8n workflow → AI Agent → Status Update
3. **Notifications**: Status Change → n8n workflow → Email/SMS
4. **Analytics**: Database → AI Agent → KPI Dashboard

## KPI Metrics

The system tracks the following KPIs:

### Operational KPIs
- Procedure completion rate
- Average processing time
- Backlog volume
- SLA compliance rate

### Analyst KPIs
- Procedures handled per analyst
- Average handling time per analyst
- Customer satisfaction score
- Error rate per analyst

## Security Considerations

- All services deployed in private VPC
- IAM roles for service-to-service communication
- Secrets managed via Secret Manager
- HTTPS/TLS for all external communications
- Data encryption at rest and in transit
