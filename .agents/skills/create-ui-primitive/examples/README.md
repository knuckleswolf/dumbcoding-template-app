# UI Primitive Examples

Real-world examples of `create-ui-primitive` skill applied to actual primitives.

## badge

A simple Badge UI primitive demonstrating:

- **Placeholders replaced:**
  - `{{ComponentName}}` → `Badge`
  - `{{component-name}}` → `badge`

- **Structure:**
  - `badge.tsx` — Root slot implementation with namespace-style export
  - `badge.types.ts` — TypeScript types
  - `__tests__/badge.test.tsx` — Behavior tests
  - `index.ts` — Barrel export

- **Patterns:**
  - Slot-first API: `Badge.Root`
  - Variant, tone, and size styling
  - No internal state
  - Root props derived from the target element props

## How to use

1. Copy structure for your primitive
2. Replace `badge`/`Badge` with your primitive name
3. Add Ark slots when the primitive wraps an Ark compound control
4. Update variants, tones, and sizes based on your design system
5. Run `biome check --write` after edits

See `../../SKILL.md` for full checklist.
