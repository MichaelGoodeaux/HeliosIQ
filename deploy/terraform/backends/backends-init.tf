# backends/backend-init.tf

# Variables
variable "region" {
  description = "The region to create resources in"
  type        = string
  default     = "us-west-2"  # Default to us-west-2 for AWS
}

variable "environment" {
  description = "Environment name"
  type        = string
}

# AWS Backend Resources
resource "aws_s3_bucket" "terraform_state" {
  bucket = "heliosiq-terraform-state-${var.environment}"
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_dynamodb_table" "terraform_state_lock" {
  name           = "terraform-state-lock-${var.environment}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}

# Azure Backend Resources
resource "azurerm_resource_group" "terraform_state" {
  name     = "terraform-state-rg-${var.environment}"
  location = var.region
}

resource "azurerm_storage_account" "terraform_state" {
  name                            = "heliosiqtfstate${var.environment}"
  resource_group_name             = azurerm_resource_group.terraform_state.name
  location                        = azurerm_resource_group.terraform_state.location
  account_tier                    = "Standard"
  account_replication_type        = "GRS"
  min_tls_version                = "TLS1_2"
  allow_nested_items_to_be_public = false
}

# Using data source to get the storage account details
data "azurerm_storage_account" "terraform_state" {
  name                = azurerm_storage_account.terraform_state.name
  resource_group_name = azurerm_resource_group.terraform_state.name
}

resource "azurerm_storage_container" "terraform_state" {
  name                 = "tfstate"
  storage_account_id   = data.azurerm_storage_account.terraform_state.id
  container_access_type = "private"
}

# GCP Backend Resources
resource "google_storage_bucket" "terraform_state" {
  name          = "heliosiq-terraform-state-${var.environment}"
  location      = var.region
  force_destroy = false

  versioning {
    enabled = true
  }

  uniform_bucket_level_access = true

  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }
}

resource "google_storage_bucket_iam_binding" "terraform_state" {
  bucket = google_storage_bucket.terraform_state.name
  role   = "roles/storage.objectViewer"
  members = [
    "serviceAccount:terraform@your-project.iam.gserviceaccount.com",
  ]
}