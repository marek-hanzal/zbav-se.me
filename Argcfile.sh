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
# Requires: installed dependencies; npm registry access on the first boundary check.
# Stops at the first failure. Does not run tests or build the application.
check() {
	_require_no_args check "$@"
	_run syncpack format --check
	_run check:types
	_run check:style
	_run check:boundaries
	_run check:deps
}

# @cmd Check TypeScript types
#
# Effects: no emitted application code or source fixes; may update the compiler cache.
# @arg args~ Arguments passed to tsc --noEmit
check:types() {
	tsc --noEmit "$@"
}

# @cmd Check formatting, lint, and imports without applying fixes
#
# Uses Biome's CI mode. With no paths, checks the whole project.
# Uses concise diagnostics; --reporter=default includes source excerpts.
# @arg args~ Paths and options passed to Biome ci
check:style() {
	biome ci --reporter=concise "$@"
}

# @cmd Check domain dependency boundaries
#
# Effects: downloads pinned tools to npm's cache when missing; does not fix source files.
# Dependency Cruiser needs its own TypeScript 6 compiler API, separate from app TypeScript.
# @arg args~ Arguments passed to Dependency Cruiser
check:boundaries() {
	npm exec --yes --package=dependency-cruiser@18.5.0 --package=typescript@6.0.3 -- \
		depcruise src --output-type err-long "$@"
}

# @cmd Check unused dependencies
#
# Knip reports candidates for review. This command does not automatically remove dependencies.
# @arg args~ Arguments passed to Knip
check:deps() {
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
e2e:install() {
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
deps:update() {
	_require_no_args deps:update "$@"
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
env:sync() {
	tsx ./cli/env-sync.ts "$@"
}

# Internal helpers, deliberately absent from the public command list.
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
