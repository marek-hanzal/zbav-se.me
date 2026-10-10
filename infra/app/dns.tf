# Bootstrap owns the shared zone; each workspace owns only its own records.
data "bunnynet_dns_zone" "app" {
  domain = local.config.domain
}

data "vercel_domain_config" "app" {
  domain             = local.domain
  project_id_or_name = vercel_project.app.id
}

resource "bunnynet_dns_record" "app" {
  zone = data.bunnynet_dns_zone.app.id
  name = local.dns.app
  type = "CNAME"
  # Bunny automatically flattens the production apex CNAME into A/AAAA answers.
  value       = trimsuffix(data.vercel_domain_config.app.recommended_cname, ".")
  accelerated = false
}

resource "bunnynet_dns_record" "cdn" {
  for_each = bunnynet_pullzone.app

  zone        = data.bunnynet_dns_zone.app.id
  name        = local.dns[each.key]
  type        = "CNAME"
  value       = "${each.value.name}.${each.value.cdn_domain}"
  accelerated = false
}

resource "bunnynet_dns_record" "extra" {
  for_each = local.dns.records

  zone        = data.bunnynet_dns_zone.app.id
  name        = each.value.name
  type        = each.value.type
  value       = each.value.value
  ttl         = try(each.value.ttl, 300)
  priority    = try(each.value.priority, null)
  accelerated = false
}
