# Feature Planning Notes

Create one file per approved feature after the `docs/brief.md` intake is complete and `docs/product.md`
has been created with the approved product context.
Feature notes are intentionally short and should not replace tests, API contracts, or source code.

## Naming

Use this pattern:

```text
docs/features/<feature-slug>-<number>.md
```

- `<feature-slug>` uses lowercase `kebab-case`, starts with a letter, and contains only letters,
  numbers, and hyphens.
- `<number>` is a three-digit sequence in the order features are approved: `001`, `002`, `003`.
- Do not rename existing feature files after implementation starts. If scope changes materially,
  append a dated note inside the same file.

Examples:

- `docs/features/user-onboarding-001.md`
- `docs/features/billing-settings-002.md`
- `docs/features/admin-audit-log-003.md`

## Thread Workflow

- Create a separate chat/thread for each feature.
- The coordinating thread owns shared files, route tree updates, root configs, docs, and final
  verification.
- A feature thread must first produce a plan. Implementation starts only after that plan is approved.
- Keep implementation scoped to the approved feature. New shared abstractions need explicit rationale.

## File Template

```markdown
# <Feature Name> <number>

## Summary

- User outcome:
- Primary users:
- Status: planned | approved | in-progress | shipped | paused
- Owning thread:

## Scope

- In:
- Out:
- Dependencies:

## Plan

- Approach:
- Affected layers:
- API/endpoints:
- Data/state:
- UI/accessibility:

## Acceptance Criteria

- List observable outcomes required for approval.
- Include user-facing behavior, data/API expectations, accessibility requirements, and edge cases.

## Verification

- List commands, tests, browser checks, and manual QA needed before shipping.
- Include `pnpm verify -- <changed files...>` and feature-specific unit/component/E2E checks.

## Decisions

- Record durable decisions, tradeoffs, and follow-ups discovered during planning or implementation.
- Keep this concise; move broad product context to `docs/product.md`.
```
