# @use-pico/common

Here are some common utilities used across the packages.

Recent update: removed orphan `gql/*` and legacy `toolbox` helpers that were not reachable from package exports, and cleaned their corresponding dependencies.

Knip update: this workspace now runs a local `knip` binary from `devDependencies` to keep dependency checks deterministic in CI and local runs.

Recent update: added `to-enum-guard`, a tiny type-level helper for tuple-based enum declarations that must fully cover a target string union while still returning the original tuple unchanged.

Recent update: database runtime helpers no longer emit built-in console logging so observability can stay fully app-controlled.
