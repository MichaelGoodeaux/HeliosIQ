# modules/monitoring/outputs.tf
output "grafana_url" {
  description = "URL for Grafana dashboard"
  value       = "https://grafana.${var.cluster_name}/d/k8s"
}