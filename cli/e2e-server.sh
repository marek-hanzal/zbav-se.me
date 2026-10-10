#!/usr/bin/env bash

set -euo pipefail

if [[ "${ZBAV_E2E_RUN:-}" != "1" ]]; then
	echo "Run E2E through argc e2e so its isolated database is started before the app" >&2
	exit 1
fi

# Internal Playwright webServer entrypoint. Inherits mise and test environment
# from argc e2e. Playwright owns this process and stops it after the test run.
# PORTLESS=0 with an explicit PORT/HOST/VITE_ORIGIN isolates it from a running dev app.
dotenv -c development -- vite build --mode production

# Do not force an existing Portless route away from another running app.
exec dotenv -c development -- portless zbav-se.me node .output/server/index.mjs
