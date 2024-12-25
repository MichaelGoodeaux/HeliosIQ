# environments/staging/outputs.tf
output "cluster_endpoints" {
  description = "Kubernetes cluster endpoints"
  value       = module.staging_infrastructure.cluster_endpoints
  sensitive   = true
}

output "monitoring_urls" {
  description = "Monitoring dashboard URLs"
  value       = module.staging_infrastructure.monitoring_urls
}