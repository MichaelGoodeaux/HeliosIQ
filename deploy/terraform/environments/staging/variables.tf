# environments/staging/variables.tf
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "heliosiq"
}

variable "enable_aws" {
  description = "Enable AWS deployment"
  type        = bool
  default     = false
}

variable "enable_azure" {
  description = "Enable Azure deployment"
  type        = bool
  default     = false
}

variable "enable_gcp" {
  description = "Enable GCP deployment"
  type        = bool
  default     = false
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "azure_region" {
  description = "Azure region"
  type        = string
  default     = "eastus"
}

variable "gcp_region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

variable "node_count" {
  description = "Number of nodes in the cluster"
  type        = number
  default     = 3
}

variable "grafana_admin_password" {
  description = "Admin password for Grafana"
  type        = string
  sensitive   = true
}

variable "additional_tags" {
  description = "Additional tags for resources"
  type        = map(string)
  default     = {}
}