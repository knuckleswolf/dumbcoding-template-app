# Component Examples

Real-world examples of `create-component` skill applied to product-ready components.

## repository-card

A production-grade RepositoryCard component demonstrating enterprise patterns:

- **Placeholders replaced:**
  - `{{ComponentName}}` → `RepositoryCard`
  - `{{component-name}}` → `repository-card`

- **Structure:**
  - `repository-card.tsx` — Component implementation (composition)
  - `repository-card.types.ts` — TypeScript types and interfaces
  - `repository-card.model.ts` — Business logic (formatting, calculations)
  - `hooks/use-repository-card.ts` — Custom hook for complex state/logic
  - `__tests__/repository-card.test.tsx` — Comprehensive tests (8+ cases)
  - `index.ts` — Barrel export (public API)

- **Patterns demonstrated:**
  - **Composition:** Uses primitives (badges, buttons, tags)
  - **Business logic:** Star formatting (1500 → 1.5K), popularity detection
  - **Custom hooks:** `useRepositoryCard()` for state and callbacks
  - **Type safety:** Comprehensive prop types + metadata types
  - **Accessibility:** Semantic HTML (role, tabIndex, onClick handlers)
  - **Variants:** Visual states (default/featured), sizes (compact/standard)
  - **Loading states:** Action button with loading feedback
  - **Testing:** Unit tests with Vitest + React Testing Library

## Key differences from UI primitives

- **UI Primitive** (Badge): Pure presentation, single responsibility
- **Product Component** (RepositoryCard): Composes multiple elements, includes logic

## How to use this example

1. Copy entire `repository-card/` folder structure
2. Replace all `repository-card`/`RepositoryCard` with your component name
3. Update business logic in `.model.ts` for your domain
4. Implement hooks in `hooks/` as needed
5. Add or update tests in `__tests__/`
6. Update barrel exports in `index.ts`
7. Run `biome check --write` after edits

## Real-world patterns

- Model functions separate from component (testable logic)
- Hooks encapsulate complex behavior
- Barrel exports create clean public API
- Generous TypeScript types prevent bugs
- Tests document component behavior

See `../../SKILL.md` for decision tree and when to include optional files.
