# variables.tf (updated with all required variables)
variable "environment" {
  description = "Deployment environment (development, staging, production)"
  type        = string
  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be one of: development, staging, production"
  }
}

variable "enable_aws" {
  description = "Enable deployment to AWS"
  type        = bool
  default     = false
}

variable "enable_azure" {
  description = "Enable deployment to Azure"
  type        = bool
  default     = false
}

variable "enable_gcp" {
  description = "Enable deployment to GCP"
  type        = bool
  default     = false
}

variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-west-2"
}

variable "azure_region" {
  description = "Azure region for deployment"
  type        = string
  default     = "eastus"
}

variable "gcp_region" {
  description = "GCP region for deployment"
  type        = string
  default     = "us-central1"
}

variable "enable_monitoring" {
  description = "Enable Prometheus and Grafana monitoring stack"
  type        = bool
  default     = true
}

variable "grafana_admin_password" {
  description = "Admin password for Grafana"
  type        = string
  sensitive   = true
}

variable "additional_tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}
