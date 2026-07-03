---
name: create-feature
description: Plan and scaffold a product capability under src/features, coordinating related route-screens, product components, UI primitives, API layers, hooks, schemas, models, utils, tests, and feature notes. Use for new or changed features such as auth flows, onboarding, billing, search, dashboards, or any cross-layer product capability.
---

## Contract

Use this skill for a product capability, not route host logic or a reusable component. A feature may
require changes across routes, components, UI primitives, API domains, hooks, lib modules, utils, and
docs.

`features !== screen` and `features !== component`.
Features are higher than components. Components must not import `src/features/*`.
A feature may expose a mountable entry component when the capability has cohesive UI.

## Read First

- `CONVENTION.md` sections 2, 5, 8
- `docs/product.md` if present and the relevant `docs/features/<feature-slug>-###.md`
- `API_CONVENTION.md` when the feature touches backend/external systems

## Capability Map

Before implementation, write a short map:

- product outcome, users, scope, non-goals, acceptance criteria
- route-screens and layouts to create/change with `create-route-screen`
- product components to create/change with `create-component`
- UI primitive inventory to create/change with `create-ui-primitive`
- Ark UI MCP lookup, Ark parts, Tailwind strategy; document native/global CSS exceptions
- API domains/endpoints to create/change with `create-api-layer`
- feature core files under `src/features/[feature-name]`
- shared `lib`, `hooks`, `utils`, schemas, tests, E2E/a11y checks; keep product projections out of `lib`
- risks: auth, security, privacy, persistence, idempotency, accessibility, rollout

Ask for plan approval before implementation in feature threads.

## Layer Sequence

Plan top-down, then build bottom-up:

1. Route-screen/layout: decide which route owns host logic and which layout owns shell structure.
2. Feature: define entry UI if needed, capability state, business rules, models, schemas, hooks, API
   needs, and risks.
3. Product components: identify reusable UI blocks needed by the feature.
4. UI primitives: identify shared fields, panels, buttons, sliders, selectors, cards, and groups.
5. Ark UI: wrap/adapt Ark UI for accessible compound primitives when it fits.
6. Native DOM: use only for genuinely trivial elements or documented exceptions.

Implement lower dependencies first when they do not exist, then assemble feature core and route-screen.

## Feature Core

Default feature folder:

```text
src/features/[feature-name]/
├── [feature-name].tsx
├── [feature-name].model.ts
├── [feature-name].types.ts
├── [feature-name].schema.ts
├── [feature-name].constants.ts
├── [feature-name].hooks.ts
├── index.ts
└── __tests__/
    └── [feature-name].model.test.ts
```

Copy only files that are needed. Use `[feature-name].tsx` as the capability entry that owns feature
state orchestration; it must not be a thin pass-through to one product/workbench component. Reusable
product UI goes in `src/components/*`; primitives go in `src/ui/*`; shell placement stays in routes/layouts.

## Responsibilities

- `*.model.ts`: business rules, calculations, state machines, pure transformations.
- `*.tsx`: optional feature entry that composes product components and feature state.
- `*.types.ts`: feature contracts and exported TypeScript types.
- `*.schema.ts`: Zod schemas for runtime validation.
- `*.constants.ts`: feature constants and option config.
- `*.hooks.ts`: feature-scoped hooks that bind model/state/API for consumers.
- `index.ts`: public feature API only.

Move project/runtime functional code, serialization, storage, API helpers, and stable algorithms to
`src/lib`; keep product copy, options, state, view-models, workflows, and UI out of `lib`.

## Skill Routing

- Route or page UI: use `create-route-screen`.
- Cohesive capability UI mounted by a route: use this skill's feature entry.
- Reusable product UI block: use `create-component`.
- Domain-agnostic primitive: use `create-ui-primitive`.
- Backend/external API domain: use `create-api-layer`.
- SEO/public indexing: use `seo`.

## Checklist

- [ ] Feature note exists or is planned under `docs/features/<feature-slug>-###.md`.
- [ ] Capability map separates route, feature, component, UI primitive, Ark UI, API, lib, and tests.
- [ ] Lower-layer dependencies are created before assembling feature core and route-screen.
- [ ] Repeated controls, panels, cards, buttons, action bars, and fields route to `src/ui/*`; zero Ark UI or zero primitives has an approved exception.
- [ ] Feature core contains no large DOM tree.
- [ ] Styling uses Tailwind utilities; global CSS changes are limited to tokens/base/app shell.
- [ ] Zod covers runtime validation boundaries when needed.
- [ ] Existing stack capabilities are used before custom infrastructure.
- [ ] Public exports go through `index.ts`; internals are not deep-imported.
- [ ] Unit/model tests cover business rules; E2E/a11y covers user-facing flows.
- [ ] Run `pnpm verify -- <changed files...>` and `pnpm test:agents` when skills/templates change.

## Pitfalls

- Do not put a route-screen, layout shell, or full JSX surface in `src/features/*`.
- Do not force a cohesive feature entry into `src/components/*` just to keep `features` headless.
- Do not create a feature entry that only calls hooks and forwards everything into one component.
- Do not create a feature-local UI island under `src/features/*/internal` when blocks should be shared.
- Do not use native select/range/dialog/popover/menu/etc. when Ark UI fits, unless the reason is documented.
- Do not create reusable product components inside the feature folder.
- Do not export feature types/constants as the dependency source for `src/components/*`; use props,
  `src/lib`, or `src/types`.
- Do not duplicate API clients, crypto, auth, storage, or validation helpers when shared modules fit.
- Do not skip separate route/component/API skills when the feature crosses those layers.
