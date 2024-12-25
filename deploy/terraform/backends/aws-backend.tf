# backends/aws-backend.tf
terraform {
  backend "s3" {
    bucket         = "heliosiq-terraform-state"
    key            = "terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
    
    # Enable versioning and prevent state loss
    versioning {
      enabled = true
    }
    
    # Enable server-side encryption
    server_side_encryption_configuration {
      rule {
        apply_server_side_encryption_by_default {
          sse_algorithm = "AES256"
        }
      }
    }
  }
}