# environments/development/main.tf
terraform {
  backend "s3" {
    key = "development/terraform.tfstate"
  }
}

module "development_infrastructure" {
  source = "../../modules/heliosiq"

  environment = "development"
  project_name = var.project_name

  # Cloud Provider Settings
  enable_aws   = var.enable_aws
  enable_azure = var.enable_azure
  enable_gcp   = var.enable_gcp
  
  aws_region   = var.aws_region
  azure_region = var.azure_region
  gcp_region   = var.gcp_region

  # Cluster Configuration
  cluster_name = "${var.project_name}-dev"
  node_count   = var.node_count

  # Resource Limits
  resource_limits = {
    cpu    = "0.5"
    memory = "1Gi"
  }

  # Monitoring Configuration
  monitoring_config = {
    enabled        = true
    retention_days = 7
    admin_password = var.grafana_admin_password
  }

  # Development-specific settings
  enable_debug = true
  tags = merge(var.additional_tags, {
    Environment = "development"
  })
}