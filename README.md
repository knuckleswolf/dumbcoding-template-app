# Dumbcoding Application Template

Neutral application template for Vite, TanStack Start/Router, React, Tailwind CSS, Biome, Vitest,
and the repository agent workflow.

## Getting Started

```bash
pnpm install --frozen-lockfile
pnpm dev
```

The app runs on port `3000` by default.

## Prepare Phase

Run `pnpm install --frozen-lockfile` before project intake, planning, design, implementation, or
verification. Missing `node_modules` is setup work, not a reason to bypass dependencies declared in
`package.json`. Use plain `pnpm install` only when intentionally updating `pnpm-lock.yaml` after a
dependency change. Prepare is a blocking gate: if install is still running, retrying, or waiting for
network/sandbox permission, do not start intake, product decisions, planning, design, or
implementation in parallel.

## First Project Intake

Before implementation starts, run the `project-intake` skill and capture the resulting product brief
in `docs/product.md`. The briefing should happen immediately as guided, choice-first question rounds
in one dialogue. When the agent surface supports structured input or Plan mode, use it like a short
3-option quiz with a recommended default before feature planning.

Each approved feature gets its own feature thread and a short file under `docs/features/` named
`<feature-slug>-<number>.md`, for example `user-onboarding-001.md`. Start every feature with a plan;
implement only after that plan is approved.

## Project Shape

- `src/routes` contains TanStack route-screens: route host logic plus decomposed screen composition.
- `src/integrations` contains runtime provider wiring.
- `src/features` contains product capabilities/workflows, not whole screen DOM trees.
- `src/components` contains reusable product components.
- `src/ui` contains domain-agnostic UI primitives.
- `CONVENTION.md` defines layers, naming, module boundaries, and file structure.
- `API_CONVENTION.md` defines API domain and TanStack Query conventions.
- `docs/product.md` is the place for product-specific decisions after a project is created.
- `docs/features/` contains short notes for approved feature threads.
- `.agents/skills/*` contains scaffolding contracts for new components, UI primitives, and API layers.
- `SEO.md` is a situational policy for SEO, sitemap, robots, metadata, indexing, and public SSR work;
  use the `seo` skill before loading it.
- Ark UI MCP is configured in `.codex/config.toml` and `.vscode/mcp.json`; use it as the primary
  reference for Ark UI component anatomy and component lists.

## Scripts

```bash
pnpm generate-routes
pnpm build
pnpm start
pnpm test
pnpm test:coverage
pnpm test:e2e
pnpm test:a11y
pnpm lint
pnpm format
pnpm verify -- <changed files...>
pnpm verify:all
```

Use `pnpm verify -- <changed files...>` after code, config, build-graph, or tooling changes. Use
`pnpm test:agents` after changing agent skills or their templates.

## Secrets And Environment

- Commit `.env.example` with safe placeholder values only.
- Keep local secrets in `.env.local`; it is ignored by git.
- Store production/staging secrets in the deployment platform secret manager.
- Vite browser variables must use the `VITE_` prefix and must be safe to expose to users.
- Server-only secrets must never be read from browser code or included in `VITE_` variables.
- Do not log secrets, paste them into docs, or add mock production credentials to agent instructions.

## Container Build

```bash
docker build -t dumbcoding-template-app .
docker run --rm -p 3000:3000 dumbcoding-template-app
```

The image is deployment-provider agnostic. Override `PORT` and `HOST` at runtime when your target
platform requires different values.

The template follows the TanStack Start Vite Node.js/Docker hosting pattern with Nitro. `pnpm build`
creates Nitro output under `.output`, and `pnpm start` runs `.output/server/index.mjs`.

## Adding Product Code

Before adding implementation, read `AGENTS.md`, `CONVENTION.md`, `AI_STYLEGUIDE.md`, and the
relevant local `tsconfig.json`. Read `API_CONVENTION.md` when touching API clients, query keys, or
server-state integration.

Use the matching skill from `.agents/skills/*` when creating a feature, route-screen, reusable
component, UI primitive, or API domain. Keep route files compositional and put product-specific
workflows in the appropriate layer.

## Dependency Maintenance

Dependencies are pinned exactly in `package.json`. Do not use `latest`, `^`, or `~`. Audit versions
in a dedicated maintenance change every few weeks or after important template changes.
