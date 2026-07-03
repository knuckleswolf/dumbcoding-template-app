# Code Convention

This convention describes organization rules that can be used across React app hosts and repository shapes.

## 1) Repository Shapes

### A) Single-app

```text
├── src/
│   ├── app/ or routes/          # framework host layer
│   ├── layouts/
│   ├── features/
│   ├── components/
│   ├── hooks/
│   ├── ui/
│   ├── lib/
│   ├── integrations/
│   ├── types/
│   ├── utils/
│   └── data/
├── tooling/
├── package.json
└── Dockerfile
```

Current template mapping:

- TanStack Start/Router routes live in `src/routes`.
- A Next.js host would normally use `src/app` or `src/pages`.
- TanStack route files are route-screens: they own loader/action/search/params wiring and compose
  feature/component code.

### B) Turborepo / Multi-package

In `apps/` live app-specific routes, layouts, providers, feature wiring, and integrations. In
`packages/` live reusable `ui`, `lib`, `hooks`, `types`, `utils`, and shared configs. Do not import
from `apps/*` into `packages/*`.

## 2) Layers and Boundaries

Use pragmatic layering. Framework host code is replaceable; reusable layers should not depend on it.

### Agnostic layers

- `ui` - UI primitives, no business/domain logic.
- `lib` - project/environment functional modules, clients, wrappers, storage, serialization; no UI.
- `types` - shared contracts and model types; no runtime code.
- `hooks` - reusable cross-component hooks.
- `utils` - environment-agnostic pure helpers that can be copied out and still work; no UI.

### App/product-aware layers

- `features` - product capabilities; may expose a mountable feature entry, but not route host logic.
- `components` - reusable product components; may be domain-aware when intentionally app-level.
- `layouts` - screen skeletons and app/page frames; only accept `children` for target content.
- `integrations` - provider setup and third-party runtime wiring.
- `app` or `routes` - top-level host composition, routing, loaders, server/client boundaries.
- `data` - demo/static data only.

### Allowed dependency direction

- `types` -> none
- `ui` -> `ui`, `types`, `utils`
- `lib` -> `lib`, `types`, `utils`
- `hooks` -> `lib`, `types`, optionally `ui`
- `utils` -> `utils`, `types`
- `components` -> `ui`, `hooks`, `utils`, `lib`, `types`
- `features` -> `components`, `ui`, `hooks`, `utils`, `lib`, `types`
- `layouts` -> `components`, `ui`, `hooks`, `utils`, `lib`, `types`
- `integrations` -> framework/runtime providers plus `lib`, `types`
- `app` or `routes` -> can import everything, but lower layers must not import them

Forbidden examples:

- `components -> features`, `ui -> features`, `ui -> components`
- `features -> routes`, `features -> layouts`, `layouts -> features`
- `lib -> ui`, `lib -> components`, `ui -> lib`, `utils -> lib`
- `packages/* -> apps/*`
- cycles anywhere

## 3) Public API And Barrels

- Each reusable module exports its public API through `index.ts`.
- Avoid deep imports that bypass intended public APIs, unless the target is explicitly `internal/`.
- Do not export `internal/` implementation details from barrels.
- Do not create barrels for one-off local files until there is a real module boundary.
- Keep `index.ts` files boring. They should re-export public APIs only, not contain product screens,
  workflows, business logic, schemas, data fetching, or large UI trees.

Root barrels may re-export `components`, `layouts`, `ui`, `utils`, `lib`, `hooks`, and public types.

## 4) Naming

- Folders/files: `kebab-case` by default.
- React components/types: `PascalCase`.
- Functions/variables: `camelCase`.
- Constants: `SCREAMING_SNAKE_CASE` only for true constants or environment keys.
- Exceptions: tool-specific filenames required by third-party tools, such as `vite.config.ts`, `next.config.js`, `routeTree.gen.ts`.

Tests:

- Unit/component: `__tests__/*.test.ts(x)` adjacent to source.
- Integration: `__tests__/*.int.test.ts` adjacent to module.
- E2E: `e2e/*.spec.ts` at project or app root.

## 5) Component And Module Folders

Before implementing UI controls by hand, check the installed stack. Use existing libraries when they
cover the behavior:

- Ark UI for accessible interactive primitives and compound controls.
- TanStack Query for server state and cache invalidation.
- TanStack Form for non-trivial form state and validation flow.
- TanStack Table for table/grid behavior.
- TanStack Virtual for large lists.
- TanStack Pacer for debounce/throttle/rate-limit interactions.
- Zod for runtime validation of route search params, form values, API payloads/responses, env-derived
  config, and persisted user input.

Before product UI implementation, create a UI primitive inventory. Interactive controls route through
`src/ui/*` and Ark UI by default; zero UI primitives or zero Ark UI usage needs a documented reason.
Use the Ark UI MCP before composing Ark primitives. Primitives are styled slot APIs: preserve Ark
composition, derive wrapper props from root/part props, and expose slots instead of hardcoded DOM.
Use Tailwind utilities for product UI. Keep `src/styles.css` for Tailwind import, tokens, base
elements, and app shell only; feature-specific selectors, large control blocks, and one-off visual
systems belong in extracted UI/product components, not global CSS.

If a dependency is declared in `package.json` but local `node_modules` is absent or stale, install
dependencies first. Missing local installs must not be used as justification for bypassing Ark UI,
TanStack libraries, or other declared capabilities.

Reusable component folders use this structure:

```text
components/<component-name>/
├── <component-name>.tsx
├── <component-name>.types.ts
├── index.ts
├── internal/
└── __tests__/
```

Reusable product components live in `components/`. They receive feature-derived data/actions via
props and must not import `features/*`. Move shared domain contracts to `lib` or `types`.
Feature folders may own entry UI, hooks, state, models, config, and adapters. A feature entry
orchestrates capability state and product blocks; it is not a thin proxy to one workbench component.

Layouts live in `layouts/` and own repeated screen skeletons: header/sidebar/footer/content frame.
They accept only `children` for target content, not `header`, `footer`, `nav`, `content`, or `actions`
props. Create several named layouts instead of one universal layout with many structural options.

Base files:

- `<component-name>.tsx` - implementation and public component entry.
- `<component-name>.types.ts` - public component types.
- `internal/*` - internal implementation details.
- `index.ts` - public re-export.

Allowed optional files:

- `<component-name>.hooks.ts`
- `<component-name>.context.tsx`
- `<component-name>.constants.ts`
- `<component-name>.utils.ts`
- `<component-name>.config.ts`
- `<component-name>.model.ts`
- `<component-name>.schema.ts`
- `<component-name>.styles.ts`
- `<component-name>.variants.ts`

Do not create arbitrary suffixes such as `.misc.ts`, `.stuff.ts`, `.helpers2.ts`, `.old.ts`, `.backup.ts`, `.draft.ts`, or `.copy.ts`.

Do not split files just for the sake of splitting. Start with base files, then introduce optional files only when they improve readability, ownership, testability, or reuse.

For route-screens or screen-sized UI work, create a decomposition map first. The route owns TanStack
host logic and screen composition; layouts own repeated shell structure; features own capability
state. The map must name layouts, product components, UI primitives, Ark parts, styling, and tests.

Extract repeated fields, panels, cards, buttons, action bars, control groups, visualizations, lists,
forms, and summaries into `src/ui/*` or `src/components/*` before using them in route/feature code. A
split `.model.ts`, `.hooks.ts`, or `.types.ts` does not replace DOM decomposition.

Do not respond to file-size pressure by adding `biome-ignore lint/nursery/noExcessiveLinesPerFile`.
Allowed exceptions are mock data, generated files, large schemas, or configuration files. Application
logic should be decomposed into named modules with clear ownership.

## 6) Hooks

- Cross-component/shared hooks go into `hooks/`.
- Component-scoped hooks live near their component.
- Feature-scoped hooks live in the relevant `features/<feature>/` subtree.
- Query hooks are optional; prefer reusable TanStack Query option factories when that keeps composition cleaner.

## 7) Utils Vs Lib

- `utils/`: environment-agnostic pure helpers; no app, feature, runtime, or UI dependency.
- `lib/`: project/environment functional modules, clients, adapters, wrappers, storage, serialization, query factories, and infrastructure; no UI.

If a helper can be copied out and still work, keep it in `utils`; move it to `lib` only when it depends on project/runtime context. Keep copy, default state, view-models, options, and workflows in `features` or `components`.

## 8) Route-Screen Host Boundary

Current host-specific files are TanStack Start/Router files under `src/routes` plus router setup. In
this host, route files are screen boundaries because they can access the current `Route` instance. If
the template moves to Next.js, equivalent host screen files would live in `src/app` or `src/pages`
without forcing changes in `features`, `components`, `ui`, `lib`, `types`, or `hooks`.

Rules:

- Keep routing loaders/actions thin.
- Keep `Route.useLoaderData()`, params/search reads, and route boundary components in the route file.
- Use Zod schemas for `validateSearch` and other route-level runtime validation when data crosses a
  URL, network, storage, or user-input boundary.
- Put capability state and mountable feature entries in `features`; keep route host logic in routes.
- Put data access in `lib/api` and server-state composition in `lib/query`.
- Do not let lower layers import route modules, Next server components, or TanStack route objects.
- Do not inline every leaf control inside `routes/index.tsx`, `app/page.tsx`, or another host screen.
  Host files own screen composition and compose feature capabilities plus product components.

## 9) TypeScript Configuration

Base invariants:

- strict mode enabled
- ES2022 baseline
- bundler module resolution
- isolated modules
- no emit

Each app or package should own its local `tsconfig.json` as the entrypoint for that workspace. Shared configs may live in `packages/tsconfig` in a multi-package repository.

## 10) Compatibility Baseline

Default baseline is ES2022. If the project defines additional target constraints, such as browserslist or runtime deployment targets, code must comply with those constraints. Use polyfills only when necessary and justified.
