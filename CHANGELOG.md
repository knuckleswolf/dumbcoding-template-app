# Template dependency migrations

This changelog travels with `sync:agent-contract`. It records changes that need attention in projects
created from this template. Read the relevant entry before accepting an optional `package.json` merge.
The current version pins remain in `package.json`.

## 2026-09-24 — TypeScript 7, Vitest 5, jsdom 30, TanStack Table 9

### Dependency changes

| Package | Previous | Current |
| --- | --- | --- |
| `@ark-ui/react` | 5.37.2 | 5.39.2 |
| `@tailwindcss/vite`, `tailwindcss` | 4.3.1 | 4.3.3 |
| `@tanstack/react-devtools` | 0.10.7 | 0.10.13 |
| `@tanstack/react-form` | 1.33.0 | 1.33.5 |
| `@tanstack/react-pacer` | 0.22.1 | 0.23.0 |
| `@tanstack/react-query`, `@tanstack/react-query-devtools` | 5.101.1 | 5.103.2 |
| `@tanstack/react-router` | 1.170.16 | 1.170.39 |
| `@tanstack/react-router-devtools` | 1.167.0 | 1.167.2 |
| `@tanstack/react-router-ssr-query` | 1.167.1 | 1.167.3 |
| `@tanstack/react-start` | 1.168.26 | 1.168.58 |
| `@tanstack/react-table` | 8.21.3 | 9.2.4 |
| `@tanstack/react-virtual` | 3.14.3 | 3.14.13 |
| `@tanstack/router-plugin` | 1.168.18 | 1.168.40 |
| `axios` | 1.18.1 | 1.20.0 |
| `lucide-react` | 0.545.0 | 1.48.0 |
| `nitro` | 3.0.260610-beta | 3.0.260903-beta |
| `react`, `react-dom` | 19.2.7 | 19.3.0 |
| `zod` | 4.4.3 | 4.6.5 |
| `@axe-core/playwright` | 4.12.1 | 4.13.0 |
| `@playwright/test` | 1.61.1 | 1.63.0 |
| `@tanstack/devtools-vite` | 0.8.0 | 0.8.5 |
| `@tanstack/router-cli` | 1.167.17 | 1.167.38 |
| `@testing-library/dom` | 10.4.1 | 10.4.2 |
| `@testing-library/react` | 16.3.2 | 16.3.3 |
| `@testing-library/user-event` | 14.6.1 | 14.6.7 |
| `@types/react` | 19.2.17 | 19.3.0 |
| `@types/react-dom` | 19.2.3 | 19.3.0 |
| `@vitejs/plugin-react` | 6.0.3 | 6.1.1 |
| `@vitest/coverage-v8`, `vitest` | 4.1.9 | 5.0.1 |
| `@swc/core` | — | 1.16.2 |
| `dependency-cruiser` | 17.4.3 | 18.4.0 |
| `jsdom` | 28.1.0 | 30.1.1 |
| `typescript` | 6.0.3 | 7.0.2 |
| `vite` | 8.1.0 | 8.3.0 |

### Migration for existing projects

1. Review the sync dry-run and local changes. The default sync now carries this changelog. Use
   `--include-package-json` only when adopting these dependency versions. That option merges scripts
   and dependency sections; it does **not** copy `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `engines`,
   `Dockerfile`, `vite.config.ts`, or `vitest.config.ts`. Preserve project-specific configuration.
2. Set the Node runtime used by developers, CI, and container builds to a jsdom 30-supported version:
   `^22.22.2 || ^24.15.0 || >=26.0.0`. Keep this in the project's `package.json` `engines.node`.
   These are minimum supported versions within each major line, not the latest or only stable
   releases. `nvm ls` lists locally installed versions, so its `stable` alias can point to an older
   release such as 24.14.1. Install a supported Node 24 release with `nvm install 24`, or use a
   supported Node 22 release. Vite 8 and Vitest 5 have lower minima, so jsdom sets the effective
   test runtime requirement.
3. If the project uses pnpm 11, replace removed `onlyBuiltDependencies` with `allowBuilds` in
   `pnpm-workspace.yaml`. Approve the packages the project builds, including `@swc/core`, `esbuild`,
   and `lightningcss` here. Run `pnpm install` after merging `package.json` to update the lockfile;
   commit it. Use `pnpm install --frozen-lockfile` for later clean installs.
4. Run `pnpm typecheck`. TypeScript 7 is a native compiler with no stable programmatic API in 7.0.
   Replace options deprecated in 6.0 that are now errors, such as `baseUrl`, legacy
   `moduleResolution`, and `target: es5`. Specify `rootDir` and `types` explicitly where older
   defaults mattered. Check tools that import the TypeScript compiler API before upgrading them.
   This template's ES2022/bundler/no-emit configuration already typechecks with 7.0.2.
5. Run component tests. Vitest 5 clears mock call history before each test by default and fails
   unawaited promise assertions. Tests relying on cross-test mock history or `.resolves`/`.rejects`
   without `await` need updates. Keep `vitest` and `@vitest/coverage-v8` on the same version. The
   template now uses a separate `vitest.config.ts`, so its tests do not load TanStack Start/Nitro
   build plugins from `vite.config.ts`. Merge that config choice into projects whose tests encounter
   React CommonJS loading errors. Review DOM/CSS assertions under jsdom 30's newer behavior.
6. Search product code for TanStack Table v8 APIs before accepting v9. Replace `useReactTable` with
   `useTable`, register `features` explicitly (or begin with `stockFeatures`), and move row-model
   factories into `tableFeatures`. Review renamed sorting/pinning APIs and add the new `TFeatures`
   generic to table types. The template has no table implementation to migrate; derived projects
   may have many. Use the official React Table migration guide below as the detailed checklist.
7. Build and exercise the app. Vite 8 uses Rolldown/Oxc; review custom Rollup/esbuild plugins and
   output assumptions. React 19.3 and its matching type packages are updated together. Review
   imports and rendered icons after the `lucide-react` 1.x jump. Run E2E and accessibility checks.
   `dependency-cruiser` 18 cannot load TypeScript 7's compiler API, so the template uses SWC for its
   dependency graph. If copying its config, confirm that `.ts`/`.tsx` files appear in the graph;
   older configs may report a passing check after silently skipping them.
8. Define `notFoundComponent` on the root TanStack Router route if the project has no catch-all 404
   boundary. Current Router versions warn in development when an unknown URL falls back to the
   generic `Not Found` component. Use a semantic page with a route link back to a known location;
   verify that SSR returns HTTP 404 for an unknown path. The contract sync does not copy app routes.

`@swc/core` is an Apache-2.0, development-only native parser for that dependency check. It adds
platform-specific optional packages to the lockfile but does not enter the app's runtime bundle.
Revisit it once dependency-cruiser supports a TypeScript 7 compiler API.

### Sources

- [TypeScript 7 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
- [Vitest 5 migration](https://vitest.dev/guide/migration/)
- [jsdom 30 release notes](https://github.com/jsdom/jsdom/releases/tag/v30.0.0)
- [TanStack Table 9 React migration](https://tanstack.com/table/latest/docs/framework/react/guide/migrating)
- [TanStack Router not-found handling](https://tanstack.com/router/latest/docs/guide/not-found-errors)
- [Vite 8 migration](https://vite.dev/guide/migration)
- [React 19.3 release notes](https://react.dev/blog/2026/09/09/react-19-3)
- [pnpm build permissions](https://pnpm.io/settings/build#allowbuilds)
- [dependency-cruiser releases](https://github.com/sverweij/dependency-cruiser/releases)
