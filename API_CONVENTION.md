# API Layer Convention

Template for domain-based API clients, axios transport, and TanStack Query integration.

## Repository Shapes

Choose the pattern based on repository shape from `CONVENTION.md`.

### A) Single-App Repository

```text
src/
├── lib/
│   └── api/
│       └── [domain]/
│           ├── [domain].api-client.ts
│           ├── [domain].constants.ts
│           ├── [domain].query.ts        # optional
│           ├── errors/
│           ├── types/
│           ├── methods/
│           ├── hooks/                   # optional
│           └── index.ts
├── features/
└── routes/ or app/
```

For a tiny domain, a flatter `src/lib/api/[domain].ts` can be acceptable. Use the folder shape once the domain needs a client, methods, errors, types, hooks, tests, or query options.

### B) Multi-App Or Package Repository

App-specific API domains live under `apps/[app]/src/lib/api/[domain]/`.
Reusable API packages live under `packages/[api-name]/src/[domain]/`.

Do not import app routes, features, components, or host-specific modules into reusable API packages.

## Internal Structure

```text
[domain]/
├── index.ts
├── [domain].api-client.ts
├── [domain].constants.ts
├── [domain].query.ts
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
└── hooks/
    ├── index.ts
    ├── use-[method-name]-query.ts
    └── use-[method-name]-mutation.ts
```

`[domain].query.ts` is required when TanStack Query reads from the domain. `hooks/` is required
when UI code repeatedly uses a query or mutation from the domain. Keep methods, keys, query
options, and hooks inside the API domain so they evolve together.

## Naming

| Element | Pattern | Example |
| --- | --- | --- |
| Domain folder | `[domain]` or `[domain]-api` | `github-api`, `orders` |
| Client file | `[domain].api-client.ts` | `github-api.api-client.ts` |
| Constants file | `[domain].constants.ts` | `orders.constants.ts` |
| Query file | `[domain].query.ts` | `orders.query.ts` |
| Types file | `[module].ts` | `projects.ts`, `auth.ts` |
| Method file | `[method-name].ts` | `fetch-projects.ts`, `create-project.ts` |
| Query hook | `use-[method-name]-query.ts` | `use-fetch-projects-query.ts` |
| Mutation hook | `use-[method-name]-mutation.ts` | `use-create-project-mutation.ts` |

## Dependencies

```text
hooks -> query or methods
query -> methods
methods -> api-client/errors/types
api-client -> errors/types/constants
types -> nothing
```

Forbidden:

- `types -> methods`
- `methods -> hooks`
- `methods -> routes`
- `lib/api -> features`
- `api-domain -> shared api/internal layer`
- deep imports when a barrel exists

Each API domain is autonomous. Do not introduce a shared `src/lib/api/internal` layer for
transport, errors, mock adapters, response normalization, or request helpers. If two domains
look similar, duplicate the small local adapter code until there is a real cross-domain platform
contract outside `lib/api`.

## Client Contract

Each API domain owns one configured axios client. Methods import that domain client directly; callers do not pass a client argument.
Keep `*.api-client.ts` focused on axios configuration, interceptors, and adapter wiring. Do not
put endpoint simulation, payload validation, or response fixtures in the client file. If the
template needs demo/mock behavior, place it in a domain-local file such as
`[domain].mock-adapter.ts`; request/response types can be used there, not in the client config.

```typescript
import axios from 'axios';

export const resourcesApiClient = axios.create({
  baseURL: import.meta.env.VITE_RESOURCES_API_BASE_URL ?? '/',
  withCredentials: true,
  validateStatus: (status) => status >= 200 && status < 300,
});
```

For Vite client code, read environment variables from `import.meta.env`. Do not use `process.env` in browser code. If the app moves to another host, adapt only the host/env boundary.

## Runtime Validation

Use Zod for runtime validation when API data crosses a trust boundary: request payloads, external
responses, webhook/event payloads, persisted values, or env-derived config. Keep reusable schemas in
domain-local schema files or near the owning method; do not put schemas in `[domain].api-client.ts`.
Derive TypeScript types from schemas when a schema is the source of truth.

## Methods

Each method lives in its own file. Do not group multiple endpoints in `methods/[module].ts`.
Methods return axios promises and accept only domain input plus optional `AxiosRequestConfig`.

```typescript
import type { AxiosRequestConfig } from 'axios';

import { resourcesApiClient } from '../resources.api-client';
import type { Resource } from '../types';

export const fetchResources = (config: AxiosRequestConfig = {}) =>
  resourcesApiClient.get<Array<Resource>>('resources', config);
```

```typescript
// methods/create-resource.ts
import type { AxiosRequestConfig } from 'axios';

import { resourcesApiClient } from '../resources.api-client';
import type { Resource, ResourceInput } from '../types';

export const createResource = (
  { data, ...config }: AxiosRequestConfig<ResourceInput> = {},
) => resourcesApiClient.post<Resource>('resources', data, config);
```

## Query Keys And Options

```typescript
import { queryOptions } from '@tanstack/react-query';

import { fetchResources } from './methods';

export const resourcesQueryKeys = {
  all: ['resources'] as const,
  list: () => [...resourcesQueryKeys.all, 'list'] as const,
};

export const resourcesQueryOptions = () =>
  queryOptions({
    queryKey: resourcesQueryKeys.list(),
    queryFn: async ({ signal }) => {
      const response = await fetchResources({ signal });
      return response.data;
    },
  });
```

## Exports

```typescript
export * from './methods';
export * from './[domain].constants';
export * from './[domain].query';
export type * from './types';
export { [domain]ApiClient, create[Domain]ApiClient, type [Domain]ApiClient } from './[domain].api-client';
```

## Checklist

- [ ] Types live in `types/` without runtime code.
- [ ] Every method has its own file in `methods/`.
- [ ] Methods import the domain axios client and do not accept a client argument.
- [ ] Query keys are hierarchical, stable, and colocated in the API domain.
- [ ] Every reusable query/mutation hook has its own file in `hooks/`.
- [ ] Zod schemas cover untrusted request/response payloads when runtime validation is needed.
- [ ] Hooks use query options or methods with correct invalidation.
- [ ] Public exports go through `index.ts` barrels.
- [ ] No circular dependencies.
- [ ] No route/component imports from `lib/api`.
- [ ] Tests cover method behavior and error normalization.

## Deviations

Document durable deviations in the closest module README only when useful. Do not create broad new docs for one-off exceptions.
