# modules/aws/outputs.tf
output "cluster_endpoint" {
  description = "Endpoint for EKS cluster"
  value       = aws_eks_cluster.main.endpoint
}

output "cluster_name" {
  description = "Name of the EKS cluster"
  value       = aws_eks_cluster.main.name
}

output "monitoring_url" {
  description = "URL for Grafana dashboard"
  value       = "https://grafana.${aws_eks_cluster.main.endpoint}/d/k8s"
}