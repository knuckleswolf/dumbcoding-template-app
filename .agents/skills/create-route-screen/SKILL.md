---
name: create-route-screen
description: Create or update a TanStack Router route-screen with loader/search/params wiring and decomposed UI composition.
---

## When to use

Use for any new or changed route-level screen in `src/routes/*`: index pages, detail pages, nested
routes, loader/action screens, error/not-found screens, or screens that compose multiple features.

**Read first:** `CONVENTION.md` sections 2, 5, and 8.

## Route-Screen Rule

In this template, a TanStack route file is the screen boundary because it owns `Route.useLoaderData()`,
params, search state, pending/error/not-found boundaries, and host-specific exports.

Keep that host logic in the route, but do not put the whole screen DOM tree there. A route-screen
coordinates data and layout, then composes product components, features, UI primitives, hooks, and
models.

## Layer Contract

- `src/routes/*`: route-screen, loader/action/search wiring, boundary components, screen composition.
- `src/features/*`: product capabilities, workflows, state machines, domain hooks, models, API use.
- `src/components/*`: reusable product components with product-aware UI or business composition.
- `src/ui/*`: domain-agnostic primitives, preferably Ark UI wrappers/adapters when useful.
- `src/lib`, `src/hooks`, `src/utils`: shared infrastructure, hooks, and helpers.

`features !== screen`. A route may import feature capabilities, but a feature folder must not become
one large route-level JSX surface.

## Decomposition Map

Before implementation, write a short map:

- route file and route id
- loader/action/search/params needs, including Zod schemas for `validateSearch` when search params exist
- route component and boundary components
- product components to create/reuse from `src/components`
- feature capabilities to create/reuse from `src/features`
- UI primitives, Ark UI components, and Tailwind utility strategy to use
- hooks/model/config/data files and test targets

If a region renders repeated controls, lists, visualizations, summaries, forms, panels, action bars,
or has its own a11y/state/data concerns, extract it from the route-screen into a product component.
Plan top-down, then build bottom-up: route-screen > feature > product component > UI primitive >
Ark UI > native DOM.

## Implementation Steps

1. Prepare dependencies first when needed: `pnpm install --frozen-lockfile`.
2. Define the decomposition map and get plan approval when this is a feature thread.
3. Keep `createFileRoute(...)`, loader/action/search validation, and `Route.use*` calls in the route.
   Use Zod for `validateSearch` and other route-level runtime validation.
4. Use `create-feature` for capability state, business rules, models, schemas, hooks, and API needs.
5. Use `create-component` for reusable product blocks under `src/components/*`.
6. Use `create-ui-primitive` for domain-agnostic primitives under `src/ui/*`.
7. Build missing lower-layer dependencies before assembling the route-screen.
8. Keep route JSX shallow: compose named blocks instead of rendering every control inline; use Tailwind utilities, not feature-specific global CSS.
9. Add route E2E/a11y tests when behavior is user-facing; add component/model tests near modules.

## Pitfalls

- Do not create `src/screens`; the route file is the screen boundary for TanStack Router.
- Do not move `Route.useLoaderData()` into lower layers.
- Do not build a whole app in `routes/index.tsx`.
- Do not use `src/features/*` as a dumping ground for one large screen component.
- Do not treat `.model.ts` or `.hooks.ts` extraction as enough if all JSX remains in one file.
- Do not bypass Ark UI, Tailwind, or TanStack libraries because local dependencies are missing.
