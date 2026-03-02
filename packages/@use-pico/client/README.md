# @use-pico/client

Collection of client-side components and hooks.

Recent update: `ValueList.PropsEx<TItem>` now maps to `Partial<ValueList.Props<TItem>>` to support straightforward component extension without additional local `Partial` wrappers.

Dependency update: removed unused direct dependencies (`@floating-ui/react`, `axios`, `kysely`, `react-dropzone`, `ts-pattern`, `zod`) based on verified in-workspace usage.
