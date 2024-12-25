# modules/monitoring/main.tf
resource "helm_release" "prometheus_operator" {
  name       = "prometheus"
  repository = "https://prometheus-community.github.io/helm-charts"
  chart      = "kube-prometheus-stack"
  namespace  = kubernetes_namespace.monitoring.name

  set {
    name  = "prometheus.retention"
    value = "${var.monitoring_config.retention_days}d"
  }

  set {
    name  = "grafana.adminPassword"
    value = var.monitoring_config.admin_password
  }

  set {
    name  = "grafana.persistence.enabled"
    value = true
  }

  values = [
    templatefile("${path.module}/values.yaml", {
      environment = var.environment
      cluster_name = var.cluster_name
    })
  ]
}

resource "kubernetes_namespace" "monitoring" {
  metadata {
    name = "monitoring"
    
    labels = {
      name = "monitoring"
      environment = var.environment
    }
  }
}