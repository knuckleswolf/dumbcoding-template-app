# Product Context

No product-specific context is defined in this template.

When a project is created from this repository, keep durable product decisions here: target users,
core flows, business rules, mock credentials, demo data, state machines, localization constraints,
and launch-specific accessibility notes.

## Project Intake Briefing

Run the `project-intake` skill before creating feature threads or writing product code. The intake
should work like a guided interview inside one dialogue, not a static form the user must redesign.

The agent should ask one focused round at a time, give examples or options where helpful, summarize
answers after each round, and continue with the next round until the product brief is good enough to
plan features. If a tool for structured user input is available, use it for the highest-leverage
questions; otherwise ask concise numbered questions in chat.

The briefing should be choice-first. For ambiguous topics, offer 2-4 concrete options with a
recommended default and a custom-answer escape hatch. Even when the initial prompt contains product,
color, or feature hints, the agent should still confirm key choices before implementation.

Options must be generated from the user's actual context, audience, domain, user task, constraints,
risk profile, usage environment, and stated goals. Do not use fixed generic labels when they do not
fit. Each option should make a useful tradeoff clear.

If the agent surface supports Plan mode or structured user input, the first briefing round should use
that UI immediately, like a short quiz. If it is unavailable, ask the same selectable questions in
chat and wait for the answer. Do not replace this with a long free-form confirmation paragraph.

Keep unknowns explicit. Do not invent requirements silently.

## Generating Choices

For each question, synthesize three context-specific options:

- recommended: the safest fit for the user's goal, audience, domain, and constraints
- alternative: a plausible different direction with a clear tradeoff
- stretch: a more ambitious or differentiated direction if the user wants to expand scope

Before presenting options, check them agnostically:

- audience and task fit
- risk level, emotional tone, and usage environment
- visual, accessibility, technical, business, or regulatory constraints
- clear tradeoff between options
- no anchoring to an unrelated example or previous product domain

Examples may clarify the method, but they are not reusable answer templates.

## Required First Quiz

Before first implementation, confirm these decisions with generated 3-option questions and a
recommended default:

- product mode
- interface direction
- visual style and density
- color scheme
- MVP depth

The user may choose a proposed option, adjust it, or provide a custom answer. The goal is controlled
choice, not forcing the user to write a full product brief from scratch.

## Guided Rounds

### 1) Project Shape

- Project name and one-sentence purpose.
- Primary audience and secondary users.
- Problem being solved and measurable success criteria.
- Must-have launch scope, nice-to-have scope, and explicit out-of-scope items.
- Expected deployment target if known; otherwise list runtime assumptions only.

### 2) Experience And Visual Direction

- Product category: operational tool, marketing site, dashboard, editor, marketplace, internal app, or other.
- Interface direction generated from the product context.
- Desired tone: utilitarian, editorial, playful, premium, technical, minimal, consumer, enterprise, or other.
- Color scheme and contrast direction generated from the product context.
- Brand assets available: logo, colors, typography, icons, imagery, illustrations.
- Visual references: existing product, competitor, Figma, screenshot, website, or mood keywords.
- Accessibility requirements beyond repository defaults.
- Responsive priorities: desktop-first, mobile-first, equal, kiosk, embedded, or other.

### 3) Users, Roles, And Permissions

- User roles and what each role can view, create, update, delete, approve, or export.
- Authentication method and session expectations.
- Authorization boundaries that must be enforced server-side.
- Audit, compliance, privacy, or data-retention requirements.

### 4) Core Flows And Features

- List each feature as a short name plus the user outcome it supports.
- For each feature, define trigger, happy path, empty state, loading state, error state, and completion state.
- Decide which features need separate threads first and assign tentative `docs/features/<feature-slug>-<number>.md` names.
- Cross-feature dependencies and sequencing.
- Notifications, emails, uploads, exports, payments, search, filtering, reporting, or realtime needs.

### 5) Data And API

- External systems, API base URLs, and ownership.
- Endpoint list with method, path, purpose, auth requirements, request shape, response shape, and failure modes.
- Server-state caching expectations and invalidation events.
- Client-only state, persisted state, and sensitive data that must not be stored in the browser.
- Mock data policy for local development.

### 6) Business Logic

- Domain entities and required fields.
- State machines, transitions, approvals, calculations, limits, quotas, and validation rules.
- Timezone, currency, locale, formatting, and rounding rules.
- Retry, timeout, idempotency, and duplicate-submit behavior.

### 7) Delivery Criteria

- Acceptance criteria per feature.
- Test expectations: unit, component, integration, browser/E2E, accessibility, visual QA.
- Analytics, monitoring, logging, and error-reporting requirements.
- Rollout plan, migration needs, and backwards-compatibility constraints.

## Briefing Output

After the guided rounds, record:

- product summary and audience
- visual direction and UX constraints
- roles and permission model
- feature candidates with priority and feature-thread names
- endpoint/API candidates and unknowns
- business rules and risky assumptions
- verification expectations
- recommended first iteration
- 3-5 suggested next product-development options

Only then create per-feature plans. Implementation starts after the relevant feature plan is approved.

After the first implementation, the final response must include `Next Development Options`. Include
options for immediate polish, product depth, technical depth, design depth, and validation. The user
can override the path, but the template should not leave them without a clear direction.
