# backends/azure-backend.tf
terraform {
  backend "azurerm" {
    resource_group_name  = "terraform-state-rg"
    storage_account_name = "heliosiqtfstate"
    container_name      = "tfstate"
    key                = "terraform.tfstate"
    
    # Enable encryption and secure access
    use_msi                  = true
    subscription_id          = "your-subscription-id"
    tenant_id               = "your-tenant-id"
    
    # Enable state locking
    lock_enabled = true
  }
}