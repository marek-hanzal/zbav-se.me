resource "bunnynet_storage_zone" "app" {
  for_each = toset(["assets", "content"])

  name                = "${local.name}-${each.key}"
  region              = upper(local.config.bunny)
  replication_regions = []
  zone_tier           = "Standard"
  type                = "S3"

  lifecycle {
    prevent_destroy = true
  }
}

resource "bunnynet_pullzone" "app" {
  for_each = bunnynet_storage_zone.app

  name         = each.value.name
  cors_enabled = true
  cors_extensions = [
    "css", "js", "json", "woff", "woff2", "ttf", "svg", "png", "webp", "avif", "jpg", "jpeg", "ico",
  ]

  origin {
    type        = "StorageZone"
    storagezone = each.value.id
  }

  routing {
    tier  = "Standard"
    zones = ["EU"]
  }
}

resource "bunnynet_pullzone_hostname" "app" {
  for_each = bunnynet_pullzone.app

  depends_on = [bunnynet_dns_record.cdn]

  pullzone    = each.value.id
  name        = local.hosts[each.key]
  tls_enabled = true
  force_ssl   = true
}

output "cdn" {
  description = "Managed Bunny CNAME records for this workspace."
  value = {
    for key, zone in bunnynet_pullzone.app : key => {
      name  = local.hosts[key]
      type  = "CNAME"
      value = "${zone.name}.${zone.cdn_domain}"
    }
  }
}
