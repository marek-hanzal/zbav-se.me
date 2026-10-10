#!/usr/bin/env bash

set -euo pipefail

# @describe Project tasks for humans and agents
#
# Use argc help <command> or argc <command> --help to inspect requirements and side effects.
# check inspects sources; fix changes them; verify also runs tests and builds.
# Install dependencies with npm ci or npm install. Tool versions belong in mise.toml.
# See README.md for the command contract and isolated E2E setup.
# @meta binname argc

# Re-enter through mise once, including when this file is invoked directly.
if [[ "${ZBAV_SE_ME_MISE_ACTIVE:-}" != "1" ]]; then
	if ! command -v mise >/dev/null 2>&1; then
		echo "Project commands require mise: https://mise.jdx.dev" >&2
		exit 127
	fi
	export ZBAV_SE_ME_MISE_ACTIVE=1
	exec mise exec -- bash "$0" "$@"
fi

# @cmd Start the development app
#
# Requires: local services and the HTTPS proxy. Long-running; registers a Portless route.
# Start only when requested; do not replace an already running development app.
# @arg args~ Arguments passed to Vite
dev() {
	dotenv -c development -- portless zbav-se.me vite "$@"
}

# @cmd Start the shared local HTTPS proxy
#
# Effects: starts a background proxy and may create local TLS certificates.
# Start only when requested; the proxy is shared with other local apps.
# @arg args~ Arguments passed to Portless proxy start
proxy() {
	portless proxy start --https "$@"
}

# @cmd Build the application
#
# Requires: configured app environment. Writes build outputs and may regenerate src/_route.ts.
# Shares output directories with the E2E server; do not overlap those builds.
# @arg args~ Arguments passed to Vite build
build() {
	dotenv -c development -- vite build "$@"
}

# @cmd Run all static checks without fixing source files
#
# Checks manifest ordering, types, style, domain boundaries, and dependency usage in order.
# Requires: installed dependencies and mise tools.
# Stops at the first failure. Does not run tests or build the application.
check() {
	_require_no_args check "$@"
	_run syncpack format --check
	_run check-types
	_run check-style
	_run check-boundaries
	_run check-deps
}

# @cmd Check TypeScript types
#
# Effects: no emitted application code or source fixes; may update the compiler cache.
# @arg args~ Arguments passed to tsc --noEmit
check-types() {
	tsc --noEmit "$@"
}

# @cmd Check formatting, lint, and imports without applying fixes
#
# Uses Biome's CI mode. With no paths, checks the whole project.
# Uses concise diagnostics; --reporter=default includes source excerpts.
# @arg args~ Paths and options passed to Biome ci
check-style() {
	biome ci --reporter=concise "$@"
}

# @cmd Check domain dependency boundaries
#
# Requires: mise install. Does not fix source files or install tools during checks.
# Dependency Cruiser needs its own TypeScript 6 compiler API, separate from app TypeScript.
# @arg args~ Arguments passed to Dependency Cruiser
check-boundaries() {
	depcruise src --output-type err-long "$@"
}

# @cmd Check unused dependencies
#
# Knip reports candidates for review. This command does not automatically remove dependencies.
# @arg args~ Arguments passed to Knip
check-deps() {
	knip --include dependencies --no-config-hints "$@"
}

# @cmd Normalize the manifest and apply safe formatting and lint fixes
#
# Effects: always normalizes package.json ordering, then applies Biome fixes.
# With no paths, fixes the whole project. Review the diff; unsafe fixes are not enabled by default.
# @arg args~ Paths and options passed to Biome check --write
fix() {
	syncpack format
	biome check --write "$@"
}

# @cmd Run Vitest tests
#
# Database integration tests require Docker; unit and external projects do not.
# Each integration run gets its own container and free port. Coverage outputs are shared.
# @arg args~ Test paths and options passed to Vitest run
test() {
	dotenv -c development -- vitest run "$@"
}

# @cmd Run Playwright tests; supports --ui and --headed
#
# Requires: Docker, Chromium, Mailpit, and an available app origin (HTTPS proxy by default).
# Builds and starts a compiled test server; uses a unique PostgreSQL container and free port.
# Writes build outputs and test artifacts. See README.md to isolate it from a running dev app.
# @arg args~ Test paths and options passed to Playwright test
e2e() {
	dotenv -c development -- tsx ./cli/e2e.ts "$@"
}

# @cmd Install Chromium and its system dependencies
#
# Requires: network access; system package installation may need elevated privileges on Linux.
# Effects: downloads browsers and may install operating system packages.
# @arg args~ Arguments passed to Playwright install
e2e-install() {
	playwright install --with-deps chromium "$@"
}

# @cmd Run static checks, Vitest, Playwright, and build in order
#
# Requires: all check, test, e2e, and build prerequisites. Stops at the first failure.
# Writes test/build artifacts and may regenerate src/_route.ts; does not run fix or update dependencies.
# Suites and builds run sequentially to avoid sharing output directories concurrently.
verify() {
	_require_no_args verify "$@"
	_run check
	_run test
	_run e2e
	_run build
}

# @cmd Update dependency versions and the npm lockfile
#
# Requires: npm registry access. Syncpack updates all dependency versions, including major versions.
# Effects: writes package.json, package-lock.json, and node_modules; npm lifecycle scripts may run.
# Review the diff and run verify afterwards. Does not automatically fix sources or run checks.
deps-update() {
	_require_no_args deps-update "$@"
	syncpack update
	syncpack format
	npm install
}

# @cmd Open the interactive database seed CLI
#
# Requires: configured database access. Selected operations may reset or change application data.
# Run only for an explicitly requested seed operation against the intended database.
# @arg args~ Arguments passed to the seed CLI
seed() {
	dotenv -c development -- tsx ./cli/seed.ts "$@"
}

# @cmd Generate translation data from source code
#
# Effects: rewrites generated locale files in src/database-migration/data.
# Preserves existing translations and dynamic keys; removes obsolete static keys.
# @arg args~ Arguments passed to the translation CLI
translations() {
	dotenv -c development -- tsx ./cli/translations.ts "$@"
}

# @cmd Legacy: synchronize remote GitHub and Vercel environment values
#
# Requires: authenticated GitHub CLI, Vercel credentials, and local @env/<environment>.json.
# Effects: replaces remote variables and secrets. Never run as part of local verification.
# Retained until Terraform replaces this workflow.
# @arg environment! Environment name
# @arg project! Vercel project ID
env-sync() {
	tsx ./cli/env-sync.ts "$@"
}

# @cmd Create the private Bunny S3 zone used for Terraform state
#
# Requires: mise install and bunny login. See infra/README.md.
# One-time prerequisite: creates the zone through Bunny CLI, without a CDN.
# Safe to repeat when the zone already exists. Accepts no arguments.
infra-bootstrap-create() (
	_require_no_args infra-bootstrap-create "$@"
	local _infra_dir _infra_bucket _infra_region _infra_key zone_id
	_infra_bootstrap_prepare
	zone_id="$(_infra_state_zone_id)"
	if [[ -n "$zone_id" ]]; then
		printf 'State zone already exists: %s (ID %s)\n' "$_infra_bucket" "$zone_id"
		return
	fi
	if [[ -e "$_infra_dir/.terraform/terraform.tfstate" ]]; then
		echo 'An initialized backend exists but its zone is missing. Recover the existing backend before proceeding.' >&2
		return 1
	fi
	printf 'Creating private S3 state zone: %s (%s)\n' "$_infra_bucket" "$_infra_region"
	# JSON output can contain generated credentials; do not print or save it.
	bunny storage zones create "$_infra_bucket" --region "$(printf '%s' "$_infra_region" | tr '[:lower:]' '[:upper:]')" --tier hdd \
		--s3 --no-pull-zone --no-link --force --profile "${BUNNYNET_PROFILE:-default}" --output json >/dev/null
)

# @cmd Encrypt a Bunny API key and import state storage credentials
#
# Requires: infra-bootstrap-create and a Bunny account API key. Prompts without echoing the key.
# No cloud resources are changed; storage credentials are fetched through Bunny CLI.
# Creates an age identity outside the repo when needed, .sops.yaml, and infra/secrets.enc.json.
# Imports credentials once; refuses to overwrite an existing encrypted file. Accepts no arguments.
infra-secrets-init() (
	_require_no_args infra-secrets-init "$@"
	set +x
	umask 077
	local _infra_bucket _infra_region zone_id recipients encrypted
	if [[ -e infra/secrets.enc.json ]]; then
		echo 'Infrastructure secrets already exist. Use argc infra-secrets-edit to update them.' >&2
		return 1
	fi
	if [[ -n "${SOPS_AGE_KEY_FILE:-}" && ! -f "$SOPS_AGE_KEY_FILE" ]]; then
		echo 'SOPS_AGE_KEY_FILE must point to an existing age identity. Keep it outside the repository.' >&2
		return 1
	fi
	_infra_state_config
	_infra_environment
	read -rs -p 'Bunny API key: ' BUNNYNET_API_KEY
	printf '\n'
	: "${BUNNYNET_API_KEY:?Bunny API key is required}"
	export BUNNYNET_API_KEY
	zone_id="$(_infra_state_zone_id)"
	if [[ -z "$zone_id" ]]; then
		echo 'State zone missing. Run argc infra-bootstrap-create first.' >&2
		return 1
	fi
	_infra_sops_identity
	if [[ ! -f "$SOPS_AGE_KEY_FILE" ]]; then
		if [[ -e .sops.yaml ]]; then
			echo 'Restore the existing age identity before initializing secrets in this checkout.' >&2
			return 1
		fi
		mkdir -p "$(dirname "$SOPS_AGE_KEY_FILE")"
		age-keygen -o "$SOPS_AGE_KEY_FILE"
	fi
	if [[ ! -e .sops.yaml ]]; then
		recipients="$(age-keygen -y "$SOPS_AGE_KEY_FILE" | jq -Rsc 'split("\n") | map(select(length > 0))')"
		printf 'creation_rules:\n  - path_regex: ^infra/.*\\.enc\\.json$\n    age: %s\n' "$recipients" >.sops.yaml
	fi
	encrypted="$(mktemp infra/.secrets.enc.XXXXXX)"
	trap "$(printf 'rm -f -- %q' "$encrypted")" EXIT
	# Secrets flow through stdin and process environments, never command arguments or plaintext files.
	bunny storage zones credentials "$zone_id" \
		--connection s3 --show-secret --no-save-env --profile "${BUNNYNET_PROFILE:-default}" --output json |
		jq -e --arg id "$zone_id" '
			select(.secretAccessKey != null and .secretAccessKey != "") |
			{
				BUNNYNET_API_KEY: env.BUNNYNET_API_KEY,
				AWS_ACCESS_KEY_ID: .accessKeyId,
				AWS_SECRET_ACCESS_KEY: .secretAccessKey,
				AWS_REGION: .region,
				TF_VAR_state_zone_id: $id
			}
		' | sops encrypt --filename-override infra/secrets.enc.json >"$encrypted"
	# Confirm this identity can decrypt before publishing the encrypted file.
	sops decrypt --input-type json --output-type json "$encrypted" >/dev/null
	mv "$encrypted" infra/secrets.enc.json
	printf 'Encrypted infrastructure credentials: infra/secrets.enc.json\nAge identity: %s\n' "$SOPS_AGE_KEY_FILE"
)

# @cmd Edit shared or environment credentials with SOPS
#
# Requires: the project's age identity. Uses SOPS_EDITOR or EDITOR.
# With an environment, initializes its encrypted file from the template if missing.
# SOPS manages a temporary plaintext editor file and re-encrypts saved changes.
# @arg environment Terraform workspace: dev, uat, or prod; omit for shared provider credentials
infra-secrets-edit() (
	set +x
	umask 077
	local environment encrypted file=infra/secrets.enc.json
	if [[ "$#" -gt 0 ]]; then
		_infra_target infra-secrets-edit "$@"
		file="infra/$environment.enc.json"
	fi
	_infra_sops_identity
	if [[ ! -f "$file" && -n "${environment:-}" ]]; then
		encrypted="$(mktemp infra/.secrets.enc.XXXXXX)"
		trap "$(printf 'rm -f -- %q' "$encrypted")" EXIT
		sops encrypt --filename-override "$file" infra/secrets.example.json >"$encrypted"
		mv "$encrypted" "$file"
	fi
	sops edit "$file"
)

# @cmd Initialize the remote Terraform bootstrap backend
#
# Requires: infra-secrets-init and the project's age identity. Always uses Bunny S3.
# Writes local Terraform metadata and downloads the pinned provider.
# Accepts no arguments; there is no local backend or migration step.
infra-bootstrap-init() (
	_require_no_args infra-bootstrap-init "$@"
	local _infra_dir _infra_bucket _infra_region _infra_key
	_infra_bootstrap_prepare
	_infra_secrets_environment
	_infra_backend_config >"$_infra_dir/.backend.s3.tfbackend"
	sops exec-env infra/secrets.enc.json 'terraform -chdir=infra/bootstrap init -backend-config=.backend.s3.tfbackend'
)

# @cmd Preview shared Terraform state storage and DNS infrastructure
#
# Requires: infra-bootstrap-init. First plan imports the state zone and creates the shared DNS zone.
# Does not save a plan file or create resources. Accepts no arguments.
infra-bootstrap-plan() (
	_require_no_args infra-bootstrap-plan "$@"
	local _infra_dir _infra_bucket _infra_region _infra_key
	_infra_bootstrap_prepare
	_infra_secrets_environment
	_infra_bootstrap_require_backend
	sops exec-env infra/secrets.enc.json 'terraform -chdir=infra/bootstrap plan'
)

# @cmd Apply shared Terraform state storage and DNS infrastructure after review
#
# Requires: infra-bootstrap-init. Terraform displays its plan and asks for confirmation.
# First apply imports the state zone and creates the shared DNS zone. Accepts no arguments.
infra-bootstrap-apply() (
	_require_no_args infra-bootstrap-apply "$@"
	local _infra_dir _infra_bucket _infra_region _infra_key
	_infra_bootstrap_prepare
	_infra_secrets_environment
	_infra_bootstrap_require_backend
	sops exec-env infra/secrets.enc.json 'terraform -chdir=infra/bootstrap apply'
)

# @cmd Initialize an application infrastructure workspace
#
# Requires: completed bootstrap, encrypted infrastructure credentials, and the age identity.
# Initializes the shared S3 backend and creates/selects the workspace; may write empty remote state.
# @arg environment! Terraform workspace: dev, uat, or prod
infra-init() (
	local _infra_dir _infra_bucket _infra_region _infra_key environment
	_infra_app_prepare infra-init "$@"
	{
		_infra_backend_config
		printf 'workspace_key_prefix = "workspaces"\n'
	} >"$_infra_dir/.backend.s3.tfbackend"
	# Init must use an existing workspace before selecting/creating the requested one.
	sops exec-env infra/secrets.enc.json "TF_WORKSPACE=default terraform -chdir=infra/app init -backend-config=.backend.s3.tfbackend && terraform -chdir=infra/app workspace select -or-create $environment"
)

# @cmd Preview application infrastructure in one workspace
#
# Requires: infra-init for this environment. Does not save a plan file or apply changes.
# @arg environment! Terraform workspace: dev, uat, or prod
infra-plan() (
	local _infra_dir _infra_bucket _infra_region _infra_key environment
	_infra_app_prepare infra-plan "$@"
	_infra_app_require_backend
	_infra_app_secrets
	# Select without creating, then pin the workspace for the operation.
	sops exec-env infra/secrets.enc.json "terraform -chdir=infra/app workspace select $environment && TF_WORKSPACE=$environment terraform -chdir=infra/app plan"
)

# @cmd Apply application infrastructure in one workspace after interactive review
#
# Requires: infra-init for this environment. Terraform displays its plan and asks for confirmation.
# @arg environment! Terraform workspace: dev, uat, or prod
infra-apply() (
	local _infra_dir _infra_bucket _infra_region _infra_key environment
	_infra_app_prepare infra-apply "$@"
	_infra_app_require_backend
	_infra_app_secrets
	# Select without creating, then pin the workspace for the operation.
	sops exec-env infra/secrets.enc.json "terraform -chdir=infra/app workspace select $environment && TF_WORKSPACE=$environment terraform -chdir=infra/app apply"
)

# @cmd Build an environment-specific application and migration release locally
#
# Requires: installed dependencies. Uses public settings from infra/app.json, without dotenv.
# Writes .release/<environment>, .vercel/output, and other Vite/Nitro build artifacts.
# Does not contact cloud services. Shares build directories with build and E2E.
# @arg environment! Terraform workspace: dev, uat, or prod
release() (
	local environment target
	_infra_target release "$@"
	_infra_release_environment
	target="$PWD/.release/$environment"
	mkdir -p "$target/.vercel"
	rm -f "$target/release.json"
	rm -rf "$target/.vercel/output" "$target/assets" .vercel/output
	vite build --mode production
	cp -R .vercel/output "$target/.vercel/output"
	cp -R .vercel/output/static "$target/assets"
	# Serve generated app assets from Bunny instead of Vercel.
	rm -rf "$target/.vercel/output/static/assets"
	vite build --config vite.migration.config.ts --outDir "$target/migration"
	jq -n --arg environment "$environment" \
		--arg origin "$VITE_ORIGIN" --arg assets "$VITE_APP_ASSETS" --arg content "$VITE_CONTENT_CDN" '
		{environment: $environment, public: {VITE_ORIGIN: $origin, VITE_APP_ASSETS: $assets, VITE_CONTENT_CDN: $content}}
	' >"$target/release.json"
)

# @cmd Check, test, build, and apply an environment deployment locally
#
# Requires: infra-init and completed provider/application credentials for this environment.
# Runs all Vitest projects (disposable test database), builds, then asks to apply Terraform.
# Terraform runs migrations before uploading assets and deploying the prebuilt Vercel application.
# @arg environment! Terraform workspace: dev, uat, or prod
deploy() (
	set +x
	local environment
	_infra_target deploy "$@"
	_infra_release_environment
	_infra_sops_identity
	_run check
	sops exec-env "infra/$environment.enc.json" 'vitest run'
	_run release "$environment"
	_run infra-apply "$environment"
)

# Internal helpers, deliberately absent from the public command list.

# Public infrastructure commands use subshells to isolate credentials and environment changes.
_infra_bootstrap_prepare() {
	set +x
	umask 077
	_infra_dir="$PWD/infra/bootstrap"
	_infra_state_config
	_infra_key=bootstrap/terraform.tfstate
	_infra_environment
	export TF_WORKSPACE=default
}

_infra_bootstrap_require_backend() {
	# Fail closed if someone initialized this directory with another backend.
	if ! jq -e --arg bucket "$_infra_bucket" --arg key "$_infra_key" '
		.backend.type == "s3" and .backend.config.bucket == $bucket and .backend.config.key == $key
	' "$_infra_dir/.terraform/terraform.tfstate" >/dev/null 2>&1; then
		echo 'Run argc infra-bootstrap-init to connect this checkout to its remote backend.' >&2
		return 1
	fi
}

_infra_app_prepare() {
	set +x
	umask 077
	_infra_target "$@"
	_infra_dir="$PWD/infra/app"
	_infra_state_config
	_infra_key=app/terraform.tfstate
	_infra_environment
	_infra_secrets_environment
	printf 'Terraform workspace: %s\n' "$environment"
}

_infra_target() {
	local task="$1"
	shift
	if [[ "$#" -ne 1 || ! "$1" =~ ^(dev|uat|prod)$ ]]; then
		printf 'Usage: argc %s <dev|uat|prod>\n' "$task" >&2
		return 2
	fi
	environment="$1"
}

_infra_release_environment() {
	local config domain app assets content
	config="$(jq -er --arg environment "$environment" '
		.domain as $domain | .dns[$environment] |
		[$domain, .app, .assets, .content] | join("|")
	' infra/app.json)"
	IFS='|' read -r domain app assets content <<<"$config"
	export VITE_ORIGIN="https://${app:+$app.}$domain" VITE_APP_ASSETS="https://$assets.$domain/" VITE_CONTENT_CDN="https://$content.$domain"
	export ZBAV_SE_ME_RELEASE=1 NITRO_PRESET=vercel
}

_infra_app_secrets() {
	TF_VAR_secrets="$(sops decrypt --output-type json "infra/$environment.enc.json")"
	export TF_VAR_secrets
}

_infra_app_require_backend() {
	if ! jq -e --arg bucket "$_infra_bucket" --arg key "$_infra_key" '
		.backend.type == "s3" and .backend.config.bucket == $bucket and .backend.config.key == $key and
			.backend.config.workspace_key_prefix == "workspaces"
	' "$_infra_dir/.terraform/terraform.tfstate" >/dev/null 2>&1; then
		printf 'Run argc infra-init %s to connect this checkout to the application backend.\n' "$environment" >&2
		return 1
	fi
}

_infra_secrets_environment() {
	if [[ ! -f infra/secrets.enc.json ]]; then
		echo 'Infrastructure secrets missing. Run argc infra-secrets-init first.' >&2
		return 1
	fi
	_infra_sops_identity
	unset BUNNYNET_API_KEY NEON_API_KEY VERCEL_API_TOKEN TF_VAR_state_zone_id
}

_infra_state_config() {
	local config
	config="$(jq -er '
		[.bucket, .region] |
		select(all(.[]; . != null and . != "")) | @tsv
	' infra/backend.json)"
	IFS=$'\t' read -r _infra_bucket _infra_region <<<"$config"
}

_infra_state_zone_id() {
	bunny storage zones list --profile "${BUNNYNET_PROFILE:-default}" --output json |
		jq -r --arg name "$_infra_bucket" 'first(.[] | select(.Name == $name) | .Id) // ""'
}

_infra_environment() {
	local name
	for name in ${!AWS_@} ${!TF_LOG@} ${!TF_CLI_ARGS@}; do unset "$name"; done
	unset TF_DATA_DIR TF_WORKSPACE
	export TF_INPUT=1
	export AWS_CONFIG_FILE=/dev/null AWS_SHARED_CREDENTIALS_FILE=/dev/null AWS_EC2_METADATA_DISABLED=true
}

_infra_sops_identity() {
	export SOPS_AGE_KEY_FILE="${SOPS_AGE_KEY_FILE:-${XDG_CONFIG_HOME:-$HOME/.config}/sops/age/zbav-se.me.agekey}"
}

_infra_backend_config() {
	cat <<EOF
bucket = "$_infra_bucket"
key = "$_infra_key"
region = "$_infra_region"
endpoints = { s3 = "https://$_infra_region-s3.storage.bunnycdn.com" }
use_path_style = true
use_lockfile = true
skip_credentials_validation = true
skip_region_validation = true
skip_requesting_account_id = true
skip_metadata_api_check = true
EOF
}

_run() {
	printf '\n==> %s\n' "$*"
	"$@"
}

# argc forwards arguments to parameterless Bash functions; reject them before side effects.
_require_no_args() {
	local task="$1"
	shift
	if [[ "$#" -ne 0 ]]; then
		printf 'Usage: argc %s (no arguments)\n' "$task" >&2
		return 2
	fi
}

# Capture-all arguments would otherwise send a bare --help to the underlying tool.
# Route task help through argc before executing any task, especially mutating ones.
if [[ "$#" -eq 2 && ( "$2" == "--help" || "$2" == "-h" ) ]]; then
	set -- help "$1"
fi

eval "$(argc --argc-eval "$0" "$@")"
