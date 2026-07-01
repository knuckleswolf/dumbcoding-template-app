# API Layer Templates

Use these templates to scaffold a domain-based axios API layer.

## Structure

```text
[domain]/
├── [domain].api-client.ts.template
├── [domain].constants.ts.template
├── [domain].query.ts.template
├── index.ts.template
├── errors/index.ts.template
├── types/
│   ├── index.ts.template
│   └── [module].ts.template
├── methods/
│   ├── index.ts.template
│   ├── [method-name].ts.template
│   └── __tests__/
│       └── [method-name].test.ts.template
└── hooks/ (optional)
    ├── index.ts.template
    ├── use-[method-name]-query.ts.template
    └── use-[method-name]-mutation.ts.template
```

## Quick Start

1. Create `[location]/[domain]/`.
2. Copy templates from `/[domain]/`.
3. Replace placeholders in all files.
4. Duplicate method and hook templates once per method/hook.
5. Remove `.template` suffixes.
6. Update barrels.
7. Implement endpoints, types, tests, and optional query hooks.
8. Run `biome check --write <files>`.

## Placeholders

| Placeholder | Example | Usage |
| --- | --- | --- |
| `{{Domain}}` | `GithubApi` | Type names and factories |
| `{{domain}}` | `githubApi` | Variables and filenames |
| `{{DOMAIN}}` | `GITHUB_API` | Environment variable names |
| `{{Resource}}` | `Repo` | Single entity type |
| `{{Resources}}` | `Repos` | Plural entity type/function |
| `{{resource}}` | `repo` | Single query option name |
| `{{resources}}` | `repos` | Plural query option name |
| `{{methodName}}` | `fetchRepo` | Method variable name |
| `{{MethodName}}` | `FetchRepo` | Hook type/function fragments |
| `{{methodFileName}}` | `fetch-repo` | Method and hook file names |
| `{{module}}` | `repos` | Type module file names |

## Rules

- Transport is axios.
- The domain owns its axios client in `[domain].api-client.ts`.
- Each method file exports exactly one endpoint method.
- Methods import the domain client directly.
- Query keys/options live in `[domain].query.ts`.
- Each hook file exports exactly one query or mutation hook.
- Hooks compose query options or methods.

See `examples/` and `API_CONVENTION.md` for complete patterns.
