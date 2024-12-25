# environments/production/outputs.tf
output "cluster_endpoints" {
  description = "Kubernetes cluster endpoints"
  value       = module.production_infrastructure.cluster_endpoints
  sensitive   = true
}

output "monitoring_urls" {
  description = "Monitoring dashboard URLs"
  value       = module.production_infrastructure.monitoring_urls
}

output "backup_status" {
  description = "Backup configuration status"
  value       = module.production_infrastructure.backup_status
}