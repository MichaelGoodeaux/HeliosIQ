# backends/gcp-backend.tf
terraform {
  backend "gcs" {
    bucket = "heliosiq-terraform-state"
    prefix = "terraform/state"
    
    # Enable encryption
    encryption_key = null  # Uses Google-managed encryption keys
    
    # Enable versioning
    versioning_enabled = true
    
    # Enable uniform bucket-level access
    uniform_bucket_level_access = true
  }
}