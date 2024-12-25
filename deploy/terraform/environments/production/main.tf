# environments/production/main.tf
terraform {
  backend "s3" {
    key = "production/terraform.tfstate"
  }
}

module "production_infrastructure" {
  source = "../../modules/heliosiq"

  environment = "production"
  project_name = var.project_name

  # Cloud Provider Settings
  enable_aws   = var.enable_aws
  enable_azure = var.enable_azure
  enable_gcp   = var.enable_gcp
  
  aws_region   = var.aws_region
  azure_region = var.azure_region
  gcp_region   = var.gcp_region

  # Cluster Configuration
  cluster_name = "${var.project_name}-prod"
  node_count   = var.node_count

  # Resource Limits
  resource_limits = {
    cpu    = "2"
    memory = "4Gi"
  }

  # Monitoring Configuration
  monitoring_config = {
    enabled        = true
    retention_days = 30
    admin_password = var.grafana_admin_password
  }

  # Production-specific settings
  enable_debug = false
  enable_high_availability = true
  
  backup_config = {
    enabled = true
    retention_days = 30
    schedule = "0 2 * * *"  # Daily at 2 AM
  }

  tags = merge(var.additional_tags, {
    Environment = "production"
  })
}