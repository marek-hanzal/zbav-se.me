#!/usr/bin/env bash

set -euo pipefail

# @describe Zbav se me project commands

if [[ "${ZBAV_SE_ME_MISE_ACTIVE:-}" != "1" ]]; then
	if ! command -v mise >/dev/null 2>&1; then
		echo "Project commands require mise: https://mise.jdx.dev" >&2
		exit 127
	fi
	export ZBAV_SE_ME_MISE_ACTIVE=1
	exec mise exec -- bash "$0" "$@"
fi

# @cmd Install application dependencies
# @arg args~ Arguments passed to npm install
install() {
	npm install "$@"
}

# @cmd Install exact dependencies from package-lock.json
# @arg args~ Arguments passed to npm ci
ci() {
	npm ci "$@"
}

# @cmd Start the development app
# @arg args~ Arguments passed to Vite
dev:app() {
	dotenv -c development -- portless zbav-se.me vite "$@"
}

# @cmd Start the shared local HTTPS proxy
# @arg args~ Arguments passed to the proxy
dev:proxy() {
	portless proxy start --https "$@"
}

# @cmd Build the application
# @arg args~ Arguments passed to Vite
build() {
	dotenv -c development -- vite build "$@"
}

# @cmd Build the application for end-to-end tests
# @arg args~ Arguments passed to Vite
e2e:build() {
	dotenv -c development -- vite build --mode production "$@"
}

# @cmd Start the compiled application for end-to-end tests
# @arg args~ Arguments passed to the application
e2e:start() {
	dotenv -c development -- portless --force zbav-se.me node .output/server/index.mjs "$@"
}

# @cmd Build and start the end-to-end test server
e2e:serve() {
	e2e:build
	e2e:start
}

# @cmd Run mobile end-to-end tests
# @arg args~ Arguments passed to Playwright
e2e() {
	dotenv -c development -- playwright test --project=mobile "$@"
}

# @cmd Run end-to-end tests in a visible browser
# @arg args~ Arguments passed to Playwright
e2e:ui() {
	dotenv -c development -- playwright test --headed --project=dev "$@"
}

# @cmd Open the Playwright test UI
# @arg args~ Arguments passed to Playwright
e2e:dev() {
	dotenv -c development -- playwright test --ui --project=dev "$@"
}

# @cmd Install Chromium and its system dependencies for Playwright
# @arg args~ Arguments passed to Playwright
e2e:browsers() {
	playwright install --with-deps chromium "$@"
}

# @cmd Run the interactive seed CLI
# @arg args~ Arguments passed to the seed CLI
seed() {
	dotenv -c development -- tsx ./cli/seed.ts "$@"
}

# @cmd Generate translations
# @arg args~ Arguments passed to the translation CLI
translations() {
	dotenv -c development -- tsx ./cli/translations.ts "$@"
}

# @cmd Check domain dependency boundaries
# @arg args~ Arguments passed to Dependency Cruiser
dc() {
	npm exec --yes --package=dependency-cruiser@18.5.0 --package=typescript@6.0.3 -- \
		depcruise src --output-type err-long "$@"
}

# @cmd Check dependency usage
# @arg args~ Arguments passed to Knip
knip() {
	command knip --include dependencies --no-config-hints "$@"
}

# @cmd Check TypeScript types
# @arg args~ Arguments passed to TypeScript
typecheck() {
	tsc --noEmit "$@"
}

# @cmd Format project files
# @arg args~ Arguments passed to Biome
format() {
	biome format --write . "$@"
}

# @cmd Lint and fix project files
# @arg args~ Arguments passed to Biome
lint() {
	biome check --write . "$@"
}

# @cmd Run Vitest tests
# @arg args~ Arguments passed to Vitest
test() {
	dotenv -c development -- vitest run "$@"
}

# @cmd Synchronize environment configuration to GitHub and Vercel
# @arg environment! Environment name
# @arg project! Vercel project ID
env:sync() {
	tsx ./cli/env-sync.ts "$@"
}

# @cmd Update application dependencies
# @arg args~ Arguments passed to npm update
update() {
	npm update "$@"
}

# @cmd Fix dependency version consistency
# @arg args~ Arguments passed to Syncpack
sp:fix() {
	syncpack fix "$@"
}

# @cmd Normalize package manifest ordering
# @arg args~ Arguments passed to Syncpack
sp:format() {
	syncpack format "$@"
}

# @cmd Update dependency versions with Syncpack
# @arg args~ Arguments passed to Syncpack
sp:update() {
	syncpack update "$@"
}

# @cmd Normalize the package manifest and format the project
workflow:format() {
	sp:format
	format
}

# @cmd Run formatting, types, lint, dependency checks, and build
workflow:check() {
	workflow:format
	typecheck
	lint
	dc
	knip
	build
}

# @cmd Run Vitest and Playwright in parallel
workflow:test() {
	argc --argc-parallel "$0" test ::: e2e
}

# @cmd Update dependencies, format, and run all non-test checks
workflow:update() {
	sp:fix
	sp:update
	workflow:format
	update
	workflow:check
}

eval "$(argc --argc-eval "$0" "$@")"
