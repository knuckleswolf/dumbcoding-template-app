---
name: project-intake
description: Run the first product briefing as a guided questionnaire and turn answers into product context plus feature candidates.
---

## When to use

Use before the first product implementation in a project created from this template. Trigger when the
user asks to start a new app, define product scope, create the first features, or fill `docs/product.md`.

**Read first:** `docs/product.md`, then `AGENTS.md` section 6.1.

## Interview Rules

- Run only after prepare succeeds. If `pnpm install --frozen-lockfile` is still running, retrying,
  or blocked by network/sandbox access, stop and request permission; do not run intake in parallel.
- Keep the briefing in one dialogue. Do not make the user send a second prompt for obvious follow-up
  questions.
- Start with structured choices immediately. If the agent surface supports Plan mode or a structured
  user-input tool, use it before writing product code. If it is unavailable, emulate the same quiz in
  chat and wait for answers.
- Ask one focused round at a time. Prefer 3-6 questions per round.
- Use choice-first questions: offer exactly 3 concrete options when practical, mark one as
  recommended, and allow a custom answer. This gives the user control without forcing them to invent
  everything from scratch.
- Generate options from the current user context, audience, domain, user task, risk profile, usage
  environment, and stated constraints. Do not reuse fixed generic labels when they do not fit.
- If a structured user-input tool is available, use it for 1-3 high-leverage questions per round:
  product mode, interface direction, visual style, MVP depth, or risk focus.
- After each round, summarize captured decisions and unknowns, then continue to the next round.
- Do not invent requirements silently. Mark assumptions as assumptions.
- Do not skip the briefing just because the first prompt contains product and visual hints.
- Do not create feature files or implementation plans until the user has made the key product,
  interface, and scope choices.
- Do not replace structured intake with a long "confirm this direction" paragraph. Ask selectable
  questions first, then summarize.

## Generating Choices

For each question, synthesize three context-specific options:

- Recommended option: the safest fit for the user's stated goal, audience, domain, and constraints.
- Alternative option: a plausible different direction with a clear tradeoff.
- Stretch option: a more ambitious or differentiated direction if the user wants to push scope.

Every option must pass an agnostic relevance check before being shown:

- Would this option make sense for the stated audience and their task?
- Does it respect the product's risk level, emotional tone, and usage environment?
- Does it reflect stated visual, accessibility, technical, business, or regulatory constraints?
- Does the tradeoff help the user choose, instead of just naming a generic style?
- Would this option still sound reasonable if the product domain changed completely?

If an option feels generic, tone-deaf, or anchored to an unrelated example, rewrite it from the
current context. Examples in this skill are illustrative only and must not become reusable answer
templates.

## Required First Quiz

Before the first implementation, ask these questions as structured choices when possible. Each
question should have 3 generated options, with the safest or most likely option marked as
recommended.

1. Product mode: what kind of product is this?
2. Interface direction: what should the first screen feel like?
3. Visual style: what tone and density should guide the UI?
4. Color scheme: what palette direction should be used?
5. MVP depth: how functional should the first iteration be?

## Rounds

1. Project shape: name, purpose, audience, success criteria, launch scope, deployment assumptions.
2. Experience: product category, interface direction, visual tone, color scheme, references, brand
   assets, responsive priorities, a11y.
3. Users and permissions: roles, auth, authorization boundaries, privacy/compliance.
4. Features: user outcomes, priorities, states, dependencies, candidate feature-thread names.
5. Data and APIs: external systems, endpoints, auth, request/response shapes, caching, mock policy.
6. Business rules: entities, states, validation, calculations, locale/time/currency, idempotency.
7. Delivery: acceptance criteria, tests, E2E/a11y expectations, analytics, monitoring, rollout.

Each round should end with: "I captured X. Choose or adjust the recommended direction before I
continue."

## Output Contract

Produce a concise product brief suitable for `docs/product.md`:

- summary, audience, goals, and out-of-scope items
- visual direction and UX constraints
- roles and permissions
- prioritized feature candidates with `kebab-case-###` feature note names
- endpoint/API candidates and unknowns
- business rules and risky assumptions
- verification expectations
- recommended first iteration and 3-5 next product-development options

Then ask for approval before creating feature notes or implementation plans.

## After First Iteration

After delivering the first implementation, always include a `Next Development Options` section in the
final response:

- immediate polish: UX gaps, empty/error states, copy, responsive issues, accessibility
- product depth: next features that increase user value
- technical depth: APIs, persistence, auth, tests, observability
- design depth: visual system, component reuse, motion, onboarding
- validation: analytics, feedback loops, experiments, manual QA checklist

Make the next-step list optional and directional. The user may override it, but they should never be
left without a clear path forward.

## Pitfalls

- Do not dump the whole checklist at once.
- Do not turn the first route or `index.tsx` into the whole application.
- Do not skip visual and interaction questions just because the requester is technical.
- Do not ask only technical API questions; product managers and designers must be able to answer.
- Do not say the brief is "specific enough" when interface direction, MVP depth, or next-step
  priorities have not been confirmed by the user.
