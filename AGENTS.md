# Repository Guidelines

## Project Structure & Module Organization
- Bun + Turbo monorepo; workspaces in `apps/*` and `packages/**/*`. Source lives under each package's `src/`.
- Apps: `apps/app` (PWA), `apps/web` (marketing), `apps/server` (API), `apps/blog` (Docusaurus). Dev ports: 3031/3030/3032/4090.
- Packages: `packages/@zbav-se.me/{sdk,ui}` for API client and shared UI; `packages/@use-pico/{client,common,server,cls}` internal framework. Respect dependency rules noted in `README.md` (foundations → domain → apps).
- Root holds configs like `biome.json`, `turbo.json`, `tsconfig*`.

## Build, Test, and Development Commands
- Install deps: `bun install`.
- Run all apps: `bun dev` (uses `dotenv -c development -- turbo run dev --parallel`).
- Build all: `bun run build`; preview builds: `bun run preview`.
- Lint/format: `bun run lint` (Biome check, writes fixes), `bun run format` (Biome format).
- Types: `bun run typecheck`. Dead code: `bun run knip`. SDK regen: `bun run sdk`. Translations: `bun run translations`.
- Per-app: `cd apps/<app> && bun dev`.

## Coding Style & Naming Conventions
- Language: TypeScript/React. Biome enforces tabs (width 4), LF, double quotes, trailing commas, semicolons, 100-col line width, multiline JSX attrs.
- Keep imports ordered; avoid disabling Biome. Run format before commits.
- Components/contexts/hooks in PascalCase; hooks prefixed with `use`. Utility modules in camelCase; tests mirror source path.
- Preserve layering: foundation packages (`sdk`, `ui`) stay dependency-free on higher layers; apps should not import across forbidden boundaries.

## Testing Guidelines
- Vitest used in framework packages (`packages/@use-pico/*`). Typical unit tests live next to code as `*.test.ts`.
- Run package tests from that package (e.g., `cd packages/@use-pico/common && bun test`). Prefer fast unit tests; mock network/IO.
- Add tests for new logic or bug fixes. Aim to keep behavior parity and avoid regressions even if coverage is not enforced.

## Commit & Pull Request Guidelines
- Commit messages follow concise, imperative sentence style seen in history (e.g., `Refactor user-related schemas for API routes`). Group related changes; avoid multi-topic commits.
- PRs should include: summary of changes, rationale, testing notes (`bun run lint`, `bun run typecheck`, relevant tests), screenshots/GIFs for UI-affecting work, and linked issue/ticket when applicable.
- Keep PRs scoped; respect existing domain boundaries and note any migration or env variable changes in the description.

## Security & Configuration Tips
- Do not commit secrets. Use `.env` files per app; mirror keys listed in `README.md` under Environment Variables.
- Verify new endpoints are covered by server schema/types (`apps/server`) and that CORS origins match configured domains before merging.
