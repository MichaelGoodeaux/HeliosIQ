# environments/staging/main.tf
terraform {
  backend "s3" {
    key = "staging/terraform.tfstate"
  }
}

module "staging_infrastructure" {
  source = "../../modules/heliosiq"

  environment = "staging"
  project_name = var.project_name

  # Cloud Provider Settings
  enable_aws   = var.enable_aws
  enable_azure = var.enable_azure
  enable_gcp   = var.enable_gcp
  
  aws_region   = var.aws_region
  azure_region = var.azure_region
  gcp_region   = var.gcp_region

  # Cluster Configuration
  cluster_name = "${var.project_name}-staging"
  node_count   = var.node_count

  # Resource Limits
  resource_limits = {
    cpu    = "1"
    memory = "2Gi"
  }

  # Monitoring Configuration
  monitoring_config = {
    enabled        = true
    retention_days = 14
    admin_password = var.grafana_admin_password
  }

  # Staging-specific settings
  enable_debug = true
  tags = merge(var.additional_tags, {
    Environment = "staging"
  })
}