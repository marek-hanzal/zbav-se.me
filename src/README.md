# App Source

This is the application code.

## Layout

- Keep screen and page component trees in `ui/`.
- Keep query wrappers in `query/`.
- Keep mutation wrappers in `mutation/`.
- Keep cross-domain public surfaces close to the concrete UI components and routes; `~public/` re-export wrappers are no longer used.
- Server effect logging is wired at the composition edge, so `*Fn` and `*Fx` code can rely on injected logger context instead of constructing it inline.
- Embedded experiments for AI chat live under `src/user/chat/ui/`, with server env contracts in `src/server/env/ServerAiSchema.ts`.
