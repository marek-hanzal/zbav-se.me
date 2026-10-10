data "vercel_prebuilt_project" "app" {
  path = local.path
}

locals {
  manifest = try(jsondecode(file("${local.path}/release.json")), null)
  release = sha256(jsonencode({
    app = data.vercel_prebuilt_project.app.output
    migration = {
      for file in fileset("${local.path}/migration", "**") : file => filesha256("${local.path}/migration/${file}")
    }
    assets = {
      for file in fileset("${local.path}/assets", "**") : file => filesha256("${local.path}/assets/${file}")
    }
  }))
}

# Keep the provisioner off the database resource: retrying a failed migration
# replaces only this marker, never the database. Kysely owns migration history.
resource "terraform_data" "migration" {
  depends_on = [
    bunnynet_pullzone_hostname.app,
    vercel_project_environment_variables.app,
    vercel_project_domain.app,
  ]

  triggers_replace = {
    release  = local.release
    project  = neon_project.app.id
    branch   = neon_project.app.default_branch_id
    endpoint = neon_project.app.default_endpoint_id
    secrets  = sha256(jsonencode(var.secrets))
  }

  lifecycle {
    precondition {
      condition     = try(local.manifest.environment == terraform.workspace && local.manifest.public == local.public, false)
      error_message = "Missing or stale release for this workspace. Run argc release <workspace> before planning/applying."
    }
    precondition {
      condition     = fileexists("${local.path}/migration/migrate.mjs")
      error_message = "Migration bundle missing. Run argc release <workspace>."
    }
  }

  provisioner "local-exec" {
    working_dir = local.path
    command     = "node migration/migrate.mjs"
    environment = merge(var.secrets, local.public, {
      # DDL and migration locks use the direct endpoint, not the transaction pooler.
      SERVER_DATABASE_URL = neon_project.app.connection_uri
      SERVER_E2E          = ""
    })
    quiet = true
  }
}

resource "bunnynet_storage_file" "assets" {
  for_each = fileset("${local.path}/assets", "**")

  zone   = bunnynet_storage_zone.app["assets"].id
  path   = each.value
  source = "${local.path}/assets/${each.value}"

  depends_on = [terraform_data.migration]
}

resource "vercel_deployment" "app" {
  project_id  = vercel_project.app.id
  files       = data.vercel_prebuilt_project.app.output
  path_prefix = data.vercel_prebuilt_project.app.path
  production  = true
  environment = local.runtime
  meta = {
    release = local.release
  }

  depends_on = [
    bunnynet_storage_file.assets,
    vercel_project_environment_variables.app,
    vercel_project_domain.app,
    bunnynet_pullzone_hostname.app,
  ]

  lifecycle {
    create_before_destroy = true
    replace_triggered_by  = [terraform_data.migration, bunnynet_storage_file.assets]
  }
}

output "deployment" {
  value = {
    id  = vercel_deployment.app.id
    url = "https://${vercel_deployment.app.url}"
  }
}
