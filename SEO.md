# SEO Policy

Use this document only for SEO, sitemap, robots, indexing, metadata, SSR/prerendering, structured
data, or public AI-agent parsing work. For implementation workflow, use `.agents/skills/seo`.

## Core Rule

Only explicitly public, indexable routes may be optimized for search indexing or included in
`sitemap.xml`, `llms.txt`, public structured data, public Open Graph strategy, or crawlable public
SEO registries.

Do not infer privacy from path names. A route is private when it depends on authentication,
authorization, membership, permissions, payment, invitation/token access, server-side access checks,
route guards, middleware, private API data, or private session data.

If classification is unclear, treat the route as non-indexable.

## Route Visibility

Use an explicit route metadata source instead of blindly crawling route files.

```ts
export type SeoRouteVisibility =
  | 'public-indexable'
  | 'public-non-indexable'
  | 'protected-private';

export type SeoRouteEntry = {
  path: string;
  visibility: SeoRouteVisibility;
  title?: string;
  description?: string;
  canonical?: string;
  lastmod?: string;
};
```

- `public-indexable`: public, intended for search, meaningful initial HTML, canonical metadata.
- `public-non-indexable`: public but should not appear in search; use `noindex`.
- `protected-private`: requires private access; never index or expose private content in public HTML,
  metadata, JSON-LD, sitemap, or `llms.txt`.

## Sitemap

Generate `sitemap.xml` from explicit SEO visibility metadata and public published content.

Include only `public-indexable` entries. Exclude drafts, previews, deleted content, tokenized URLs,
tracking/session parameters, workspace/user-private content, authenticated search results, and any
route that depends on a private session to render its main content.

For static apps with a small fixed public route set, `public/sitemap.xml` is acceptable. For dynamic
public content, prefer a framework-native sitemap API or a server route such as `/sitemap.xml` that
returns XML from server-side public data.

For TanStack Start, use a custom `/sitemap.xml` server route when entries depend on CMS/database
metadata or explicit route visibility. Ensure static deployments generate the sitemap at build time
when required by the target host.

## Rendering And Metadata

Every `public-indexable` route must return meaningful initial HTML through SSR, prerendering, SSG,
ISR-like regeneration, or the framework equivalent. Do not make public SEO pages client-only.

For TanStack Start, `ssr: false` disables server rendering for the initial request and must not be
used for `public-indexable` routes.

Every `public-indexable` route should define unique title, description, canonical URL, Open Graph
metadata, Twitter Card metadata where relevant, and JSON-LD only when it matches visible public
content. Dynamic metadata must come from server-available public data, not client-only state.

## Robots And AI-Agent Parsing

`robots.txt` may reference the production sitemap and allow crawling public indexable content, but it
is not a privacy boundary. Protect private content with auth/authz and server-side checks.

`llms.txt` is optional and must include only public indexable or intentionally public documentation
URLs. Public content should use semantic HTML, one clear primary `h1`, logical headings, meaningful
links, accessible images, and initial HTML that can be parsed without client-side interaction.

## Verification

Before SEO work is complete, verify the generated initial HTML and public files:

- public content appears in the initial HTML response
- title, description, canonical, Open Graph, and JSON-LD are correct where applicable
- sitemap contains only `public-indexable` URLs
- sitemap and `llms.txt` exclude protected/private and public non-indexable routes
- private content is not exposed in public HTML, metadata, prerendered output, or static files
