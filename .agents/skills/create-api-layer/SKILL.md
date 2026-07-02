---
name: create-api-layer
description: Scaffold a domain-based axios API layer with methods, types, optional query options, hooks, and tests.
---

## When To Use

Creating a new API domain at the location described by `API_CONVENTION.md`.

Read first:

- `API_CONVENTION.md`
- Relevant `CONVENTION.md` layer and naming sections
- Existing sibling API domains

Current single-app default:

- API domain: `src/lib/api/[domain]/`
- Transport: axios client in `[domain].api-client.ts`
- Query keys/options: optional `[domain].query.ts` inside the domain
- Hooks: optional `hooks/`, only when repeated component usage benefits from hooks

## Scaffold Structure

```text
[domain]/
├── [domain].api-client.ts
├── [domain].constants.ts
├── [domain].query.ts (optional)
├── index.ts
├── errors/
│   └── index.ts
├── types/
│   ├── index.ts
│   └── [module].ts
├── methods/
│   ├── index.ts
│   ├── [method-name].ts
│   └── __tests__/
│       └── [method-name].test.ts
└── hooks/ (optional)
    ├── index.ts
    ├── use-[method-name]-query.ts
    └── use-[method-name]-mutation.ts
```

Templates: `.agents/skills/create-api-layer/templates/[domain]/`

## Checklist

- [ ] Choose location per `API_CONVENTION.md`.
- [ ] Create folder `[domain]/`.
- [ ] Copy templates from `/[domain]/`.
- [ ] Replace placeholders: `{{Domain}}`, `{{domain}}`, `{{DOMAIN}}`, `{{Resource}}`, `{{Resources}}`, `{{resource}}`, `{{resources}}`, `{{methodName}}`, `{{MethodName}}`, `{{methodFileName}}`, `{{module}}`.
- [ ] Create `errors/`, `types/`, `methods/`, and optional `hooks/`.
- [ ] Rename `[domain].api-client.ts.template` and optional `[domain].query.ts.template`.
- [ ] Create one `methods/[method-name].ts` file per endpoint method. Do not group methods.
- [ ] Methods import the domain axios client directly. Do not pass `client` as an argument.
- [ ] Query keys/options stay in `[domain].query.ts` when TanStack Query is needed.
- [ ] Create one `hooks/use-[method-name]-query.ts` or `hooks/use-[method-name]-mutation.ts` file per reusable hook.
- [ ] Keep transport helpers, mock adapters, error classes, and normalization local to the domain.
- [ ] Keep `[domain].api-client.ts` focused on axios config/interceptors; move mock endpoint logic to `[domain].mock-adapter.ts`.
- [ ] Use Zod schemas for untrusted request/response payloads when runtime validation is needed; keep schemas out of `[domain].api-client.ts`.
- [ ] Update all `index.ts` barrels.
- [ ] Add method tests in `methods/__tests__/`.
- [ ] Verify no circular dependencies and no deep imports through implementation files.
- [ ] Run `biome check --write <files>` after edits.
- [ ] Run `pnpm verify` for final check.

## Pitfalls

- Do not import `methods` in `types`.
- Do not import `hooks` in `methods`.
- Do not import routes/features/components into `lib/api`.
- Do not put several endpoint methods into one `methods/[module].ts` file.
- Do not put several query/mutation hooks into one hook file.
- Do not pass axios clients into methods; the domain owns its client.
- Do not import domain request/response types into `[domain].api-client.ts` just to support mock logic.
- Do not hand-roll runtime validators when Zod fits the payload or response boundary.
- Do not put query options in a separate global `src/lib/query` folder.
- Do not share API-domain internals through `src/lib/api/internal`.
- Avoid `*.client.*` filenames in TanStack Start because they are treated as client-only modules.
- Do not use `process.env` in Vite browser code; use `import.meta.env` at the host boundary.

Full guide and examples: `API_CONVENTION.md` and `examples/`.
