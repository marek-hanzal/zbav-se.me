resource "neon_project" "app" {
  name       = local.name
  region_id  = local.config.neon
  pg_version = 17
  org_id     = try(local.config.org, null)

  branch {
    name          = terraform.workspace
    database_name = "app"
    role_name     = "app"
  }

  primary_compute {
    autoscaling_limit_min_cu = 0.25
    autoscaling_limit_max_cu = 1
    suspend_timeout_seconds  = 300
  }

  lifecycle {
    prevent_destroy = true
  }
}
