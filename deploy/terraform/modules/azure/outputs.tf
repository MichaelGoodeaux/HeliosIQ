# modules/azure/outputs.tf
output "cluster_endpoint" {
  description = "Endpoint for AKS cluster"
  value       = azurerm_kubernetes_cluster.main.kube_config.0.host
}

output "cluster_name" {
  description = "Name of the AKS cluster"
  value       = azurerm_kubernetes_cluster.main.name
}

output "monitoring_url" {
  description = "URL for Grafana dashboard"
  value       = "https://grafana.${azurerm_kubernetes_cluster.main.fqdn}/d/k8s"
}