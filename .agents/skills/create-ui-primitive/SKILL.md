---
name: create-ui-primitive
description: Scaffold a domain-agnostic UI primitive with a11y and exports.
---

## When to use

Creating domain-agnostic UI primitive (Button, Input, Modal, Card, etc.) that is **reusable across all features**.

**Read first:** `CONVENTION.md` section 5 for structure and naming.

## Repository locations

- **Single-app:** `src/ui/[component-name]/`
- **Multi-package:** `packages/ui/[component-name]/`
- If the current app has not adopted `src/ui` yet, create it only for genuinely domain-agnostic primitives.

## Capability Check

Before creating a primitive, inspect `package.json` and existing UI folders. Prefer Ark UI for
accessible compound primitives and use this skill to wrap/style/adapt Ark UI parts instead of
reimplementing their behavior.

If Ark UI is declared in `package.json` but missing from local `node_modules`, run/request
`pnpm install --frozen-lockfile`. Missing local installs must not justify native/custom replacements.

Use native elements only when the behavior is genuinely simple and does not need richer keyboard,
focus, popup, collection, roving-tabindex, or ARIA management. Document the reason for custom behavior.

## Scaffold structure

```
ui/[component-name]/
├── [component-name].tsx
├── [component-name].types.ts
├── index.ts
├── internal/                  # Optional
├── __tests__/
│   └── [component-name].test.tsx
└── [optional-files]           # .styles.ts, .variants.ts, .constants.ts
```

**Templates:** `.agents/skills/create-ui-primitive/templates/[component-name]/`

## Checklist

- [ ] Create folder `src/ui/[component-name]` or `packages/ui/[component-name]` (kebab-case)
- [ ] Copy templates from `/[component-name]/`
- [ ] Replace placeholders: `{{ComponentName}}` (PascalCase), `{{component-name}}` (kebab-case)
- [ ] Define variants and sizes in `.types.ts`
- [ ] Run the capability check above; wrap/adapt Ark UI parts when they fit
- [ ] Verify: **no domain knowledge** (reusable across all features)
- [ ] Verify: **no feature-specific state** (simple, dumb component)
- [ ] If using Ark UI, consult the configured Ark UI MCP server for component anatomy and supported parts before implementation
- [ ] Add accessibility (ARIA labels, roles, semantic HTML, keyboard nav)
- [ ] Use `@testing-library/user-event` for interaction tests; reserve `fireEvent` for low-level events
- [ ] Add prop documentation/JSDoc
- [ ] Verify: exports via `index.ts` barrel only
- [ ] Run `biome check --write <file>` after each edit
- [ ] Run `pnpm verify` for final check

## Pitfalls

- Do not add domain logic; use `create-component` instead.
- Do not hardcode app-specific colors, sizes, or spacing; accept props or variants.
- Do not skip a11y; add ARIA labels, keyboard navigation, and semantic HTML as needed.
- Do not reimplement accessible compound behavior already provided by Ark UI without a documented
  reason.
- Do not cite missing `node_modules` as a reason to avoid declared dependencies; fix the install state
  or ask for permission.
- Do not downgrade interaction tests to `fireEvent` when `user-event` can model the user behavior.
- Do not guess Ark UI anatomy; use the configured Ark UI MCP server when composing Ark-based primitives.
- Do not export internals from the barrel.

**Full guide:** See `CONVENTION.md` section 5 for detailed patterns and examples.
