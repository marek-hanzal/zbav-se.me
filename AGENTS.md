# AGENTS.md (shared)

## Source of truth
- Shared implementation policy: this file.
- App-specific overlays:
  - `apps/app/AGENTS.md`
  - `apps/server/AGENTS.md`

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

## Monorepo dependency boundaries (hard)
```txt
apps/app -> buyer, seller, common, sdk, ui
apps/server -> common only (no @zbav-se.me domain packages)
buyer, seller -> common, sdk, ui
common -> sdk, ui
sdk, ui -> no @zbav-se.me dependencies
```

## SDK policy (shared)
- Generated-only: `packages/@zbav-se.me/sdk/src/api/*` and `*.gen.ts`.
- Custom wrappers belong in `src/query/*` and `src/mutation/*`.
- Query wrappers: `withQuery<Req, Res[200]>`, stable keys, return `res.data`.
- Collections: use `withCollectionQuery` (`key`, `collectionQuery`, `fetchQuery`, `countQuery`, `patchMutation`, `toIdKey`).
- Keep export chain complete through local/parent `index.ts`.
- Contract changes require `bun run sdk` from repo root.

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
