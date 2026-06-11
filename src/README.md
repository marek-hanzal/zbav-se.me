# App Source

This is the application code.

## Layout

- Keep screen and page component trees in `ui/`.
- Keep query wrappers in `query/`.
- Keep mutation wrappers in `mutation/`.
- Keep cross-domain public surfaces close to the concrete UI components and routes; `~public/` re-export wrappers are no longer used.
- Server effect logging is wired at the composition edge, so `*Fn` and `*Fx` code can rely on injected logger context instead of constructing it inline.
- Interactive terminal seeding lives under `src/seed/`, with fullscreen TUI code in `app/`, seed orchestration in `seed/`, and runtime executors in `server/`.
- Buyer and seller listing worker agents live under `src/buyer/listing/server/tool/` and `src/seller/listing/server/tool/`.
- Buyer and seller transaction worker agents live under `src/buyer/transaction/server/tool/` and `src/seller/transaction/server/tool/`.
- Buyer feed worker agents live under `src/buyer/feed/server/tool/`.
- Embedded experiments for AI chat live under `src/user/chat/ui/`, with server env contracts in `src/server/env/ServerAiSchema.ts`.
- Stripe billing integration lives under `src/user/stripe/`; Stripe remains the billing source of truth and the app mirrors only entitlement state.
- XML SEO endpoints live in `src/@routes/` as server-only routes, use the shared streaming XML sitemap domain in `src/common/sitemap/`, and keep large listing segmentation logic in the owning public domain server modules.

## Code Shape

- Do not introduce helpers for straightforward local logic; prefer local constants such as `baseSelect` and adjust the query in place.
- When a helper is truly needed, place it at the end of the file so the main exported code stays first.
