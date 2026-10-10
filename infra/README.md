# Infrastructure

All Terraform operations use one remote S3 backend. There is no local state,
backend mode switch, or state migration command. The bootstrap manages one private
Bunny S3 zone for Terraform state and the shared DNS zone. SOPS + age encrypt
provider credentials and environment-specific application values in Git.
Application infrastructure and local deployments live in `app/`.

Commands and their Bash helpers live in `../Argcfile.sh`. Each public command
contains its concrete operation; helpers share preparation and backend checks.
Bash orchestrates the steps, jq parses the one-time import, and Bunny CLI creates
the zone and returns its credentials. Subsequent Terraform commands use native `sops exec-env` to
load encrypted values directly into their process environment. There are no
bootstrap scripts in `cli/` or embedded JavaScript/TypeScript programs.

## Application workspaces

`app/` is one Terraform configuration used by three workspaces. Each workspace
represents separate real cloud infrastructure, including development; none of
these names refers to local Docker services.

| Workspace | Domain | Resource name prefix |
| --- | --- | --- |
| `dev` | `dev.zbav-se.me` | `zbav-se-me-dev` |
| `uat` | `uat.zbav-se.me` | `zbav-se-me-uat` |
| `prod` | `zbav-se.me` (apex) | `zbav-se-me-prod` |

The public configuration lives in `app.json`; Terraform and the release build
read the same root domain, DNS names, resource prefix, team, and regions. Defaults
use Frankfurt for Bunny, Neon, and Vercel. Each workspace owns two private S3 storage zones
(`assets` and `content`), their Bunny pull zones, one Neon PostgreSQL 17 project,
and one Vercel project. Database and storage resources use `prevent_destroy`.

Bunny storage stays in the configured primary region (`DE` / Frankfurt) without
additional replication regions. Both pull zones enable only the European CDN
routing zone (`EU`). CDN routing zones control delivery locations separately
from storage replication.

The pull zones read directly from their linked storage zones (`origin.type =
"StorageZone"` in `app/storage.tf`); there is no application domain used as an
origin. Each `dns.<workspace>` entry in `app.json` explicitly names the `app`,
`assets`, and `content` records relative to the shared `domain`. For example,
`dev` uses `dev`, `cdn.dev`, and `content.dev`; production uses an empty app name
for the apex, plus `cdn` and `content`. Terraform passes these names directly to
Bunny DNS. The release build and runtime expand them into full hostnames:

| Workspace | App assets (`VITE_APP_ASSETS`) | Uploaded content (`VITE_CONTENT_CDN`) |
| --- | --- | --- |
| `dev` | `https://cdn.dev.zbav-se.me/` | `https://content.dev.zbav-se.me` |
| `uat` | `https://cdn.uat.zbav-se.me/` | `https://content.uat.zbav-se.me` |
| `prod` | `https://cdn.zbav-se.me/` | `https://content.zbav-se.me` |

The mapping derives from `terraform.workspace`.
Application plans reject `default` and unknown workspaces. The shared state-zone
bootstrap stays in `bootstrap/` with workspace `default`. It owns the state zone
and root DNS zone once; application workspaces own their environment's DNS records.

After completing the bootstrap below, initialize each workspace once:

```bash
argc infra-init dev
argc infra-init uat
argc infra-init prod
```

Each init connects to S3 and creates/selects the named workspace. Then always
name the target environment in the operation:

```bash
argc release dev
argc infra-plan dev
argc infra-apply dev
```

Commands pin the workspace for every operation, independently of the last
selection or an inherited `TF_WORKSPACE`. `plan` and `apply` do not create missing
workspaces; initialize them explicitly first. No additional flags or saved plans
are accepted, and `apply` asks for confirmation. Prepare credentials as described
below before planning; substitute `uat` or `prod` for the other environments.

## Shared DNS and registrar cutover

Bootstrap creates one Bunny DNS zone for `domain` (`zbav-se.me`). If the
state backend is already bootstrapped, run:

```bash
argc infra-bootstrap-plan
argc infra-bootstrap-apply
```

Expect one new `bunnynet_dns_zone.app` resource, without recreating the state
storage zone. The `dns` output reports the domain and assigned nameservers.
At Webglobe, replace the domain's existing nameservers with that pair (Bunny's
default pair is `kiki.bunny.net` and `coco.bunny.net`). Domain registration stays
at Webglobe; Terraform manages DNS at Bunny after delegation.

Verify the delegation before the first application apply:

```bash
mise exec -- bunny dns zones nameservers zbav-se.me
dig +short NS zbav-se.me
```

Wait until the authoritative nameservers point to Bunny. This setup intentionally
starts with an empty zone and does not import old DNS records. Environment
records appear when that workspace is applied; the Google and Resend records
therefore appear with the first `prod` apply.

Additional records live in `app.json` under each environment's `records` map,
such as `dns.prod.records`. Each entry requires `name`, `type`, and `value`;
`ttl` (default 300) and `priority` are optional. All names are relative to the
shared root zone, exactly as Bunny receives them. An empty name targets the
apex. For example, `resend._domainkey` creates
`resend._domainkey.zbav-se.me`; use `resend._domainkey.dev` explicitly for
`resend._domainkey.dev.zbav-se.me` in the `dev` records map. The workspace
determines which records Terraform owns; it does not rewrite their names.

Production includes the supplied Google verification TXT and Resend DKIM TXT.
Both are public DNS values and belong in this configuration. API keys and private
keys belong in SOPS. No SPF or MX records are inferred from the DKIM key.

## Application credentials

After bootstrap, add `NEON_API_KEY` and `VERCEL_API_TOKEN` to the shared encrypted
file with `argc infra-secrets-edit`. These authenticate the local Terraform
providers; no GitHub secrets or CLI login/profile extraction is involved.
The Vercel token must have access to the team configured in `app.json`.
Use an organization-wide Neon key that can create projects. With a personal Neon
key, add `"org": "org-..."` to `app.json`; organization keys infer the organization
automatically. Project-scoped keys cannot provision new projects. See
[Neon's project API](https://api-docs.neon.tech/reference/createproject).

Create and fill each environment's encrypted application file:

```bash
argc infra-secrets-edit dev
argc infra-secrets-edit uat
argc infra-secrets-edit prod
```

On first use the command encrypts `secrets.example.json` and opens the result in
SOPS. Fill the empty values; remove optional integrations you do not use rather
than keeping empty entries. Auth, HMAC, cron, and migration tokens should be
distinct random values per environment. Configure real external services such
as SMTP for each cloud environment; local Docker/Mailpit addresses are not
reachable from Vercel. Commit the resulting `dev.enc.json`, `uat.enc.json`, and
`prod.enc.json`. No actual application secrets are included in the template.

Terraform generates database/S3 credentials and public URLs and supplies them
directly to Vercel. Do not copy those values into SOPS. Generated values take
precedence over manual values. `SERVER_E2E` is disabled in deployed environments.

## Local deployment

The first application initialization downloads the pinned providers and creates
the requested remote workspace. Run it once per environment after completing
provider credentials:

```bash
argc infra-init dev
argc deploy dev
```

`deploy` runs static checks and all Vitest projects, builds the application and
migrator, then opens Terraform's interactive plan/apply confirmation. Tests use
disposable PostgreSQL and local Docker S3 fixtures; no Bunny storage credentials
are needed for tests. External service tests use the environment's configured
integrations. Playwright remains a separate `argc e2e` check.
The command never runs an unattended apply.

To review the release plan separately:

```bash
argc release dev
argc infra-plan dev
argc infra-apply dev
```

`release` only builds local artifacts. `infra-plan`/`infra-apply` require those
artifacts for the selected environment; they do not rebuild them. Release builds
disable local dotenv loading and use the explicit public configuration in
`app.json`. Outputs are isolated in `.release/<workspace>`; the Vite/Nitro build
directories are still shared with ordinary builds and E2E, so do not overlap them.
Rebuild when changing the source, dependencies, public config, or build settings.
Terraform rejects a release built for another environment or old public config.

Terraform performs these dependency-ordered operations:

1. Prepare the Bunny zones/CDN, environment DNS records and HTTPS hostnames,
   Neon project, Vercel project/domain, and environment values.
2. Run the built migration program against that workspace's **direct** Neon
   endpoint. The server uses the pooled endpoint separately.
3. Upload static assets through native `bunnynet_storage_file` resources.
4. Deploy the prebuilt Vercel output and assign the project's production domain.

`terraform_data.migration` runs `node migration/migrate.mjs` locally. It reuses
`database.migrateFn()`: Better Auth migrations, Kysely migrations, translations,
and reference-data imports. Kysely owns schema migration history in PostgreSQL.
Terraform tracks the release fingerprint and target project/branch/endpoint;
changes to application values also rerun the migration/import check. The
fingerprint includes application, migration, and static asset contents, without
timestamps. Unchanged artifacts/configuration produce no repeated deployment.

A failed migration fails `apply` and blocks the dependent asset upload and Vercel
deployment. Retry replaces only the migration marker, never the database.
Previously created infrastructure and committed migrations remain: Terraform
does not roll them back. Use backwards-compatible migrations while the previous
application deployment is serving traffic. Rolling back an app does not roll
back database changes.

Each workspace uses a separate Vercel project and that project's `production`
target, including `dev` and `uat`. Projects have no Git repository integration;
GitHub Actions workflows are removed. Validation and deployment run locally
through `argc`.
Each built static file is a `bunnynet_storage_file` instance. The Bunny provider
detects content changes and uploads files directly; assets removed from the build
are removed from storage. Deployment waits for the current assets before
activating the new Vercel release. Older Vercel deployments and open browser tabs
are not guaranteed to retain their assets after a later deployment; rolling back
requires rebuilding and applying the chosen release. Normal deployments use
`deploy` or the release/plan/apply sequence above.

Terraform creates three routing records per workspace: the application domain
and its two CDN hostnames. The app CNAME uses Vercel's recommended target from
`vercel_domain_config`, rather than a fixed IP. Bunny automatically flattens the
production apex CNAME into A/AAAA answers. The domain binding uses Vercel's native
`wait_for_ready` check and blocks deployment until DNS and verification succeed.
If Vercel requests an additional ownership TXT, add its exact value to that
workspace's `dns` configuration and apply again. The `domain` output reports
verification and DNS status.

Bunny custom hostnames use `tls_enabled = true` and `force_ssl = true`; Bunny
issues and renews their certificates. Their CNAME resources are created first.
If hostname creation fails while the new DNS records are still propagating,
wait for resolution and retry `infra-apply` with the same release. Registrar
delegation must already point to Bunny before this first application apply.

The `cdn` output reports the managed records for the selected workspace.
The private S3 upload endpoint remains the storage zone's regional endpoint;
custom CDN hostnames are used for public delivery only. Rebuild any release
previously built with `b-cdn.net` URLs before planning/applying.

## First bootstrap

Run these commands **from the repository root**, one at a time:

```bash
mise trust
mise install

# Skip login if `bunny whoami` already works.
mise exec -- bunny login --no-install-skill

# One-time prerequisite: creates a private S3 zone via Bunny CLI, without CDN.
argc infra-bootstrap-create

# Paste your Bunny account API key at the hidden prompt; storage credentials come from Bunny CLI.
argc infra-secrets-init

# Initialize Terraform directly against that S3 zone.
argc infra-bootstrap-init

# Review the state-zone import and creation of the shared DNS zone.
argc infra-bootstrap-plan

# Enter "yes" to import the state zone, create DNS, and save remote state.
argc infra-bootstrap-apply

# Verify the next plan has no changes.
argc infra-bootstrap-plan
```

Without an activated mise shell, prefix `argc` with `mise exec --`.
Application `npm ci` and dotenv files are not needed for this bootstrap.
Bootstrap commands and `infra-secrets-init` accept no arguments. Application
deployment commands require exactly one workspace (`dev`, `uat`, or `prod`).
`infra-secrets-edit` accepts an optional workspace. `apply` always displays its plan
and asks for confirmation; `create` performs its documented creation immediately.

The zone must exist before Terraform can initialize its S3 backend. This is the
single bootstrap exception to creating infrastructure through Terraform:
`create` uses the authenticated Bunny CLI, and a declarative Terraform `import`
block takes over the resulting zone on the first apply. Future plans skip an
already completed import. Repeating `create` reuses an existing zone; it does not
create duplicates. A missing zone with existing backend metadata requires
recovery instead of silently recreating an empty backend.

Expect the state zone `zbav-se-me-terraform`, Frankfurt (DE), Standard tier,
S3 enabled, with no pull zone. The first Terraform plan should import one
`bunnynet_storage_zone.state` resource and create one `bunnynet_dns_zone.app`
resource. Review any unexpected updates before applying. Both resources have
`prevent_destroy = true`; the task surface does not expose destroy. Complete the
registrar cutover above before applying application infrastructure.

## Fresh checkout / another machine

Once the first apply has completed:

```bash
mise trust
mise install
npm ci
# Restore the age identity from your private backup before running these tasks.
argc infra-bootstrap-init
argc infra-bootstrap-plan
argc infra-init dev
argc release dev
argc infra-plan dev
```

The checkout connects to the same remote state. The bootstrap plan should report
no changes; review application changes against the newly built release before
applying. Commit `.sops.yaml`, `infra/secrets.enc.json`, and the environment's
encrypted application file. A fresh checkout needs those files and the private
age identity; Terraform tasks do not need Bunny login, profile parsing, or
credential lookup through Bunny CLI.

## Configuration and credentials

Tool versions are pinned in `../mise.toml`: Terraform 1.16.5, Bunny CLI 0.19.0,
SOPS 3.13.3, age 1.3.2, and jq 1.8.2. The bootstrap pins `BunnyWay/bunnynet` 0.19.1.
Commit `.terraform.lock.hcl`; generated backend metadata, state, and plans stay
out of Git.

The public zone name and region live in
[`backend.json`](./backend.json). Store the region code in lowercase; Bunny CLI and
the Terraform resource receive its uppercase form, while S3 uses lowercase.
Commands check that required configuration values are present and look up the
existing Bunny zone by name.
Change them only before bootstrap; later changes require deliberate backend/state
migration. The bootstrap state is stored at
`s3://zbav-se-me-terraform/bootstrap/terraform.tfstate` in workspace `default`.
State object keys and the workspace prefix are fixed conventions in `Argcfile.sh`.
The application backend uses `key = "app/terraform.tfstate"` and
`workspace_key_prefix = "workspaces"`. Terraform's S3 backend therefore stores
the three application states at:

```text
workspaces/dev/app/terraform.tfstate
workspaces/uat/app/terraform.tfstate
workspaces/prod/app/terraform.tfstate
```

All four states share one private bucket and credentials, with independent
resource ownership. Application workspaces must not manage the state storage
zone or shared root DNS zone.
Workspaces separate state and resource instances; they do not create separate
account permissions for each environment.

The one-time import prompts for the Bunny account API key without echoing it.
Retrieve it yourself before running the command. An existing Bunny CLI login
normally stores it in `${XDG_CONFIG_HOME:-$HOME/.config}/bunnynet.json`, under
`profiles.default.api_key` (or your named profile). The task does not read this
file. The supplied key authenticates Bunny CLI while it fetches the state zone's
S3 credentials; Terraform operations subsequently load all credentials from SOPS.

`infra-secrets-init` creates the age identity at
`${XDG_CONFIG_HOME:-$HOME/.config}/sops/age/zbav-se.me.agekey`, unless
`SOPS_AGE_KEY_FILE` points to an existing identity. It writes the public recipient
rules to `.sops.yaml` and encrypts `BUNNYNET_API_KEY`, `AWS_ACCESS_KEY_ID`,
`AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, and `TF_VAR_state_zone_id` in
`infra/secrets.enc.json`. Existing keys and encrypted files are never overwritten.
The import uses streams and an encrypted temporary file; plaintext credentials
never appear in command arguments, console output, or dotenv files.
It checks that the S3 password is present and maps Bunny CLI fields to the native
environment variables used by Terraform and S3.

Keep the private identity outside the repository and back it up privately. Anyone
with that identity and the encrypted file can read the credentials; losing the
identity prevents decryption. `.agekey` files are ignored as an additional guard.
Do not generate a replacement identity in a fresh checkout; restore the existing
one at the same path, or set `SOPS_AGE_KEY_FILE` to its restored location.

Terraform tasks load the encrypted file through `sops exec-env`; the provider and
S3 backend receive their native environment variables. Tasks disable inherited
Terraform debug logging and injected CLI arguments and isolate AWS configuration
and session credentials.
The generated `.backend.s3.tfbackend` in each root contains no credentials. Local Terraform
metadata uses private permissions (`umask 077`) and is ignored.

Use `argc infra-secrets-edit [dev|uat|prod]` to update values with SOPS, using
`SOPS_EDITOR` or `EDITOR`. Omit the workspace for shared provider credentials.
SOPS temporarily decrypts the file for the editor and re-encrypts saved
changes. When rotating the Bunny account key or zone password, update the
corresponding encrypted value before the next Terraform operation.

The accepted operating constraint is **one Terraform operation at a time**.
`use_lockfile = true` catches existing locks, but our live concurrency probe
showed Bunny conditional writes are not atomic; this is not a reliable
distributed lock.

Treat state access as secret access: the provider stores generated zone
passwords and application environment values in state even when marked sensitive.
SOPS encryption of credentials
does not encrypt Terraform state. Bunny S3 currently lacks object
versioning and S3 SSE/SSE-C; the backend does not enable those flags. Keep recovery
snapshots outside Git and protect the Bunny account and CLI profile.

## References

- [SOPS: passing secrets to other processes](https://getsops.io/docs/usage/advanced/#passing-secrets-to-other-processes)
- [Bunny CLI storage credentials](https://github.com/BunnyWay/cli/blob/v0.19.0/packages/cli/src/commands/storage/zone/credentials.ts)
- [Bunny S3 compatibility and limitations](https://bunny.net/docs/storage/s3)
- [Bunny storage zone resource](https://github.com/BunnyWay/terraform-provider-bunnynet/blob/v0.19.1/docs/resources/storage_zone.md)
- [Bunny DNS quickstart and nameservers](https://bunny.net/docs/dns/quickstart)
- [Bunny DNS records and apex CNAME flattening](https://bunny.net/docs/dns/records)
- [Bunny DNS zone resource](https://github.com/BunnyWay/terraform-provider-bunnynet/blob/v0.19.1/docs/resources/dns_zone.md)
- [Bunny DNS record resource](https://github.com/BunnyWay/terraform-provider-bunnynet/blob/v0.19.1/docs/resources/dns_record.md)
- [Vercel domain configuration](https://github.com/vercel/terraform-provider-vercel/blob/v5.21.1/docs/data-sources/domain_config.md)
- [Terraform S3 backend](https://developer.hashicorp.com/terraform/language/backend/s3)
- [Terraform import blocks](https://developer.hashicorp.com/terraform/language/import)
