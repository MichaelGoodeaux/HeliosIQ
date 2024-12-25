# outputs.tf
output "cluster_endpoints" {
  description = "Map of cluster endpoints for each enabled cloud provider"
  value = {
    aws   = var.enable_aws ? module.aws_deployment[0].cluster_endpoint : null
    azure = var.enable_azure ? module.azure_deployment[0].cluster_endpoint : null
    gcp   = var.enable_gcp ? module.gcp_deployment[0].cluster_endpoint : null
  }
  sensitive = true
}

output "monitoring_urls" {
  description = "Map of monitoring URLs for each enabled cloud provider"
  value = {
    aws   = var.enable_aws ? module.aws_deployment[0].monitoring_url : null
    azure = var.enable_azure ? module.azure_deployment[0].monitoring_url : null
    gcp   = var.enable_gcp ? module.gcp_deployment[0].monitoring_url : null
  }
}

output "environment_config" {
  description = "Current environment configuration"
  value = local.environment_configs[var.environment]
}

output "enabled_providers" {
  description = "List of enabled cloud providers"
  value = compact([
    var.enable_aws ? "aws" : "",
    var.enable_azure ? "azure" : "",
    var.enable_gcp ? "gcp" : ""
  ])
}