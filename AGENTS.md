# Agent Playbook (Codex / Claude Code / Cursor)

Repository-specific rules for coding agents working in this template.

## 1) Repo Facts

- This repository is an application template, not a product-specific codebase.
- Source of truth for runtime/tool versions: `package.json`.
- Package manager: use `pnpm`. Do not introduce a new lockfile.
- Prepare install command: `pnpm install --frozen-lockfile`.
- TypeScript baseline: strict mode, ES2022, bundler module resolution, isolated modules, no emit.
- Lint/format: Biome.
- Current app host: Vite + TanStack Start/Router.
- Current UI/data stack: React 19, TanStack Query/Form/Table/Virtual/Pacer, Tailwind CSS 4, Ark UI, Vitest.
- Keep framework-specific assumptions inside the app host layer. The template should be able to move to Next.js or another React host while keeping a close folder model.

## 2) Cognitive Load Budget

Keep mandatory context small and predictable.

| File | Target limit | Purpose |
| --- | ---: | --- |
| `AGENTS.md` | 200 lines | Agent workflow, invariants, verification, doc policy. |
| `CONVENTION.md` | 260 lines | Architecture, layers, naming, file structure. |
| `API_CONVENTION.md` | 260 lines | API/query structure and examples. |
| `AI_STYLEGUIDE.md` | 200 lines | Quality bar, communication, review posture. |
| `docs/brief.md` | 180 lines | Reusable product intake guide. |
| `docs/product.md` | 180 lines | Created during intake; current product logic only. |
| Skill `SKILL.md` | 130 lines each | Trigger, scaffold contract, checklist, pitfalls. |

Do not create new Markdown files by default. Add a doc only when the topic is durable, repeatedly useful, and too large for the existing file. Exceptions: create `docs/product.md` during project intake and feature notes after approval. Prefer updating an existing doc over creating a sibling.

## 3) Read Before Non-Trivial Work

- `CONVENTION.md`
- `AI_STYLEGUIDE.md`
- `package.json` scripts
- Relevant local `tsconfig.json` or `tsconfig*.json` files
- `API_CONVENTION.md` when touching API clients, query keys, or server-state integration
- `SEO.md` only when touching SEO, sitemap, robots, metadata, indexing, `llms.txt`, or public SSR/prerendering behavior
- `docs/brief.md` when running first product intake
- `docs/product.md` if it exists and product behavior matters

You do not need to read every doc for a tiny local change if the needed invariants are already clear.

## 4) Product Context Boundary

Do not put product flows, mock tokens, credentials, or business state machines in `AGENTS.md`, `CONVENTION.md`, or skills. Reusable intake guidance belongs in `docs/brief.md`; create `docs/product.md` during intake for product-specific context.

Agent and skill docs must describe reusable architecture and workflow. If a future template consumer removes the demo product, these instructions should still be valid.

## 5) Required Invariants

- Respect architecture boundaries and dependency direction from `CONVENTION.md`.
- Components and UI primitives must not import from `src/features/*`; pass feature state/actions via props or move stable shared contracts to `src/lib` or `src/types`.
- `src/lib` and `src/utils` contain no UI; `utils` are environment-agnostic helpers, while `lib` may depend on project/runtime context.
- `src/layouts` contains screen skeletons; layouts accept `children` only for target content and must not receive structural slots as props.
- Export public APIs through `index.ts` barrels when a folder is a reusable module boundary.
- Avoid deep imports when a public `index.ts` exists, except explicit `internal/` modules.
- Do not introduce circular dependencies. Use `pnpm check:circular` when dependency graph changes are relevant.
- No `any`, no non-null assertion `!`, no parameter reassignment.
- Use `import type` where applicable.
- Use `import.meta.env` for Vite client environment variables. Do not use `process.env` in browser code.
- Keep compatibility with ES2022 and any repo-defined platform targets.
- Keep UI accessible. Use Playwright + `@axe-core/playwright` in E2E for automated accessibility checks; do not rely on hardcoded contrast scripts.
- Use Tailwind utilities for feature/component styling. Keep global CSS limited to Tailwind import, tokens, base elements, and app-shell primitives; do not add feature-specific selector blocks to `src/styles.css`.
- Do not commit secrets. Keep local secrets in `.env.local` or deployment secret stores; commit only `.env.example`.
- Do not suppress `lint/nursery/noExcessiveLinesPerFile` to avoid decomposition. `biome-ignore` for this rule is allowed only for mock data, generated files, large schemas, or configuration files, and must include a concrete reason.

## 6) Workflow

1. Prepare the workspace: run `pnpm install --frozen-lockfile` before project intake, planning, design, or implementation. Treat prepare as a blocking gate: do not start intake, product decisions, planning, design, or implementation while install is still running or retrying. If install fails or stalls on network/sandbox access, request permission immediately instead of doing parallel product work.
2. Define the goal, acceptance criteria, scope boundaries, and affected layers.
3. Check existing capabilities in `package.json` before implementing primitives, state, forms, lists, routing, async data, tables, virtualization, throttling/debouncing, or accessibility behavior by hand.
4. Before implementing any route-screen, screen-sized UI, or feature, plan top-down and build bottom-up: route-screen > layout shell > feature capability/entry > product component > UI primitive > Ark UI > native DOM. Write the layer/dependency map first; do not put the full screen DOM tree in one route or feature file.
5. If a required dependency is declared in `package.json` but missing from `node_modules` or cannot be resolved, run `pnpm install --frozen-lockfile` or request permission to install. Do not downgrade architecture, hand-roll behavior, or choose native/custom controls solely because dependencies are not installed locally.
6. Keep the diff minimal. Do not refactor adjacent code without a task-driven reason.
7. After editing code, run `pnpm exec biome check --write <file>` when practical.
8. Final verification:
   - code, config, build-graph, or tooling changes: run `pnpm verify -- <changed files...>`
   - agent instruction, skill, template, or agent-doc changes: run `pnpm test:agents`
   - docs-only changes: full runtime verification may be skipped, but say so explicitly
   - broad dependency/config changes: run `pnpm verify:all` when the current repo shape supports all targets
9. Report changed files, behavior, verification, and remaining risks or follow-ups.

## 6.1) Project Intake And Feature Threads

- Before first product implementation, run the `project-intake` skill using `docs/brief.md`, then create `docs/product.md` with approved product context.
- If the agent surface supports Plan mode or structured user input, run the first intake round there immediately before code changes; otherwise ask the same 3-option quiz in chat and wait.
- Keep project intake inside one dialogue: ask focused question rounds, summarize decisions, then continue with the next round instead of waiting for a new prompt.
- Use choice-first intake for ambiguous product, interface, visual, color-scheme, MVP-depth, and risk questions: offer three concrete options, recommend one when useful, and let the user override.
- After the first implementation, propose a short next-step product-development path so the user is not left without direction.
- Create one separate chat/thread per approved feature.
- Record each feature briefly in `docs/features/<feature-slug>-<number>.md`.
- Feature slugs use lowercase `kebab-case`; numbers are three digits in approval order.
- Every feature thread must produce a plan first. Implement only after that plan is approved.
- Keep product decisions in `docs/product.md` or the relevant feature note, not in agent rules or skills.

## 7) Testing

- Add or update tests for meaningful functionality changes.
- Unit/component tests use Vitest and React Testing Library.
- Use `@testing-library/user-event` for user interactions such as click, type, tab, select, pointer, and keyboard flows. Use `fireEvent` only for low-level events that `user-event` cannot express well.
- Coverage uses Vitest V8 coverage through `pnpm test:coverage`; meaningful code changes should keep coverage above configured thresholds.
- Browser/E2E tests use `@playwright/test` in `e2e/*.spec.ts`.
- Accessibility checks use `@axe-core/playwright` inside Playwright tests. Follow the Playwright accessibility testing model: navigate to the target state, run `new AxeBuilder({ page }).analyze()`, assert no unexpected violations, and scope/disable rules only with a documented reason. Use the Playwright accessibility guide (`https://playwright.dev/docs/accessibility-testing`) and the `@axe-core/playwright` package docs (`https://www.npmjs.com/package/@axe-core/playwright`) as references.
- Axe finds many accessibility problems but not all of them; still use semantic HTML, keyboard checks, visible focus, labels, and human review for important flows.
- Follow existing repo conventions for test placement and naming from `CONVENTION.md`.

## 8) Multi-Agent

- The coordinating agent owns planning, shared files, integration, and final verification.
- Delegate only disjoint write sets by file, package, module, or feature boundary.
- Shared barrels, root configs, route trees, docs, and merge points stay with the coordinator unless explicitly assigned.
- Explorers are read-only. Workers should run only local formatting/checks for files they changed.

## 9) Dependencies

- Do not add or update dependencies without justification on maintenance, license, security, bundle/runtime impact, and transitive size.
- Pin dependency versions exactly in `package.json`. Do not use `latest`, `^`, or `~`.
- Use `pnpm add <pkg>@<version> --save-exact` for dependency changes. Use plain `pnpm install` only when intentionally reconciling `package.json` with `pnpm-lock.yaml`.
- Audit dependency freshness every few weeks or after meaningful template changes; update intentionally in a dedicated dependency-maintenance change.
- Prefer existing stack capabilities before adding a package or writing custom infrastructure.
- Missing `node_modules` is an environment setup issue, not a reason to bypass installed stack decisions from `package.json`.
- Use Ark UI through `src/ui/*` primitives for accessible interactive controls: select, combobox, tabs, dialog, popover, menu, tooltip, checkbox, radio group, slider, progress, pagination, accordion, and related controls. Native elements require a documented exception.
- UI primitives are styled slot APIs, not sealed product controls: preserve Ark slot composition, derive wrapper props from Ark/root component props, and expose child/indicator/thumb/item slots instead of hardcoding DOM structure. Variants, tones, and sizes style slots; an `options` mapper can be only an optional convenience wrapper after the slot API exists.
- Repeated fields, panels, cards, icon buttons, action bars, and control groups must become `src/ui/*` primitives before feature/component reuse.
- Use TanStack Query for server state, TanStack Form for non-trivial forms, TanStack Table for table/grid behavior, TanStack Virtual for large lists, and TanStack Pacer for debounced/throttled interactions.
- Use Zod for runtime validation schemas when validating route search params, form values, API payloads/responses, env-derived config, or persisted user input. Prefer `.schema.ts` files for reusable schemas.
- Ark UI MCP is configured for this project. Before implementing Ark-based primitives/components, use it for component lists, anatomy, parts, and implementation guidance.

## 10) Skills

Reuse matching skills from `.agents/skills/*` when they fit the task.

| Skill | When | Templates | Read First |
| --- | --- | --- | --- |
| `create-api-layer` | New API domain or backend gateway | `.client.ts`, `.constants.ts`, `methods`, `types`, optional `hooks` | `API_CONVENTION.md` |
| `create-feature` | New or changed product capability spanning routes, components, API, hooks, models, utils, or tests | feature core, capability map, cross-layer plan | `CONVENTION.md` sections 2, 5, 8 |
| `create-route-screen` | New or changed route-level screen | route file, layout shell, decomposition map, feature/component plan | `CONVENTION.md` sections 2, 5, 8 |
| `create-component` | Reusable product component in `src/components/*` | `.tsx`, `.types.ts`, `.test.tsx`, optional `.hooks.ts`, `.context.tsx`, `.model.ts`, `.schema.ts` | `CONVENTION.md` section 5 |
| `create-ui-primitive` | Domain-agnostic UI primitive | `.tsx`, `.types.ts`, `.test.tsx` | `CONVENTION.md` sections 4-5 |
| `project-intake` | First product briefing, scope discovery, feature extraction | create docs/product, feature candidates | `docs/brief.md` |
| `seo` | SEO, sitemap, robots, metadata, indexing, `llms.txt`, or public SSR/prerendering | task-specific | `SEO.md` |
