---
name: seo
description: Plan or implement SEO, sitemap, robots, metadata, SSR/prerendering, structured data, or public AI-agent parsing work.
---

## When to use

Use this skill for SEO-related tasks:

- route metadata, canonical URLs, Open Graph, Twitter Cards, JSON-LD
- sitemap.xml, robots.txt, llms.txt
- public indexing/noindex decisions
- SSR/prerendering requirements for public pages
- checking whether private routes/content can leak into public HTML or metadata

**Read first:** `SEO.md`, then inspect the actual framework/routing files.

## Framework Detection

Do not assume the host framework. Detect it from `package.json`, lockfile when needed, route files,
framework configs, middleware/auth files, and existing SEO utilities.

- TanStack Start/Router: `@tanstack/react-start`, `@tanstack/react-router`, `src/routes/*`,
  `routeTree.gen.ts`, `routes/__root.tsx`.
- Next.js: `next`, `app/`, `pages/`, `next.config.*`, `app/sitemap.ts`, `app/robots.ts`,
  `generateMetadata`.
- Other frameworks: use their equivalent server-side metadata, sitemap, robots, and rendering APIs.

## Checklist

- [ ] Classify every affected route as `public-indexable`, `public-non-indexable`, or
      `protected-private`.
- [ ] Treat unclear routes as non-indexable.
- [ ] Use explicit SEO visibility metadata; do not crawl every route file into sitemap.xml.
- [ ] Include only `public-indexable` entries in sitemap.xml and llms.txt.
- [ ] Exclude auth, workspace, user-private, draft, preview, tokenized, deleted, and session-dependent
      content.
- [ ] Ensure public indexable routes render meaningful initial HTML through SSR/prerendering/SSG or
      framework equivalent.
- [ ] Add unique title, description, canonical URL, Open Graph metadata, and relevant Twitter metadata.
- [ ] Add JSON-LD only when it matches visible public content.
- [ ] Verify generated HTML response, sitemap.xml, robots.txt, and llms.txt output.

## TanStack Start Notes

- Use route-level `head()` for metadata.
- Root must render `<HeadContent />` in `<head>` and `<Scripts />` in `<body>`.
- `ssr: false` must not be used for `public-indexable` routes.
- Prefer a custom `/sitemap.xml` server route for dynamic public content backed by explicit visibility
  metadata or public CMS/database records.

## Pitfalls

- Do not use route path deny-lists as the privacy model.
- Do not expose private user/session/workspace data in public metadata, JSON-LD, sitemap, llms.txt, or
  prerendered HTML.
- Do not generate dynamic metadata from client-only state.
- Do not rely on robots.txt to protect private content.
