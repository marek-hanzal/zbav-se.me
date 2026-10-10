terraform {
  required_version = "= 1.16.5"

  required_providers {
    bunnynet = {
      source  = "BunnyWay/bunnynet"
      version = "= 0.19.1"
    }
    neon = {
      source  = "kislerdm/neon"
      version = "= 0.18.0"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "= 5.21.1"
    }
  }

  backend "s3" {}
}

provider "bunnynet" {}
provider "neon" {}
provider "vercel" {
  team = local.config.team
}

locals {
  config = jsondecode(file("${path.module}/../app.json"))
  dns    = local.config.dns[terraform.workspace]
  name   = "${local.config.prefix}-${terraform.workspace}"
  domain = local.dns.app == "" ? local.config.domain : "${local.dns.app}.${local.config.domain}"
  path   = "${path.module}/../../.release/${terraform.workspace}"

  environment = {
    name            = terraform.workspace
    domain          = local.domain
    origin          = "https://${local.domain}"
    resource_prefix = local.name
  }

  hosts = {
    for key in ["assets", "content"] : key => "${local.dns[key]}.${local.config.domain}"
  }

  public = {
    VITE_ORIGIN      = local.environment.origin
    VITE_APP_ASSETS  = "https://${local.hosts.assets}/"
    VITE_CONTENT_CDN = "https://${local.hosts.content}"
  }
}

output "environment" {
  description = "Environment settings shared by all resources in this workspace."
  value       = local.environment

  precondition {
    condition     = contains(keys(local.config.dns), terraform.workspace)
    error_message = "Application infrastructure requires the dev, uat, or prod workspace. The default workspace is reserved for bootstrap."
  }
}
