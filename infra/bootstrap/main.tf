terraform {
  required_version = "= 1.16.5"

  required_providers {
    bunnynet = {
      source  = "BunnyWay/bunnynet"
      version = "= 0.19.1"
    }
  }

  # All Terraform operations use S3. argc supplies public backend settings
  # from ../backend.json; credentials are passed only through the environment.
  backend "s3" {}
}

provider "bunnynet" {}

locals {
  state  = jsondecode(file("${path.module}/../backend.json"))
  config = jsondecode(file("${path.module}/../app.json"))
}

variable "state_zone_id" {
  description = "Existing Bunny state zone created by argc infra-bootstrap-create."
  type        = number
}

import {
  to = bunnynet_storage_zone.state
  id = tostring(var.state_zone_id)
}

resource "bunnynet_storage_zone" "state" {
  name      = local.state.bucket
  region    = upper(local.state.region)
  zone_tier = "Standard"
  type      = "S3"

  lifecycle {
    prevent_destroy = true

    precondition {
      condition     = terraform.workspace == "default"
      error_message = "The shared state zone is managed only in the bootstrap default workspace."
    }
  }
}

output "state_zone_id" {
  description = "Bunny storage zone managed by the bootstrap state."
  value       = bunnynet_storage_zone.state.id
}

resource "bunnynet_dns_zone" "app" {
  domain = local.config.domain

  lifecycle {
    prevent_destroy = true
  }
}

output "dns" {
  description = "Shared DNS zone and the nameservers to set at the registrar. Application records belong to their environment workspaces."
  value = {
    domain = bunnynet_dns_zone.app.domain
    nameservers = [
      bunnynet_dns_zone.app.nameserver1,
      bunnynet_dns_zone.app.nameserver2,
    ]
  }
}
