# UI Primitive Examples

Real-world examples of `create-ui-primitive` skill applied to actual primitives.

## badge

A simple Badge UI primitive demonstrating:

- **Placeholders replaced:**
  - `{{ComponentName}}` → `Badge`
  - `{{component-name}}` → `badge`

- **Structure:**
  - `badge.tsx` — Component implementation (minimal, no hooks/context)
  - `badge.types.ts` — TypeScript types
  - `__tests__/badge.test.tsx` — Behavior tests
  - `index.ts` — Barrel export

- **Patterns:**
  - Pure presentation component
  - Variant-driven styling
  - No internal state
  - Simple props interface

## How to use

1. Copy structure for your primitive
2. Replace `badge`/`Badge` with your primitive name
3. Keep implementation minimal (no hooks, no context)
4. Update variants based on your design system
5. Run `biome check --write` after edits

See `../../SKILL.md` for full checklist.
