# Code Convention

This convention describes organization rules that can be used across React app hosts and repository shapes.

## 1) Repository Shapes

### A) Single-app

```text
├── src/
│   ├── app/ or routes/          # framework host layer
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
- Framework route files should stay thin and compose feature/lib code.

### B) Turborepo / Multi-package

```text
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/ or routes/
│   │   │   ├── features/
│   │   │   └── integrations/
│   │   └── public/
│   └── docs/
├── packages/
│   ├── ui/
│   ├── lib/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   └── tsconfig/
├── tooling/
├── turbo.json
├── package.json
└── Dockerfile
```

Notes:

- In `apps/` live app-specific routes, providers, feature wiring, and runtime integrations.
- In `packages/` live reusable code with minimal knowledge about a specific app.
- Do not import from `apps/*` into `packages/*`.

## 2) Layers and Boundaries

Use pragmatic layering. Framework host code is replaceable; reusable layers should not depend on it.

### Agnostic layers

- `ui` - UI primitives, no business/domain logic.
- `lib` - self-contained modules, infrastructure abstractions, clients, wrappers.
- `types` - shared contracts and model types; no runtime code.
- `hooks` - reusable cross-component hooks.
- `utils` - small generic helpers when they are not domain-specific.

### App/product-aware layers

- `features` - workflow or domain feature composition.
- `components` - shared application components; may be domain-aware when intentionally app-level.
- `integrations` - provider setup and third-party runtime wiring.
- `app` or `routes` - top-level host composition, routing, loaders, server/client boundaries.
- `data` - demo/static data only.

### Allowed dependency direction

- `types` -> none
- `ui` -> `ui`, `types`, `lib`
- `lib` -> `lib`, `types`
- `hooks` -> `lib`, `types`, optionally `ui`
- `utils` -> `types`, `lib`
- `components` -> `ui`, `hooks`, `utils`, `lib`, `types`
- `features` -> `components`, `ui`, `hooks`, `utils`, `lib`, `types`
- `integrations` -> framework/runtime providers plus `lib`, `types`
- `app` or `routes` -> can import everything, but lower layers must not import them

Forbidden examples:

- `ui -> components`
- `lib -> components`
- `lib -> routes`
- `packages/* -> apps/*`
- cycles anywhere

## 3) Public API And Barrels

- Each reusable module exports its public API through `index.ts`.
- Avoid deep imports that bypass intended public APIs, unless the target is explicitly `internal/`.
- Do not export `internal/` implementation details from barrels.
- Do not create barrels for one-off local files until there is a real module boundary.
- Keep `index.ts` files boring. They should re-export public APIs only, not contain product screens,
  workflows, business logic, schemas, data fetching, or large UI trees.

Example root index:

- `export * from './components'`
- `export * from './ui'`
- `export * from './utils'`
- `export * from './lib'`
- `export * from './hooks'`
- `export type * from './types'`

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

Do not reimplement primitives that the stack already provides unless the task requires a simpler
native element or there is a documented reason.

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

Feature-local components may live directly inside `features/<feature>/` when they are not intended for reuse.

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

For screen-sized components, evaluate logical blocks for reuse before leaving the full DOM tree in a
single file. Extract a block into a product component when it could appear in another route, panel,
modal, onboarding step, or feature; has its own state/data/accessibility concerns; can be tested on
its own; or would make the parent file hard to scan.

Do not respond to file-size pressure by adding `biome-ignore lint/nursery/noExcessiveLinesPerFile`.
Allowed exceptions are mock data, generated files, large schemas, or configuration files. Application
logic should be decomposed into named modules with clear ownership.

## 6) Hooks

- Cross-component/shared hooks go into `hooks/`.
- Component-scoped hooks live near their component.
- Feature-scoped hooks live in the relevant `features/<feature>/` subtree.
- Query hooks are optional; prefer reusable TanStack Query option factories when that keeps composition cleaner.

## 7) Utils Vs Lib

- `utils/`: small helpers with limited scope; may be app or feature specific.
- `lib/`: portable modules, clients, adapters, wrappers, query factories, and infrastructure abstractions.

If a util grows into a portable module, migrate it to `lib/` or a dedicated package.

## 8) Framework Host Boundary

Current host-specific files are TanStack Start/Router files under `src/routes` plus router setup. If the template moves to Next.js, host-specific code should move to `src/app` or `src/pages` without forcing changes in `features`, `components`, `ui`, `lib`, `types`, or `hooks`.

Rules:

- Keep routing loaders/actions thin.
- Put domain workflows in `features`.
- Put data access in `lib/api` and server-state composition in `lib/query`.
- Do not let lower layers import route modules, Next server components, or TanStack route objects.
- Do not build a whole application inside `routes/index.tsx`, `app/page.tsx`, or another host index
  file. Host files compose feature/page modules; they do not own the full product implementation.

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
