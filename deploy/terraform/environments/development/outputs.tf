# environments/development/outputs.tf
output "cluster_endpoints" {
  description = "Kubernetes cluster endpoints"
  value       = module.development_infrastructure.cluster_endpoints
  sensitive   = true
}

output "monitoring_urls" {
  description = "Monitoring dashboard URLs"
  value       = module.development_infrastructure.monitoring_urls
}