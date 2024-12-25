# locals.tf
locals {
  project_name = "heliosiq"
  
  # Environment-specific configurations
  environment_configs = {
    development = {
      node_count = 2
      instance_sizes = {
        aws   = "t3.medium"
        azure = "Standard_D2s_v3"
        gcp   = "e2-standard-2"
      }
      monitoring_retention_days = 7
      resource_limits = {
        cpu    = "0.5"
        memory = "1Gi"
      }
      enable_debug = true
    }
    staging = {
      node_count = 3
      instance_sizes = {
        aws   = "t3.large"
        azure = "Standard_D3s_v3"
        gcp   = "e2-standard-4"
      }
      monitoring_retention_days = 14
      resource_limits = {
        cpu    = "1"
        memory = "2Gi"
      }
      enable_debug = true
    }
    production = {
      node_count = 5
      instance_sizes = {
        aws   = "t3.xlarge"
        azure = "Standard_D4s_v3"
        gcp   = "e2-standard-8"
      }
      monitoring_retention_days = 30
      resource_limits = {
        cpu    = "2"
        memory = "4Gi"
      }
      enable_debug = false
      enable_high_availability = true
      backup_config = {
        enabled = true
        retention_days = 30
        schedule = "0 2 * * *"
      }
    }
  }

  # Common tags for all resources
  common_tags = merge(
    {
      Project     = local.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
      LastUpdated = timestamp()
    },
    var.additional_tags
  )
}