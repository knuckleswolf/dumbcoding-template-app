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

- **`[component-name].types.ts`**
  - Define props interface
  - Include variant and size types
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
4. Implement variant and size types as needed
5. Run `biome check --write <file>`

## Important

- **No domain logic:** UI primitives must be domain-agnostic.
- **No feature-specific state:** keep primitives simple.
- **Accessibility first:** add ARIA labels and semantic HTML when needed.
- **Variants and sizes:** cover expected design-system use cases.
- **Tests:** test behavior, not implementation details.

## Reference

- Detailed patterns: `CONVENTION.md` section 5
- Accessibility: Use axe-core or manual checks
- See `create-ui-primitive` SKILL.md for checklist
