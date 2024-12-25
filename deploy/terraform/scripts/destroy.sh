# scripts/destroy.sh
#!/bin/bash

set -e

# Usage function
function show_usage() {
    echo "Usage: $0 -e ENVIRONMENT -b BACKEND"
    echo
    echo "Options:"
    echo "  -e ENVIRONMENT    Required. Environment to destroy (development|staging|production)"
    echo "  -b BACKEND       Required. State backend to use (aws|azure|gcp)"
    exit 1
}

# Parse command line arguments
while getopts "e:b:" opt; do
    case $opt in
        e) ENVIRONMENT="$OPTARG";;
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
    echo "Error: backend must be one of: aws|azure|gcp"
    show_usage
fi

# Extra confirmation for production
if [ "$ENVIRONMENT" == "production" ]; then
    echo "⚠️  WARNING: You are about to destroy the PRODUCTION environment! ⚠️"
    echo "Please type 'DESTROY-PRODUCTION' to confirm:"
    read confirmation
    if [ "$confirmation" != "DESTROY-PRODUCTION" ]; then
        echo "Destruction cancelled."
        exit 1
    fi
fi

# Initialize Terraform
echo "Initializing Terraform with $BACKEND backend..."
terraform init -backend-config="backends/${BACKEND}-backend.tf"

# Plan destruction
echo "Planning destruction..."
terraform plan -destroy -var-file="config/${ENVIRONMENT}.tfvars" -out=tfplan

# Apply with confirmation
read -p "Do you want to proceed with destruction? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Proceeding with destruction..."
    terraform destroy -auto-approve -var-file="config/${ENVIRONMENT}.tfvars"
    echo "Infrastructure destroyed! 🗑️"
else
    echo "Destruction cancelled"
fi