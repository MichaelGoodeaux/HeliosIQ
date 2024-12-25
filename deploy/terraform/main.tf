# main.tf
terraform {
  required_version = ">= 1.0.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.0"
    }
  }
}

# Deploy to AWS if enabled
module "aws_deployment" {
  count  = var.enable_aws ? 1 : 0
  source = "./modules/aws"

  environment     = var.environment
  region         = var.aws_region
  cluster_name   = "${local.project_name}-${var.environment}-aws"
  node_count     = local.environment_configs[var.environment].node_count
  instance_type  = local.environment_configs[var.environment].instance_sizes.aws
  
  monitoring_config = {
    enabled         = var.enable_monitoring
    retention_days  = local.environment_configs[var.environment].monitoring_retention_days
    admin_password  = var.grafana_admin_password
  }

  resource_limits = local.environment_configs[var.environment].resource_limits
  enable_debug    = local.environment_configs[var.environment].enable_debug
  
  backup_config   = try(local.environment_configs[var.environment].backup_config, null)
  tags            = local.common_tags
}

# Deploy to Azure if enabled
module "azure_deployment" {
  count  = var.enable_azure ? 1 : 0
  source = "./modules/azure"

  environment     = var.environment
  region         = var.azure_region
  cluster_name   = "${local.project_name}-${var.environment}-azure"
  node_count     = local.environment_configs[var.environment].node_count
  instance_type  = local.environment_configs[var.environment].instance_sizes.azure
  
  monitoring_config = {
    enabled         = var.enable_monitoring
    retention_days  = local.environment_configs[var.environment].monitoring_retention_days
    admin_password  = var.grafana_admin_password
  }

  resource_limits = local.environment_configs[var.environment].resource_limits
  enable_debug    = local.environment_configs[var.environment].enable_debug
  
  backup_config   = try(local.environment_configs[var.environment].backup_config, null)
  tags            = local.common_tags
}

# Deploy to GCP if enabled
module "gcp_deployment" {
  count  = var.enable_gcp ? 1 : 0
  source = "./modules/gcp"

  environment     = var.environment
  region         = var.gcp_region
  cluster_name   = "${local.project_name}-${var.environment}-gcp"
  node_count     = local.environment_configs[var.environment].node_count
  instance_type  = local.environment_configs[var.environment].instance_sizes.gcp
  
  monitoring_config = {
    enabled         = var.enable_monitoring
    retention_days  = local.environment_configs[var.environment].monitoring_retention_days
    admin_password  = var.grafana_admin_password
  }

  resource_limits = local.environment_configs[var.environment].resource_limits
  enable_debug    = local.environment_configs[var.environment].enable_debug
  
  backup_config   = try(local.environment_configs[var.environment].backup_config, null)
  tags            = local.common_tags
}