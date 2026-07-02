---
name: create-component
description: Scaffold a reusable product component in src/components with structure, types, and tests.
---

## When to use

Creating a reusable product component in `src/components/[name]/`.

Use `create-route-screen` for route-level screens. Use feature folders for capability logic, not for
whole screen DOM trees.

**Read first:** `CONVENTION.md` section 5 for naming, structure, and allowed file roles.

## Which files do you need?

| Component type | Files | Notes |
|---|---|---|
| **Layout** (no logic) | `.tsx`, `.types.ts`, `index.ts` | Minimal |
| **Product** (with state/logic) | Add `.hooks.ts`, `.context.tsx`, `.model.ts`, `.schema.ts` as needed | Reusable product component |
| **UI Primitive** | Use `create-ui-primitive` skill instead | Domain-agnostic |

**Full matrix:** See `CONVENTION.md` section 5, "Component/module folder structure".

## Composition Chain

`create-component` is for product-aware composition. A component may combine existing UI primitives,
Ark UI parts, shared hooks/utils/api, installed libraries, and feature-specific business logic.

Before writing custom UI/control/business logic, follow this chain:

1. Check existing project UI primitives in `src/ui`, `packages/ui`, and shared component barrels. If
   a primitive covers part of the UI, use it.
2. If no primitive exists, decide whether that UI block is likely to be reused. If yes, create or plan
   a domain-agnostic primitive with `create-ui-primitive`, then compose it here.
3. If a reusable primitive is not warranted but Ark UI covers the interaction, use Ark UI directly.
4. Check existing shared hooks, utils, API clients, query options, models, schemas, and feature
   helpers before adding new business/product logic.
5. Check installed libraries before custom forms, server state, tables, virtualization, rate control,
   validation, or complex interactions. Use Zod for reusable runtime validation.
6. If declared dependencies are missing, run/request `pnpm install --frozen-lockfile`; do not choose
   native/custom controls because dependencies are not installed.
7. Style with Tailwind/shared primitives; do not add component selector blocks to global CSS.

Installed capability defaults:

- Ark UI for accessible selects, comboboxes, tabs, dialogs, popovers, menus, tooltips, checkboxes,
  radio groups, sliders, progress, pagination, accordions, and similar primitives.
- TanStack Form for non-trivial form state.
- TanStack Query for server state.
- TanStack Table/Virtual/Pacer when table, large-list, or rate-controlled interaction behavior is needed.

If Ark UI fits, consult the configured Ark UI MCP server for anatomy and supported parts before
implementation. Document the reason when choosing native/custom controls instead.

## Block Decomposition

When a component becomes a large product surface, write a decomposition map before implementation:
parent component, extracted child product components, hooks/model/config, and tests. For route-level
screens, stop and use `create-route-screen` instead. Reuse signals:

- the block could appear in another route, panel, modal, onboarding step, or feature
- the block has its own state, data mapping, validation, or accessibility concerns
- the block renders repeated options, lists, controls, visualizations, summaries, or action bars
- the block can be tested meaningfully on its own
- the block would make the parent file hard to scan or push it toward the line limit

Keep one-off glue local, but a parent component should stay a coordinator. Splitting model, hooks,
and types is not enough if the JSX still contains every block.

## Scaffold

```
components/[component-name]/
├── [component-name].tsx
├── [component-name].types.ts
├── index.ts
├── internal/                  # Optional
├── __tests__/
│   └── [component-name].test.tsx
└── [optional-files]           # Add as needed (see matrix)
```

**Templates:** `.agents/skills/create-component/templates/[component-name]/`

## Checklist

- [ ] Create folder `src/components/[component-name]`
- [ ] Copy templates from `/[component-name]/`
- [ ] Replace placeholders: `{{ComponentName}}`, `{{component-name}}`
- [ ] Add optional files as needed (see matrix)
- [ ] Create `__tests__/[component-name].test.tsx` (use template)
- [ ] Run the composition chain above; reuse project primitives, Ark UI, shared logic, and installed libraries when they fit
- [ ] For large product components, write a decomposition map and extract logical child blocks
- [ ] Use Tailwind utilities; document any global CSS exception
- [ ] Add accessibility (ARIA, semantic HTML, keyboard nav)
- [ ] If using Ark UI, consult the configured Ark UI MCP server for component anatomy and supported parts before implementation
- [ ] Use `@testing-library/user-event` for interaction tests; reserve `fireEvent` for low-level events
- [ ] Verify: exports via `index.ts` barrel only
- [ ] Run `biome check --write <file>` after each edit
- [ ] Run `pnpm verify` for final check

## Pitfalls

- Do not create `.misc.ts`, `.helpers.ts`, or `.temp.ts`; use a specific approved file role from the matrix.
- Do not use this skill to create route-level screens; use `create-route-screen`.
- Do not place reusable product components under `src/features/*`.
- Do not export `internal/` implementation details.
- Do not prop-drill through 3+ levels; use context instead.
- Do not mix domain logic with UI rendering; extract it to `.model.ts`.
- Do not put a large product surface in one file when logical blocks can be reused or tested separately.
- Do not build component styling through global feature CSS classes.
- Do not use `any`; follow `AGENTS.md` required invariants.
- Do not hand-roll accessible compound controls Ark UI provides unless there is a documented reason.
- Do not cite missing `node_modules` as a reason to avoid declared dependencies; fix install state or ask.
- Do not downgrade interaction tests to `fireEvent` when `user-event` can model the user behavior.
- Do not guess Ark UI anatomy; use the configured Ark UI MCP server when composing Ark-based components.

**Full guide:** See `CONVENTION.md` section 5 for detailed patterns and examples.
