# Terraform Infrastructure

This directory contains the Terraform configurations for deploying HeliosIQ across multiple cloud providers (AWS, Azure, and GCP). The infrastructure is designed to be environment-aware and cloud-agnostic.

## Directory Structure

```
terraform/
├── backends/              # Backend configurations for state management
├── config/               # Environment-specific configurations
├── environments/         # Environment-specific deployments
│   ├── development/
│   ├── staging/
│   └── production/
├── modules/             # Reusable infrastructure modules
│   ├── aws/
│   ├── azure/
│   ├── gcp/
│   └── monitoring/
└── scripts/            # Deployment and management scripts
```

## Prerequisites

- Terraform >= 1.0.0
- AWS CLI configured (if using AWS)
- Azure CLI configured (if using Azure)
- GCloud CLI configured (if using GCP)
- kubectl
- Access to target cloud providers

## Environment Variables

Set the following environment variables before deployment:

```bash
# AWS
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"

# Azure
export ARM_CLIENT_ID="your-client-id"
export ARM_CLIENT_SECRET="your-client-secret"
export ARM_SUBSCRIPTION_ID="your-subscription-id"
export ARM_TENANT_ID="your-tenant-id"

# GCP
export GOOGLE_CREDENTIALS="path-to-credentials-file"
```

## Quick Start

1. Initialize the backend:
```bash
./scripts/init.sh -e <environment> -b <backend>
```

2. Deploy to your chosen cloud provider(s):
```bash
./scripts/deploy.sh -e <environment> [-a <aws-region>] [-z <azure-region>] [-g <gcp-region>]
```

Examples:
```bash
# Deploy to AWS only (development)
./scripts/deploy.sh -e development -a us-west-2 -b aws

# Deploy to multiple clouds (production)
./scripts/deploy.sh -e production -a us-west-2 -z eastus -g us-central1 -b aws
```

## Environment Configurations

### Development
- Minimal resource allocation
- Debug enabled
- 7-day monitoring retention

### Staging
- Medium resource allocation
- Debug enabled
- 14-day monitoring retention

### Production
- Maximum resource allocation
- High availability enabled
- Backup enabled
- 30-day monitoring retention

## Module Usage

### AWS Module
```hcl
module "aws_deployment" {
  source = "./modules/aws"
  
  environment = "development"
  region     = "us-west-2"
  # ... other variables
}
```

### Azure Module
```hcl
module "azure_deployment" {
  source = "./modules/azure"
  
  environment = "development"
  region     = "eastus"
  # ... other variables
}
```

### GCP Module
```hcl
module "gcp_deployment" {
  source = "./modules/gcp"
  
  environment = "development"
  region     = "us-central1"
  # ... other variables
}
```

## Security Notes

The following values should be stored as GitHub Secrets. Each secret must use the exact key name listed below to be properly read by the Terraform configurations:

### Required GitHub Secrets

#### AWS Credentials
```plaintext
AWS_ACCESS_KEY_ID          # AWS access key for authentication
AWS_SECRET_ACCESS_KEY      # AWS secret key for authentication
AWS_STATE_BUCKET_NAME      # S3 bucket name for Terraform state
AWS_DYNAMODB_TABLE_NAME    # DynamoDB table name for state locking
```

#### Azure Credentials
```plaintext
ARM_CLIENT_ID              # Azure service principal client ID
ARM_CLIENT_SECRET          # Azure service principal client secret
ARM_SUBSCRIPTION_ID        # Azure subscription ID
ARM_TENANT_ID             # Azure tenant ID
AZURE_RESOURCE_GROUP      # Resource group name for state storage
AZURE_STORAGE_ACCOUNT     # Storage account name for state
AZURE_CONTAINER_NAME      # Container name for state storage
```

#### GCP Credentials
```plaintext
GOOGLE_CREDENTIALS        # GCP service account JSON key content
GCP_PROJECT_ID           # GCP project ID
GCP_STATE_BUCKET         # GCP bucket name for Terraform state
```

#### Application Secrets
```plaintext
GRAFANA_ADMIN_PASSWORD   # Admin password for Grafana
MONITORING_TOKEN         # Token for monitoring integrations
SLACK_WEBHOOK_URL        # Webhook URL for Slack notifications
```

### Usage in Terraform Code

These secrets are referenced in the code as:

```hcl
# Example of how secrets are used in Terraform configurations
monitoring_config = {
  enabled        = true
  retention_days = 30
  admin_password = var.grafana_admin_password  # References TF_VAR_grafana_admin_password
}
```

### Usage in GitHub Actions

```yaml
# Example of how secrets are used in GitHub Actions
env:
  TF_VAR_grafana_admin_password: ${{ secrets.GRAFANA_ADMIN_PASSWORD }}
  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
  AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
  ARM_CLIENT_ID: ${{ secrets.ARM_CLIENT_ID }}
  ARM_CLIENT_SECRET: ${{ secrets.ARM_CLIENT_SECRET }}
  ARM_SUBSCRIPTION_ID: ${{ secrets.ARM_SUBSCRIPTION_ID }}
  ARM_TENANT_ID: ${{ secrets.ARM_TENANT_ID }}
  GOOGLE_CREDENTIALS: ${{ secrets.GOOGLE_CREDENTIALS }}
```

### Local Development

For local development, create a `terraform.tfvars` file (do not commit to Git):

```hcl
grafana_admin_password = "your-secure-password"
slack_webhook_url      = "your-webhook-url"
monitoring_token       = "your-monitoring-token"
```

Add to `.gitignore`:
```gitignore
*.tfvars
!example.tfvars
.terraform
*.tfstate
*.tfstate.*
.terraform.lock.hcl

## Cleanup

To destroy the infrastructure:
```bash
./scripts/destroy.sh -e <environment> -b <backend>
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `terraform fmt` to format the code
4. Run `terraform validate` to validate the configuration
5. Submit a pull request

## Common Issues

1. **State Lock Issue**
```bash
# Clear state lock if needed
terraform force-unlock <lock-id>
```

2. **Backend Initialization**
```bash
# Reinitialize backend
terraform init -reconfigure
```

## Additional Resources

- [Terraform Documentation](https://www.terraform.io/docs)
- [AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [GCP Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)