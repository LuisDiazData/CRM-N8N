# GCP Provider configuration
terraform {
  required_version = ">= 1.0"
  
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
  
  backend "gcs" {
    bucket = "crm-insurance-terraform-state"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Variables
variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

# Enable required APIs
resource "google_project_service" "apis" {
  for_each = toset([
    "run.googleapis.com",
    "sql-component.googleapis.com",
    "sqladmin.googleapis.com",
    "secretmanager.googleapis.com",
    "pubsub.googleapis.com",
    "aiplatform.googleapis.com",
    "storage.googleapis.com"
  ])
  
  project = var.project_id
  service = each.value
  
  disable_on_destroy = false
}

# VPC Network
resource "google_compute_network" "main" {
  name                    = "crm-network-${var.environment}"
  auto_create_subnetworks = false
  project                 = var.project_id
}

resource "google_compute_subnetwork" "main" {
  name          = "crm-subnet-${var.environment}"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.main.id
  
  private_ip_google_access = true
}

# VPC Connector for Cloud Run
resource "google_vpc_access_connector" "connector" {
  name          = "crm-connector-${var.environment}"
  region        = var.region
  ip_cidr_range = "10.8.0.0/28"
  network       = google_compute_network.main.name
}

# Cloud SQL Instance (PostgreSQL)
resource "google_sql_database_instance" "main" {
  name             = "crm-db-${var.environment}"
  database_version = "POSTGRES_15"
  region           = var.region
  
  settings {
    tier = "db-f1-micro"
    
    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.main.id
    }
    
    backup_configuration {
      enabled = true
      start_time = "03:00"
    }
  }
  
  deletion_protection = var.environment == "prod"
  
  depends_on = [google_project_service.apis]
}

resource "google_sql_database" "crm" {
  name     = "crm_database"
  instance = google_sql_database_instance.main.name
}

resource "google_sql_user" "crm" {
  name     = "crm_user"
  instance = google_sql_database_instance.main.name
  password = random_password.db_password.result
}

resource "random_password" "db_password" {
  length  = 32
  special = true
}

# Secret Manager for DB password
resource "google_secret_manager_secret" "db_password" {
  secret_id = "crm-db-password-${var.environment}"
  
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "db_password" {
  secret      = google_secret_manager_secret.db_password.id
  secret_data = random_password.db_password.result
}

# Cloud Storage bucket for documents
resource "google_storage_bucket" "documents" {
  name     = "crm-documents-${var.project_id}-${var.environment}"
  location = var.region
  
  uniform_bucket_level_access = true
  
  versioning {
    enabled = true
  }
  
  lifecycle_rule {
    condition {
      age = 365
    }
    action {
      type = "SetStorageClass"
      storage_class = "COLDLINE"
    }
  }
}

# Pub/Sub topic for events
resource "google_pubsub_topic" "events" {
  name = "crm-events-${var.environment}"
}

resource "google_pubsub_subscription" "events" {
  name  = "crm-events-subscription-${var.environment}"
  topic = google_pubsub_topic.events.name
  
  ack_deadline_seconds = 20
  
  retry_policy {
    minimum_backoff = "10s"
    maximum_backoff = "600s"
  }
}

# Cloud Run - n8n
resource "google_cloud_run_service" "n8n" {
  name     = "crm-n8n-${var.environment}"
  location = var.region
  
  template {
    spec {
      containers {
        image = "n8nio/n8n:latest"
        
        ports {
          container_port = 5678
        }
        
        env {
          name  = "N8N_PORT"
          value = "5678"
        }
        
        env {
          name  = "N8N_PROTOCOL"
          value = "https"
        }
        
        env {
          name  = "DB_TYPE"
          value = "postgresdb"
        }
        
        env {
          name = "DB_POSTGRESDB_PASSWORD"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.db_password.secret_id
              key  = "latest"
            }
          }
        }
        
        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
      }
    }
    
    metadata {
      annotations = {
        "run.googleapis.com/vpc-access-connector" = google_vpc_access_connector.connector.id
        "run.googleapis.com/vpc-access-egress"    = "private-ranges-only"
        "autoscaling.knative.dev/maxScale"        = "3"
      }
    }
  }
  
  traffic {
    percent         = 100
    latest_revision = true
  }
  
  depends_on = [google_project_service.apis]
}

# Cloud Run - AI Agents
resource "google_cloud_run_service" "ai_agents" {
  name     = "crm-ai-agents-${var.environment}"
  location = var.region
  
  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/crm-ai-agents:latest"
        
        ports {
          container_port = 8080
        }
        
        env {
          name  = "PORT"
          value = "8080"
        }
        
        env {
          name  = "LOG_LEVEL"
          value = "info"
        }
        
        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
      }
    }
    
    metadata {
      annotations = {
        "run.googleapis.com/vpc-access-connector" = google_vpc_access_connector.connector.id
        "autoscaling.knative.dev/maxScale"        = "5"
      }
    }
  }
  
  traffic {
    percent         = 100
    latest_revision = true
  }
  
  depends_on = [google_project_service.apis]
}

# Cloud Run - Frontend
resource "google_cloud_run_service" "frontend" {
  name     = "crm-frontend-${var.environment}"
  location = var.region
  
  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/crm-frontend:latest"
        
        ports {
          container_port = 3000
        }
        
        env {
          name  = "API_BASE_URL"
          value = google_cloud_run_service.ai_agents.status[0].url
        }
        
        env {
          name  = "N8N_WEBHOOK_URL"
          value = google_cloud_run_service.n8n.status[0].url
        }
        
        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
      }
    }
    
    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" = "10"
      }
    }
  }
  
  traffic {
    percent         = 100
    latest_revision = true
  }
  
  depends_on = [google_project_service.apis]
}

# IAM - Allow unauthenticated access to frontend
resource "google_cloud_run_service_iam_member" "frontend_public" {
  service  = google_cloud_run_service.frontend.name
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Outputs
output "n8n_url" {
  value       = google_cloud_run_service.n8n.status[0].url
  description = "n8n service URL"
}

output "ai_agents_url" {
  value       = google_cloud_run_service.ai_agents.status[0].url
  description = "AI Agents service URL"
}

output "frontend_url" {
  value       = google_cloud_run_service.frontend.status[0].url
  description = "Frontend service URL"
}

output "database_connection" {
  value       = google_sql_database_instance.main.connection_name
  description = "Database connection name"
  sensitive   = true
}
