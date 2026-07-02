---
name: create-feature
description: Plan and scaffold a product capability under src/features, coordinating related route-screens, product components, UI primitives, API layers, hooks, schemas, models, utils, tests, and feature notes. Use for new or changed features such as auth flows, onboarding, billing, search, dashboards, or any cross-layer product capability.
---

## Contract

Use this skill for a product capability, not a screen or a reusable component. A feature may require
changes across routes, components, UI primitives, API domains, hooks, lib modules, utils, and docs.

`features !== screen` and `features !== component`.

## Read First

- `CONVENTION.md` sections 2, 5, 8
- `docs/product.md` and the relevant `docs/features/<feature-slug>-###.md`
- `API_CONVENTION.md` when the feature touches backend/external systems

## Capability Map

Before implementation, write a short map:

- product outcome, users, scope, non-goals, acceptance criteria
- route-screens to create/change with `create-route-screen`
- product components to create/change with `create-component`
- UI primitives to create/change with `create-ui-primitive`
- API domains/endpoints to create/change with `create-api-layer`
- feature core files under `src/features/[feature-name]`
- shared `lib`, `hooks`, `utils`, schemas, tests, E2E/a11y checks
- risks: auth, security, privacy, persistence, idempotency, accessibility, rollout

Ask for plan approval before implementation in feature threads.

## Feature Core

Default feature folder:

```text
src/features/[feature-name]/
├── [feature-name].model.ts
├── [feature-name].types.ts
├── [feature-name].schema.ts
├── [feature-name].constants.ts
├── [feature-name].hooks.ts
├── index.ts
└── __tests__/
    └── [feature-name].model.test.ts
```

Copy only files that are needed. Prefer no `.tsx` in `src/features`; reusable UI goes in
`src/components/*`, and route-level composition stays in `src/routes/*`.

## Responsibilities

- `*.model.ts`: business rules, calculations, state machines, pure transformations.
- `*.types.ts`: feature contracts and exported TypeScript types.
- `*.schema.ts`: Zod schemas for runtime validation.
- `*.constants.ts`: feature constants and option config.
- `*.hooks.ts`: feature-scoped hooks that bind model/state/API for consumers.
- `index.ts`: public feature API only.

Move portable infrastructure to `src/lib`, generic helpers to `src/utils`, and cross-feature hooks to
`src/hooks`. Keep API transport in `src/lib/api`.

## Skill Routing

- Route or page UI: use `create-route-screen`.
- Reusable product UI block: use `create-component`.
- Domain-agnostic primitive: use `create-ui-primitive`.
- Backend/external API domain: use `create-api-layer`.
- SEO/public indexing: use `seo`.

## Checklist

- [ ] Feature note exists or is planned under `docs/features/<feature-slug>-###.md`.
- [ ] Capability map separates route, feature, component, UI primitive, API, lib, and tests.
- [ ] Feature core contains no large DOM tree.
- [ ] Zod covers runtime validation boundaries when needed.
- [ ] Existing stack capabilities are used before custom infrastructure.
- [ ] Public exports go through `index.ts`; internals are not deep-imported.
- [ ] Unit/model tests cover business rules; E2E/a11y covers user-facing flows.
- [ ] Run `pnpm verify -- <changed files...>` and `pnpm test:agents` when skills/templates change.

## Pitfalls

- Do not put a route-screen or full JSX surface in `src/features/*`.
- Do not create reusable product components inside the feature folder.
- Do not duplicate API clients, crypto, auth, storage, or validation helpers when shared modules fit.
- Do not skip separate route/component/API skills when the feature crosses those layers.
