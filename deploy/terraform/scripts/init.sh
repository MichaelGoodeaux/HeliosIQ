# scripts/init.sh
#!/bin/bash

set -e

# Usage function
function show_usage() {
    echo "Usage: $0 -e ENVIRONMENT -b BACKEND"
    echo
    echo "Options:"
    echo "  -e ENVIRONMENT    Required. Environment to initialize (development|staging|production)"
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

# Setup backend based on provider
case $BACKEND in
    aws)
        # Create S3 bucket and DynamoDB table for state management
        aws s3api create-bucket \
            --bucket "heliosiq-terraform-state-${ENVIRONMENT}" \
            --region "us-west-2" \
            --create-bucket-configuration LocationConstraint=us-west-2

        aws dynamodb create-table \
            --table-name "terraform-lock-${ENVIRONMENT}" \
            --attribute-definitions AttributeName=LockID,AttributeType=S \
            --key-schema AttributeName=LockID,KeyType=HASH \
            --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
            --region "us-west-2"
        ;;
    azure)
        # Create Azure Storage Account and Container
        az group create \
            --name "terraform-state-rg-${ENVIRONMENT}" \
            --location "eastus"

        az storage account create \
            --name "heliosiqtfstate${ENVIRONMENT}" \
            --resource-group "terraform-state-rg-${ENVIRONMENT}" \
            --sku Standard_LRS

        az storage container create \
            --name "tfstate" \
            --account-name "heliosiqtfstate${ENVIRONMENT}"
        ;;
    gcp)
        # Create GCP Storage Bucket
        gsutil mb -l us-central1 "gs://heliosiq-terraform-state-${ENVIRONMENT}"
        gsutil versioning set on "gs://heliosiq-terraform-state-${ENVIRONMENT}"
        ;;
esac

echo "Backend infrastructure created successfully! 🚀"
echo "You can now run the deploy script."