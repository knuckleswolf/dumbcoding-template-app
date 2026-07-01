# AI Style Guide

This guide defines how code should be written, reviewed, and evolved by humans and AI agents.

It complements:

- `CONVENTION.md` - folders, layers, boundaries
- `API_CONVENTION.md` - API clients and query integration
- `AGENTS.md` - strict agent workflow and verification
- Biome and TypeScript config - executable repo contract

## Communication Format

When replying after non-trivial work:

1. Plan - 3 to 7 bullets, include relevant files.
2. Changes - what changed per file or area.
3. Verification - commands run and results.
4. Risks/follow-ups - short and concrete.

Be concise. Do not restate full repo docs; reference them.

## Type Safety And Correctness

- No `any`. Prefer `unknown` plus validation or typed adapters.
- Avoid unsafe assertions. If unavoidable, isolate and justify.
- No non-null assertions `!`. Prefer checks, early returns, and explicit invariants.
- Prefer `satisfies` for object literals where it improves type checking.
- Keep external input untrusted until validated.

## React Quality Bar

- `ui/` primitives are domain-agnostic and accessible.
- `components/` are shared app components and may be domain-aware.
- `features/` own workflow-specific composition and state.
- Prefer composition over inheritance.
- Keep props small and predictable.
- Keep route/app host files thin.

## Data And Networking

- Prefer project-owned API client contracts over leaking transport details.
- Use `fetch` or an existing project client unless a dependency is explicitly justified.
- Support `AbortSignal` for cancellable network operations.
- Normalize errors at API boundaries.
- TanStack Query owns server-state caching. Use stable query keys and invalidate on mutations.
- Avoid ad-hoc server-state caches unless keys, invalidation, TTL, bounds, and stampede behavior are defined.

## Algorithms And Data Structures

When logic is non-trivial:

- Choose appropriate structures such as `Map`, `Set`, queues, or indexes.
- Keep the implementation readable unless performance is a real constraint.
- Mention complexity briefly when it affects the design.

## Retries And Timeouts

Before adding retry, confirm the operation is safe to retry.

Strategies:

- Fixed delay for simple local polling.
- Exponential backoff for network retry.
- Backoff plus jitter under contention.

Rules:

- Define max attempts and retry budget.
- Stop on cancellation through `AbortSignal`.
- Do not retry deterministic errors, especially most 4xx responses except cases such as 408 or 429.

## Security

- Treat external input as untrusted; validate with Zod or a typed adapter where appropriate.
- Avoid `dangerouslySetInnerHTML` unless content is sanitized.
- Never log secrets.
- Use safe platform crypto primitives; do not invent crypto.
- Do not store production auth secrets in browser-local demo storage.

## JS/TS Deep Competence

Agents should understand:

- classes, prototypes, property descriptors
- Proxy/Reflect/Observer patterns when justified
- type coercion rules and numeric pitfalls
- bitwise operations as 32-bit signed operations

If using Proxy, Reflect, crypto, or bitwise operations, include a short rationale in the final report.

## Compatibility

Baseline: ES2022. If stricter browser, runtime, or platform constraints exist, comply with them. Add polyfills only when necessary and justified.

## Testing

- Unit: Vitest.
- Component: React Testing Library.
- E2E/browser: only for critical flows or behavior that requires a browser.
- Coverage should be meaningful for changed or high-risk code.
