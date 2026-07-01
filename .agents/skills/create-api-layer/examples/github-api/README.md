# GitHub API Example

Example of `create-api-layer` applied to a domain-owned axios API.

## Structure

```text
github-api/
├── github-api.api-client.ts
├── github-api.constants.ts
├── github-api.query.ts
├── index.ts
├── errors/
├── types/
├── methods/
│   ├── fetch-repo-detail.ts
│   ├── fetch-repos.ts
│   ├── star-repo.ts
│   ├── unstar-repo.ts
│   └── __tests__/
│       ├── fetch-repo-detail.test.ts
│       ├── fetch-repos.test.ts
│       ├── star-repo.test.ts
│       └── unstar-repo.test.ts
└── hooks/
    ├── use-repo-detail-query.ts
    ├── use-repos-query.ts
    ├── use-star-repo-mutation.ts
    └── use-unstar-repo-mutation.ts
```

## Patterns

- Methods import `githubApiClient` directly.
- Each method lives in its own file.
- Callers do not pass a client argument.
- Methods return axios responses.
- Query options live in `github-api.query.ts` and unwrap `response.data`.
- Each hook lives in its own file and composes query options or methods.
- The client file uses `.api-client.ts`, avoiding TanStack Start `*.client.*` import protection.
