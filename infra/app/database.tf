resource "neon_project" "app" {
  name                      = local.name
  region_id                 = local.config.neon
  pg_version                = 17
  org_id                    = local.config.org
  history_retention_seconds = local.config.history

  branch {
    name          = terraform.workspace
    database_name = "app"
    role_name     = "app"
  }

  primary_compute {
    autoscaling_limit_min_cu = 0.25
    autoscaling_limit_max_cu = 1
  }

  lifecycle {
    prevent_destroy = true
  }
}
