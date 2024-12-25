# modules/gcp/outputs.tf
output "cluster_endpoint" {
  description = "Endpoint for GKE cluster"
  value       = "https://${google_container_cluster.main.endpoint}"
}

output "cluster_name" {
  description = "Name of the GKE cluster"
  value       = google_container_cluster.main.name
}

output "monitoring_url" {
  description = "URL for Grafana dashboard"
  value       = "https://grafana.${google_container_cluster.main.endpoint}/d/k8s"
}