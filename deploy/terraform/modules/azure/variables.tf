# modules/azure/variables.tf
variable "environment" {
  description = "Environment name"
  type        = string
}

variable "region" {
  description = "Azure region"
  type        = string
}

variable "cluster_name" {
  description = "Name of the AKS cluster"
  type        = string
}

variable "node_count" {
  description = "Number of nodes in the cluster"
  type        = number
}

variable "instance_type" {
  description = "VM size for the nodes"
  type        = string
}

variable "vnet_cidr" {
  description = "CIDR block for VNet"
  type        = string
  default     = "10.0.0.0/16"
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