# scripts/deploy.sh
#!/bin/bash

set -e

# Usage function
function show_usage() {
    echo "Usage: $0 -e ENVIRONMENT [-a AWS_REGION] [-z AZURE_REGION] [-g GCP_REGION] [-b BACKEND]"
    echo
    echo "Options:"
    echo "  -e ENVIRONMENT    Required. Environment to deploy (development|staging|production)"
    echo "  -a AWS_REGION    Deploy to AWS in specified region"
    echo "  -z AZURE_REGION  Deploy to Azure in specified region"
    echo "  -g GCP_REGION    Deploy to GCP in specified region"
    echo "  -b BACKEND       State backend to use (aws|azure|gcp)"
    echo
    echo "Examples:"
    echo "  $0 -e development -a us-west-2 -b aws"
    echo "  $0 -e staging -a us-west-2 -z eastus -b azure"
    echo "  $0 -e production -a us-west-2 -z eastus -g us-central1 -b gcp"
    exit 1
}

# Parse command line arguments
while getopts "e:a:z:g:b:" opt; do
    case $opt in
        e) ENVIRONMENT="$OPTARG";;
        a) AWS_REGION="$OPTARG";;
        z) AZURE_REGION="$OPTARG";;
        g) GCP_REGION="$OPTARG";;
        b) BACKEND="$OPTARG";;
        ?) show_usage;;
    esac
done

# Validate inputs
if [[ ! $ENVIRONMENT =~ ^(development|staging|production)$ ]]; then
    echo "Error: environment must be one of: development, staging, production"
    show_usage
fi

if [[ ! $BACKEND =~ ^(aws|azure|gcp)$ ]]; then
    echo "Error: backend must be one of: aws, azure, gcp"
    show_usage
fi

# Check if at least one cloud provider is specified
if [ -z "$AWS_REGION" ] && [ -z "$AZURE_REGION" ] && [ -z "$GCP_REGION" ]; then
    echo "Error: at least one cloud provider region must be specified"
    show_usage
fi

# Create terraform.tfvars
cat > terraform.tfvars <<EOF
# Environment Configuration
environment = "${ENVIRONMENT}"

# Cloud Provider Enables
enable_aws = ${AWS_REGION:+true}
enable_azure = ${AZURE_REGION:+true}
enable_gcp = ${GCP_REGION:+true}

# Regions
aws_region = "${AWS_REGION:-us-west-2}"
azure_region = "${AZURE_REGION:-eastus}"
gcp_region = "${GCP_REGION:-us-central1}"

# Import environment-specific variables
EOF

# Append environment-specific variables
cat "config/${ENVIRONMENT}.tfvars" >> terraform.tfvars

# Initialize Terraform with the selected backend
echo "Initializing Terraform with $BACKEND backend..."
terraform init -backend-config="backends/${BACKEND}-backend.tf"

# Plan the deployment
echo "Planning deployment..."
terraform plan -var-file="terraform.tfvars" -out=tfplan

# Apply with confirmation
read -p "Do you want to apply this plan? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Applying deployment..."
    terraform apply tfplan
    
    echo -e "\nDeployment complete! 🚀"
    echo -e "\nCluster Endpoints:"
    terraform output -json cluster_endpoints | jq '.'
    echo -e "\nMonitoring URLs:"
    terraform output -json monitoring_urls | jq '.'
else
    echo "Deployment cancelled"
fi