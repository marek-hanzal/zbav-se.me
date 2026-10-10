# App Source

This is the application code.

## Layout

- Application features, shared utilities, and primitives use flat `src/<domain>/<kind>/<file>` paths. Ownership is part of the domain name, such as `buyer-feed`, `seller-listing`, `public-category`, or `user-upload`. Import concrete `~/domain/kind/module` paths; there is no separate `lib/` root or alias.
- `ui/` owns shared presentation primitives and CSS. Stateful browser capabilities such as clipboard, navigation, selection, visibility, query, and mutation have their own domains.
- Compose screens directly in `src/@routes/`, including pending and error UI. There is no separate `*Page` component layer.
- The router-owned route tree and static asset layout are exempt from the flat domain layout.
- Keep reusable UI components in the owning domain's `ui/` folder. Components may keep owned child components in their own folder; other modules stay directly inside their kind folder. Routes read their own params, search, and loader data and pass the relevant values to those components; domain components do not import concrete route modules.
- Prefer reusable forms, lists, cards, editors, and layout primitives. Small amounts of route composition duplication are acceptable.
- Keep query wrappers in `query/`.
- Keep mutation wrappers in `mutation/`.
- Keep cross-domain public surfaces close to the concrete UI components and routes; `~public/` re-export wrappers are no longer used.
- Server effect logging is wired at the composition edge, so `*Fn` and `*Fx` code can rely on injected logger context instead of constructing it inline.
- Interactive terminal seeding lives under `src/seed/`, with fullscreen TUI code in `ui/`, orchestration in `fn/`, runtime effects in `fx/`, and contracts in `schema/` and `type/`.
- Buyer and seller listing worker agents live under `src/buyer-listing/tool/` and `src/seller-listing/tool/`.
- Buyer and seller transaction worker agents live under `src/buyer-transaction/tool/` and `src/seller-transaction/tool/`.
- Buyer feed worker agents live under `src/buyer-feed/tool/`.
- Agent UI and browser runtime live under `src/user-agent/ui/` and `src/user-agent/runtime/`, with server environment contracts in `src/server-env/schema/ServerAiSchema.ts`.
- Resource bundle assignment lives under `src/user-resource-bundle/`; system flows copy template items, limits, and features into user snapshots without a payment provider.
- XML SEO endpoints live in `src/@routes/` as server-only routes, use the shared streaming XML sitemap domain in `src/sitemap/`, and keep large listing segmentation logic in `src/public-listing/fx/`.

Server implementation details live in [SERVER.md](./SERVER.md). The declarative resolved-path groups in `.dependency-cruiser.cjs` preserve buyer, seller, shared, public, user, and runtime boundaries. Update the relevant groups when adding or moving modules; a flat source root does not make server internals available to client code.

## Code Shape

- Name project-owned plain callables with `Fn`: exported operations, helpers, factories, local callable bindings and parameters, and callback props. Promise-returning operations also use `Fn`. Anonymous inline callbacks need no additional binding or name.
- Name a function with `Fx` only when its direct return value is an `Effect`. A factory returning a function uses `Fn`; an async function returning a Promise uses `Fn`, including a Promise that resolves to an Effect. Stored Effect values, schemas, classes, and service tags keep their own naming conventions.
- Actual React components and React hooks keep their component and `use*` names. Mandatory external, framework, DOM, and JSX protocol names stay intact, including local structural contracts that mirror external objects and callback props forwarded with spreads. For example, DOM event props and JSX `children` retain their protocol keys. Enum and map data keys keep their data meaning, even when their values are callable.
- Match an operation file's basename to its primary exported callable, including `Fn` or `Fx`. General plain operation modules belong in `fn/`, and Effect operation modules belong in `fx/`; specialized module roles retain their owning kind, such as `db/`, `query/`, `mutation/`, `hook/`, or `ui/`.
- Do not introduce helpers for straightforward local logic; prefer local constants such as `baseSelect` and adjust the query in place.
- When a helper is truly needed, place it at the end of the file so the main exported code stays first.
