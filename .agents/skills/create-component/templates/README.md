# Component Templates

How to use these templates to scaffold a new component.

## Structure

```
[component-name]/
├── [component-name].tsx.template
├── [component-name].types.ts.template
├── index.ts.template
├── __tests__/
│   └── [component-name].test.tsx.template
└── [optional-files].template
```

## File reference

**Core files (always needed):**
- **`[component-name].tsx`** — Main component implementation
  - Replace `{{ComponentName}}` with PascalCase name
  - Replace `{{component-name}}` with kebab-case name
  - Customize props and implementation

- **`[component-name].types.ts`** — Prop types
  - Define `{{ComponentName}}Props` interface
  - Keep TypeScript-only (no runtime code)

- **`index.ts`** — Barrel export
  - Exports component + types only
  - Never export internals

**Optional files (add based on component complexity):**
- **`[component-name].test.tsx`** — Basic tests
  - Uses Vitest + React Testing Library
  - Start with smoke tests, expand as needed

- **`[component-name].hooks.ts`** — Component-scoped hooks
  - Copy if component has complex internal state/logic
  - For cross-component hooks, create in shared `hooks/` layer
  - Keep focused on single responsibility

- **`[component-name].model.ts`** — Business logic
  - Copy if component has domain/calculation logic
  - Keeps logic separate from UI rendering
  - Easier to test and reuse

- **`[component-name].context.tsx`** — React context provider
  - Copy if multiple descendants need shared state
  - Alternative to prop drilling
  - Usually combined with custom hook

- **`[component-name].schema.ts`** — Validation
  - Copy if component needs data validation
  - Use Zod, Valibot, or similar
  - Share validation between client and server

## Component type matrix

| Type | `.tsx` | `.types.ts` | `.hooks.ts` | `.model.ts` | `.context.tsx` | `.schema.ts` | `.test.tsx` |
|------|--------|-----------|-----------|-----------|---------------|-----------|-----------|
| **UI Primitive** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Layout** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Feature** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Composite** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Container** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

> See `CONVENTION.md` § 5 for detailed component taxonomy.

## Quick start

1. Create folder: `src/components/[component-name]/` for shared app components or the relevant `src/features/[feature]/` subtree for feature-local components
2. Copy templates from `/[component-name]/`
3. Find-replace placeholders:
   - `{{ComponentName}}` → PascalCase
   - `{{component-name}}` → kebab-case
4. Remove `.template` suffix from filenames
5. Delete template comments and placeholder implementation
6. Implement your component logic
7. Run `biome check --write <file>`

## Examples

See `examples/` folder for real-world implementations:
- `repository-card/` — Product-ready composite component with business logic, hooks, and `__tests__`
- Compare against UI primitives in `../create-ui-primitive/examples/badge/`

## Reference

For detailed patterns, naming conventions, and dependency direction, see:
- `CONVENTION.md` § 5 for component architecture
- `SKILL.md` for scaffold checklist
