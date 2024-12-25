# modules/gcp/variables.tf
variable "environment" {
  description = "Environment name"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
}

variable "cluster_name" {
  description = "Name of the GKE cluster"
  type        = string
}

variable "node_count" {
  description = "Number of nodes in the cluster"
  type        = number
}

variable "instance_type" {
  description = "Machine type for the nodes"
  type        = string
}

variable "kubernetes_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.27"
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}

variable "monitoring_config" {
  description = "Monitoring configuration"
  type = object({
    enabled         = bool
    retention_days  = number
    admin_password  = string
  })
}

variable "resource_limits" {
  description = "Resource limits for containers"
  type = object({
    cpu    = string
    memory = string
  })
}

variable "enable_debug" {
  description = "Enable debug features"
  type        = bool
  default     = false
}

variable "backup_config" {
  description = "Backup configuration"
  type = object({
    enabled         = bool
    retention_days  = number
    schedule        = string
  })
  default = null
}