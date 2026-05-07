# AGENTS.md (shared)

## Source of truth
- Shared implementation policy: this file.
- The app lives at the repo root now. Treat `src/`, `@lib/`, `cli/`, `test/`, `e2e/`, and `public/` as the primary app areas.

## Global rules (hard)
1. Write file content in English.
2. Respect domain boundaries (`public/session/user/buyer/seller`).
3. Never bypass hard gates (sensitivity, bans, lifecycle, limits).
4. Preserve type safety (Kysely + Zod + generated SDK types).
5. No ad-hoc local type holder files (`foo-props.ts`, `types.ts`, `type.ts`).
6. No inline complex types in signatures/vars; define local named aliases.
7. Namespace lettercase must match symbol lettercase (`foo -> namespace foo`, `Bar -> namespace Bar`).
8. If touched directory has `README.md`, update it.
9. Run relevant checks before handoff.
10. If work drifts into a long side task outside the current Linear scope, ask for a new issue.
11. Don't start `dev`, it's already running

## App Rules
- Keep screen and page component trees in the local `ui/` folders.
- Keep query wrappers in `query/`.
- Keep mutation wrappers in `mutation/`.
- Keep public cross-domain surfaces in `~public/`.
- Routes live in `src/@routes`; domain UI lives in `src/<domain>`.
- Every route must have its own `*Page` component in its domain UI folder.
- Route files may contain only route-specific hooks (`Route.useParams`, `Route.useSearch`, `Route.useLoaderData`, ...), then pass mapped data into the `*Page` component.
- `*Page` components must never import or call Route APIs directly; all route-derived data must be injected from outside.

## Component Rules
- Exactly one React component per file. Split files when that is violated.
- Prefer the namespace props pattern:
  - `export namespace ComponentName { export interface Props ... }`
  - `export const ComponentName: FC<ComponentName.Props>`
- Extend base UI props when applicable (`Container.Props`, `Button.Props`, ...).
- Merge `ui` defaults with `...ui` last.
- Keep wrappers pass-through (`...props`).
- For multi-callback components, prefer grouped `hooks` prop.

## `data-ui` Contract
- Root: `Component[Element]`
- Child: `Component-[Element]`
- State: `Component[Element.state]` or `Component-[Element.state]`
- Dynamic variant: ``Component-[Button.${value}]``
- Naming: `Component/Element` PascalCase, `state` lowercase, semantic/stable only.
- If touching legacy free-form labels, normalize to bracket format.

## Formatting baseline
- Use `bun run format`

## Tests
- Tests may run quite long (~30s - a few minutes as Docker container may be built)
- Run tests from project root `bun run test`

## Finishing the work
- Always run `bun run workflow:check` (expect minor reformating, Biome output and TypeScript output)

# context-mode — MANDATORY routing rules

You have context-mode MCP tools available. These rules are NOT optional — they protect your context window from flooding. A single unrouted command can dump 56 KB into context and waste the entire session.

## BLOCKED commands — do NOT attempt these

### curl / wget — BLOCKED
Any shell command containing `curl` or `wget` will be intercepted and blocked by the context-mode plugin. Do NOT retry.
Instead use:
- `context-mode_ctx_fetch_and_index(url, source)` to fetch and index web pages
- `context-mode_ctx_execute(language: "javascript", code: "const r = await fetch(...)")` to run HTTP calls in sandbox

### Inline HTTP — BLOCKED
Any shell command containing `fetch('http`, `requests.get(`, `requests.post(`, `http.get(`, or `http.request(` will be intercepted and blocked. Do NOT retry with shell.
Instead use:
- `context-mode_ctx_execute(language, code)` to run HTTP calls in sandbox — only stdout enters context

### Direct web fetching — BLOCKED
Do NOT use any direct URL fetching tool. Use the sandbox equivalent.
Instead use:
- `context-mode_ctx_fetch_and_index(url, source)` then `context-mode_ctx_search(queries)` to query the indexed content

## REDIRECTED tools — use sandbox equivalents

### Shell (>20 lines output)
Shell is ONLY for: `git`, `mkdir`, `rm`, `mv`, `cd`, `ls`, `npm install`, `pip install`, and other short-output commands.
For everything else, use:
- `context-mode_ctx_batch_execute(commands, queries)` — run multiple commands + search in ONE call
- `context-mode_ctx_execute(language: "shell", code: "...")` — run in sandbox, only stdout enters context

### File reading (for analysis)
If you are reading a file to **edit** it → reading is correct (edit needs content in context).
If you are reading to **analyze, explore, or summarize** → use `context-mode_ctx_execute_file(path, language, code)` instead. Only your printed summary enters context.

### grep / search (large results)
Search results can flood context. Use `context-mode_ctx_execute(language: "shell", code: "grep ...")` to run searches in sandbox. Only your printed summary enters context.

## Tool selection hierarchy

1. **GATHER**: `context-mode_ctx_batch_execute(commands, queries)` — Primary tool. Runs all commands, auto-indexes output, returns search results. ONE call replaces 30+ individual calls.
2. **FOLLOW-UP**: `context-mode_ctx_search(queries: ["q1", "q2", ...])` — Query indexed content. Pass ALL questions as array in ONE call.
3. **PROCESSING**: `context-mode_ctx_execute(language, code)` | `context-mode_ctx_execute_file(path, language, code)` — Sandbox execution. Only stdout enters context.
4. **WEB**: `context-mode_ctx_fetch_and_index(url, source)` then `context-mode_ctx_search(queries)` — Fetch, chunk, index, query. Raw HTML never enters context.
5. **INDEX**: `context-mode_ctx_index(content, source)` — Store content in FTS5 knowledge base for later search.

## Output constraints

- Keep responses under 500 words.
- Write artifacts (code, configs, PRDs) to FILES — never return them as inline text. Return only: file path + 1-line description.
- When indexing content, use descriptive source labels so others can `search(source: "label")` later.

## ctx commands

| Command | Action |
|---------|--------|
| `ctx stats` | Call the `stats` MCP tool and display the full output verbatim |
| `ctx doctor` | Call the `doctor` MCP tool, run the returned shell command, display as checklist |
| `ctx upgrade` | Call the `upgrade` MCP tool, run the returned shell command, display as checklist |
