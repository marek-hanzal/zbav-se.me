# @use-pico/common

Here are some common utilities used across the packages.

Recent update: removed orphan `gql/*` and legacy `toolbox` helpers that were not reachable from package exports, and cleaned their corresponding dependencies.

Knip update: this workspace now runs a local `knip` binary from `devDependencies` to keep dependency checks deterministic in CI and local runs.
