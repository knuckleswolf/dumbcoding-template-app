# UI Primitive Templates

How to use these templates:

## Structure

```
[component-name]/
├── [component-name].tsx.template
├── [component-name].types.ts.template
├── index.ts.template
└── __tests__/
    └── [component-name].test.tsx.template
```

## Files

- **`[component-name].tsx`**
  - Replace `{{ComponentName}}` with PascalCase name
  - Replace `{{component-name}}` with kebab-case name
  - Export `{{ComponentName}}Root` and `{{ComponentName}}.Root`; add more slots for compound controls

- **`[component-name].types.ts`**
  - Define root/slot props by extending the target DOM or Ark part props
  - Include variant, tone, and size types
  - Add JSDoc comments

- **`index.ts`**
  - Export component + types only

- **`__tests__/[component-name].test.tsx`**
  - Uses Vitest + React Testing Library
  - Tests rendering, variants, props

## Quick start

1. Create folder: `src/ui/[component-name]/` (or `packages/ui/[component-name]/` in a multi-package repository)
2. Copy templates from `/[component-name]/`
3. Find-replace placeholders:
   - `{{ComponentName}}` → PascalCase (Button, Input, Modal)
   - `{{component-name}}` → kebab-case (button, input, modal)
4. Implement variant, tone, and size types as needed
5. Run `biome check --write <file>`

## Important

- **No domain logic:** UI primitives must be domain-agnostic.
- **No feature-specific state:** keep primitives simple.
- **Accessibility first:** add semantic HTML, labels, keyboard behavior, and visible focus.
- **Variants and sizes:** cover expected design-system use cases.
- **Tones:** expose reusable color intent such as `neutral`, `accent`, or `danger`.
- **Root props:** use DOM props only for DOM primitives; Ark primitives inherit target Ark Root/part props.
- **Slots:** for Ark compound controls, expose styled slots instead of sealing indicators/items/thumbs.
- **No options-only API:** an `options` mapper can be a convenience wrapper only after slot exports exist.
- **Tests:** test behavior, not implementation details.

## Ark Compound Pattern

For an Ark primitive, mirror the Ark anatomy:

```tsx
import { SegmentGroup } from '@ark-ui/react/segment-group';

export type SegmentedControlRootProps = SegmentGroup.RootProps & {
  size?: SegmentedControlSize;
  tone?: SegmentedControlTone;
  variant?: SegmentedControlVariant;
};

export function SegmentedControlRoot(props: SegmentedControlRootProps) {
  return <SegmentGroup.Root {...props} />;
}

export const SegmentedControl = {
  Root: SegmentedControlRoot,
  Label: SegmentGroup.Label,
  Indicator: SegmentGroup.Indicator,
  Item: SegmentGroup.Item,
  ItemControl: SegmentGroup.ItemControl,
  ItemText: SegmentGroup.ItemText,
  ItemHiddenInput: SegmentGroup.ItemHiddenInput,
};
```

Style slots with Tailwind and variant maps, but keep the caller in control of children, indicators,
items, and layout. Do not collapse this into a single `options` prop.

## Reference

- Detailed patterns: `CONVENTION.md` section 5
- Accessibility: use Playwright + `@axe-core/playwright` in E2E and manual keyboard/focus checks
- See `create-ui-primitive` SKILL.md for checklist
