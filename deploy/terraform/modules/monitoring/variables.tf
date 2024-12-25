# modules/monitoring/variables.tf
variable "environment" {
  description = "Environment name"
  type        = string
}

variable "cluster_name" {
  description = "Name of the Kubernetes cluster"
  type        = string
}

variable "monitoring_config" {
  description = "Monitoring configuration"
  type = object({
    enabled         = bool
    retention_days  = number
    admin_password  = string
  })
}