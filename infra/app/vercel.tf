locals {
  runtime = merge(var.secrets, local.public, {
    SERVER_DATABASE_URL = neon_project.app.connection_uri_pooler
    SERVER_S3_API       = bunnynet_storage_zone.app["content"].hostname_s3
    SERVER_S3_BUCKET    = bunnynet_storage_zone.app["content"].name
    SERVER_S3_KEY       = bunnynet_storage_zone.app["content"].name
    SERVER_S3_SECRET    = bunnynet_storage_zone.app["content"].password
    SERVER_E2E          = ""
  })
}

resource "vercel_project" "app" {
  name         = local.name
  node_version = "24.x"
  # Each workspace owns a separate project; its live deployment targets production.
  resource_config = {
    function_default_regions = [local.config.vercel]
  }
  vercel_authentication = {
    deployment_type = "none"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "vercel_project_environment_variables" "app" {
  project_id = vercel_project.app.id
  variables = [for key, value in local.runtime : {
    key       = key
    value     = value
    sensitive = !startswith(key, "VITE_")
    target    = ["production"]
  }]
}

resource "vercel_project_domain" "app" {
  project_id     = vercel_project.app.id
  domain         = local.domain
  wait_for_ready = true

  depends_on = [bunnynet_dns_record.app, bunnynet_dns_record.extra]
}

output "domain" {
  description = "Domain binding status after Vercel validates the managed Bunny DNS records."
  value = {
    name          = vercel_project_domain.app.domain
    verified      = vercel_project_domain.app.verified
    misconfigured = vercel_project_domain.app.misconfigured
    verification  = vercel_project_domain.app.verification
  }
}
