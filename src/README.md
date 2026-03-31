# App Source

This is the application code.

## Layout

- Keep screen and page component trees in `ui/`.
- Keep query wrappers in `query/`.
- Keep mutation wrappers in `mutation/`.
- Keep cross-domain public surfaces close to the concrete UI components and routes; `~public/` re-export wrappers are no longer used.
